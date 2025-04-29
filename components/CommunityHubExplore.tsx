"use client";

import { useRef, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import ButtonShadow from "./ui/button-shadow";
import { Input } from "./ui/input";
import LinkPaperclip from "./ui/link-paperclip";

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  community_id: string;
  username: string;
  image: string;
  date: string;
}

interface CommunityHubProps {
  communityId: string;
}

const CommunityHubExplore = ({ communityId }: CommunityHubProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("community_id", communityId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error.message);
      } else {
        const messagesWithProfile = await Promise.all(
          (data || []).map(async (message: Message) => {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('username, image')
              .eq('id', message.user_id);

            if (profileError) {
              console.error("Failed to fetch profile:", profileError.message);
              return message;
            }

            const profile = profileData[0] || {};

            return {
              ...message,
              username: profile.username,
              image: profile.image,
            };
          })
        );
        setMessages(messagesWithProfile);
      }
    };

    if (communityId) {
      fetchMessages();
    }
  }, [communityId]);

  useEffect(() => {
    if (!communityId) return;
  
    const channel = supabase
      .channel('realtime-messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `community_id=eq.${communityId}`,
      }, (payload) => {
        console.log('🔔 New realtime payload:', payload);
  
        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      });
  
    channel.subscribe((status) => {
      console.log('📡 Realtime channel status:', status);
    });
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [communityId]);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  
    const fileName = `${Date.now()}-${file.name}`;
  
    const { data, error } = await supabase.storage
      .from('chat-images')
      .upload(fileName, file);
  
    if (error) {
      console.error('Image upload failed:', error.message);
      return;
    }
  
    const { data: urlData } = supabase.storage
      .from('chat-images')
      .getPublicUrl(fileName);
  
    const publicUrl = urlData?.publicUrl;
    if (!publicUrl) {
      console.error('Failed to get public URL');
      return;
    }
  
    console.log('Image uploaded:', publicUrl);
  
    setNewMessage(publicUrl);
  };
  
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  
    if (userError || !user) {
      console.error("Failed to get user:", userError?.message);
      return;
    }
  
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();
  
    if (profileError || !profileData?.username) {
      console.error("Failed to fetch username:", profileError?.message);
      return;
    }
  
    const { error } = await supabase.from('messages').insert({
      content: newMessage,
      community_id: communityId,
      user_id: user.id,
      username: profileData.username,
    });
  
    if (error) {
      console.error('Failed to send message:', error.message);
    } else {
      setNewMessage('');
      setImagePreview(null);
    }
  };
  
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Failed to get user:", userError.message);
        return;
      }

      setCurrentUserId(user?.id || null);
      setCurrentUsername(user?.user_metadata.username || null);
    };

    fetchUser();
  }, []);
  
  const formatDate = (dateString: string, index: number) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const lastMessageDate = index > 0 ? new Date(messages[index - 1].created_at) : null;
    const diffMinutes = lastMessageDate ? Math.abs((date.getTime() - lastMessageDate.getTime()) / (1000 * 60)) : 0;

    if (diffDays < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays <= 3 && (!lastMessageDate || diffMinutes > 60)) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">  
      <div>
        <div className="flex justify-end mr-5 pl-4 ">
            <h1 className="w-200 mr-104 -mb-14 mt-6 flex justify-center h-15 text-5xl text-sky-100 bg-blue-500 rounded-full shadow-[6px_6px_0px_#000] border-2 border-black pt-0.5">Explore & Discover</h1>
          <Input
            placeholder="Search"
            type="text"
            className="bg-gray-400 rounded-full placeholder:text-gray-600 text-gray-700 pr-7 w-100 -mb-14 mt-8 h-12 shadow-[6px_6px_0px_#000] border-2 border-black"
          />
        </div>
      </div>
      
      <div className="flex-col flex-1 p-4 -mt-5">
        <div className="flex-1 mb-4 p-4 space-y-2 bg-gray-300 overflow-y-auto overflow-x-hidden rounded-lg shadow-[6px_6px_0px_#000] border-2 border-black h-160 mt-19">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400">No messages yet.</div>
          ) : (
            messages.map((msg, index) => {
              const isImage = msg.content.startsWith('https://');
              const showDate = index === 0 || index % 5 === 0;
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center justify-center mb-2">
                      <div className="border-b-2 border-gray-400 flex-grow"></div>
                      <span className="mx-2 text-gray-500 text-sm">{formatDate(msg.created_at, index)}</span>
                      <div className="border-b-2 border-gray-400 flex-grow"></div>
                    </div>
                  )}
                  <div className="bg-gray-50 text-gray-800 p-3 rounded-lg shadow-[2px_2px_0px_#000] border-2 border-black animate-pop-in w-fit max-w-[70%] break-words">
                    <div className="flex flex-row items-start gap-2">
                      <img src={msg.image} alt="Profile" className="w-10 h-10 rounded-full" />
                      <div className="flex flex-col">
                        <strong className="text-gray-500">{msg.username}</strong>
                        {isImage ? (
                          <img src={msg.content} alt="Uploaded" className="mt-2 rounded-lg max-w-xs max-h-80 object-cover border" />
                        ) : (
                          <div className="mt-1">{msg.content}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div ref={bottomRef} />
        <div>
          {imagePreview ? (
            <div className="mb-2 rounded-full px-4 py-2 bg-gray-400 h-12 placeholder:text-gray-800 text-gray-700 pr-16 shadow-[6px_6px_0px_#000] border-2 border-black w-300">
                <p className="ml-22">&nbsp; Click 'Send' to upload this image ➜</p>
              <img src={imagePreview} alt="Preview" className="w-auto h-auto max-w-xs max-h-20 rounded-full shadow-[2px_2px_0px_#000] border-2 border-black -mt-13 " />
            </div>
          ) : (
            <div>
              <div className="w-300">
                <Input
                  type="text"
                  className="rounded-full px-4 py-2 bg-gray-400 h-12 placeholder:text-gray-800 text-gray-700 pr-16 shadow-[6px_6px_0px_#000] border-2 border-black w-300"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
              </div>
            </div>
          )}
              
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 justify-center mt-185 mr-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <input
                  type="file"
                  id="fileInput"
                  className="absolute inset -0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
                <LinkPaperclip
                  className="w-6 h-6 cursor-pointer transform transition-transform duration-200 hover:scale-110"
                  onClick={() => document.getElementById('fileInput')?.click()}
                />
              </div>
              <ButtonShadow
                onClick={sendMessage}
                rounded="rounded-full"
                width="w-30"
                height="h-12"
              >
                Send
              </ButtonShadow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHubExplore;
