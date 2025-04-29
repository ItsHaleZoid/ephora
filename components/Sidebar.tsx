'use client'
import { useState, useEffect } from 'react';
import { FaHome, FaHashtag, FaBell, FaUser } from 'react-icons/fa';
import { Button } from './ui/button';
import ButtonShadow from './ui/button-shadow';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { supabase } from '@/lib/supabase/client'
import { Loader } from 'lucide-react';
import CreatePost from './CreatePost';
import { log } from 'console';
import BackButton from './BackButton';

interface AuthUser {
  name: string;
  username: string;
  avatar: string;
  id: string;
  email: string;
}
 
async function fetchProfile(id: string) {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', id)
    .single()
  return data;
}

const Sidebar = () => {
  const [active, setActive] = useState('home');
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [showCommentReplies, setShowCommentReplies] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log("User ID:", user.id);
        setUserId(user.id);
      }
      setIsLoading(false);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      fetchProfile(userId).then(profile => {
        setUsername(profile?.username || '');
        setIsLoading(false);
      });
    }
  }, [userId]);

  const handleFocus = () => {
    return <CreatePost onPostCreated={() => {}} autoFocus={true} />
    console.log("Focusing on post input");
  }

  const toggleCommentReplies = (replyId: string) => {
    setShowCommentReplies(prev => ({
      ...prev,
      [replyId]: !prev[replyId]
    }));
  }

  return (
    <div className="flex flex-col h-screen w-80 px-6 py-2 bg-gray-300  text-white border-r-3 border-l-0 border-t-0 border-b-0 border-white border-2 shadow-[8px_0px_0px_black]">
        <div className='mb-10'>
        <Avatar className='w-25 h-25 mt-5 flex justify-center items-center -mb-10'>
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center -mt-20">
              <Loader className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              <AvatarImage src="https://github.com/shadcn.png" />
              
              <AvatarFallback>CN</AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="flex flex-col gap-2 h-16"> 
          {isLoading ? (
            <div className="flex justify-center items-center -mt-10">
              <Loader className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : (
            <h1 className="text-xl font-regular text-gray-600 mt-12 ">
              @{username}
            </h1>
          )}
        </div>
        <div className="flex-1 mt-10 border-b border-gray-700">
        <ul className="space-y-2">
          <li className={`p-4 text-gray-700 ${active === 'home' ? 'bg-gray-700 text-white rounded-md' : ''}`} onClick={() => setActive('home')}>
            <FaHome className={`${active === 'home' ? 'text-white' : 'text-gray-700'} inline-block mr-2`} /> Home
          </li>
          <li className={`p-4 text-gray-700 ${active === 'trending' ? 'bg-gray-700 text-white rounded-md' : ''}`} onClick={() => setActive('trending')}>
            <FaHashtag className={`${active === 'trending' ? 'text-white' : 'text-gray-700'} inline-block mr-2`} /> Trending
          </li>
          <li className={`p-4 text-gray-700 ${active === 'notifications' ? 'bg-gray-700 text-white rounded-md' : ''}`} onClick={() => setActive('notifications')}>
            <FaBell className={`${active === 'notifications' ? 'text-white' : 'text-gray-700'} inline-block mr-2`} /> Notifications
          </li>
          <li className={`p-4 text-gray-700 ${active === 'profile' ? 'bg-gray-700 text-white rounded-md' : ''}`} onClick={() => setActive('profile')}>
            <FaUser className={`${active === 'profile' ? 'text-white' : 'text-gray-700'} inline-block mr-2`} /> Profile
          </li>
        </ul>
      </div>
      <div className="flex-1 mt-10 border-t border-gray-700"></div>
      <ButtonShadow size='lg' width='w-full' fontColor='text-black' color='bg-green-500' onClick={() => {
        const postInputRef = document.querySelector('textarea');
        if (postInputRef) {
          postInputRef.focus();
        }
      }}>New Post</ButtonShadow>
     
    </div>
    <div className='flex items-center mt-50 '>
    <BackButton color='bg-black'/>
    </div>
    </div>
  );
};

export default Sidebar;