'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import CreatePost from '@/components/CreatePost'

interface Post {
  id: string
  content: string
  created_at: string
  user_id: string
  username: string
  likes: { id: string; user_id: string }[]
  likes_count: number
  replies: Reply[]
  comment_replies?: Reply[]
}

interface Reply {
  id: string
  content: string
  created_at: string
  user_id: string
  username: string
  reply_id: string
  comment_replies?: Reply[]
  replies_id: string
}

function FeedElements() {
  const [posts, setPosts] = useState<Post[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [view, setView] = useState<'latest' | 'top'>('latest')
  const [replyInput, setReplyInput] = useState<{ [postId: string]: string }>({})
  const [replyVisible, setReplyVisible] = useState<{ [postId: string]: boolean }>({})
  const [replyToReplyInput, setReplyToReplyInput] = useState<{ [replyId: string]: string }>({})
  const [replyToReplyVisible, setReplyToReplyVisible] = useState<{ [replyId: string]: boolean }>({})
  const [showCommentReplies, setShowCommentReplies] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUserId(data.user?.id ?? null)
    }
    getUser()
  }, [])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        created_at,
        user_id,
        likes ( id, user_id ),
        replies (
          id,
          content,
          created_at,
          user_id,
          comment_replies ( id, content, created_at, user_id )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    const userIds = new Set<string>()
    data?.forEach(post => {
      userIds.add(post.user_id)
      post.replies.forEach(reply => {
        userIds.add(reply.user_id)
        reply.comment_replies.forEach(commentReply => {
          userIds.add(commentReply.user_id)
        })
      })
    })

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', Array.from(userIds))

    if (profilesError) {
      console.error(profilesError)
      return
    }

    const userIdToUsername = profiles?.reduce((acc, profile) => {
      acc[profile.id] = profile.username
      return acc
    }, {} as Record<string, string>)

    let enriched = (data ?? []).map((post) => ({
      ...post,
      username: userIdToUsername[post.user_id],
      likes_count: post.likes?.length ?? 0,
      replies: post.replies.map(reply => ({
        ...reply,
        username: userIdToUsername[reply.user_id],
        comment_replies: reply.comment_replies.map(commentReply => ({
          ...commentReply,
          username: userIdToUsername[commentReply.user_id]
        }))
      }))
    }))

    if (view === 'top') {
      enriched = enriched.sort((a, b) => b.likes_count - a.likes_count)
    }

    setPosts(enriched)
  }

  useEffect(() => {
    fetchPosts()
  }, [view])

  const handleLike = async (postId: string) => {
    if (!userId) return

    const alreadyLiked = posts.find(p => p.id === postId)?.likes.some(l => l.user_id === userId)

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        const updatedLikes = alreadyLiked
          ? post.likes.filter((l) => l.user_id !== userId)
          : [...post.likes, { id: crypto.randomUUID(), user_id: userId }]
        return { ...post, likes: updatedLikes, likes_count: updatedLikes.length }
      })
    )

    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existingLike) {
      await supabase.from('likes').delete().eq('id', existingLike.id)
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: userId })
    }
  }

  const handleReplySubmit = async (postId: string) => {
    const content = replyInput[postId]
    if (!content || !userId) return

    await supabase.from('replies').insert({ post_id: postId, user_id: userId, content })

    setReplyInput((prev) => ({ ...prev, [postId]: '' }))
    const textarea = document.querySelector(
      `textarea[data-post-id="${postId}"]`
    ) as HTMLTextAreaElement

    if (textarea) {
      textarea.style.height = 'auto'
    }
    fetchPosts()
  }

  const handleReplyToReplySubmit = async (replyId: string) => {
    const content = replyToReplyInput[replyId]
    if (!content || !userId) return

    // Insert the reply to the 'comment_replies' table
    await supabase.from('comment_replies').insert({ reply_id: replyId, user_id: userId, content })

    // Fetch the newly inserted reply to ensure it was added
    const { data: newReply, error } = await supabase
      .from('comment_replies')
      .select('*')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching new reply:', error)
      return
    }

    console.log('New reply added:', newReply)

    setReplyToReplyInput((prev) => ({ ...prev, [replyId]: '' }))
    const textarea = document.querySelector(
      `textarea[data-reply-id="${replyId}"]`
    ) as HTMLTextAreaElement

    if (textarea) {
      textarea.style.height = 'auto'
    }
    fetchPosts()
  }

  const handleRepost = async (postId: string) => {
    if (!userId) return

    const { data: existing } = await supabase
      .from('reposts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle()

    if (!existing) {
      await supabase.from('reposts').insert({ post_id: postId, user_id: userId })
      alert('✅ Reposted!')
    } else {
      alert('🔁 Already reposted')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 mt-8">
      <CreatePost onPostCreated={fetchPosts} />

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('latest')}
          className={`text-sm px-3 py-1 rounded-full shadow-[3px_3px_0px_black] border-black border-2 transition-transform duration-200 ${
            view === 'latest'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-zinc-800 text-gray-600'
          } hover:scale-105 active:scale-95`}
        >
          🕒 Latest
        </button>
        <button
          onClick={() => setView('top')}
          className={`text-sm px-3 py-1 rounded-full shadow-[3px_3px_0px_black] border-black border-2 transition-transform duration-200 ${
            view === 'top'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-zinc-800 text-gray-600'
          } hover:scale-105 active:scale-95`}
        >
          🔥 Top
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => {
          const liked = post.likes.some((l) => l.user_id === userId)
          const isReplySectionVisible = replyVisible[post.id]

          return (
            <div
              key={post.id}
              className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_black] border-black border-2"
            >
              <p className="text-sm text-gray-500">
                {post.username} - {new Date(post.created_at).toLocaleString()}
              </p>
              <p className="text-lg mt-2 text-black dark:text-white">{post.content}</p>

              <div className="mt-4 flex gap-6 text-sm text-gray-600 items-center">
                <button
                  onClick={() => handleLike(post.id)}
                  className="transition-transform duration-200 hover:scale-110 active:scale-95"
                >
                  {liked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 inline-block text-blue-500"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 inline-block"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  )}{" "}
                  {post.likes_count} Like
                </button>
                <button
                  onClick={() => {
                    setReplyVisible((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }}
                  className="flex items-center transition-transform duration-200 hover:scale-110 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 inline-block mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                  {post.replies?.length ?? 0}{" "}
                  {post.replies?.length === 0 || post.replies?.length === 1
                    ? "Reply"
                    : "Replies"}
                </button>
                <button
                  onClick={async () => {
                    await handleRepost(post.id)
                  }}
                  className="flex items-center transition-transform duration-200 hover:scale-110 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                    />
                  </svg>
                  Repost
                </button>
              </div>

              <div 
                className={`
                  transition-all duration-300 ease-in-out overflow-hidden 
                  ${isReplySectionVisible 
                    ? 'max-h-[500px] opacity-100 mt-4 border-t pt-4'
                    : 'max-h-0 opacity-0 mt-0 border-t-0 pt-0'
                  }
                `}
                style={{ maxHeight: isReplySectionVisible ? '500px' : '0px' }}
              >
                 <div className={`space-y-4 ${isReplySectionVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 delay-100`}>
                    <div className="space-y-2">
                        <textarea
                          value={replyInput[post.id] ?? ""}
                          onChange={(e) => {
                            const el = e.target
                            setReplyInput((prev) => ({
                              ...prev,
                              [post.id]: el.value,
                            }))
                            el.style.height = "auto"
                            el.style.height = `${el.scrollHeight}px`
                          }}
                          rows={2}
                          placeholder="Write a reply..."
                          className="w-full p-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm resize-none overflow-hidden transition-all duration-150 ease-in-out shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          data-post-id={post.id}
                        />
                        <button
                          onClick={() => handleReplySubmit(post.id)}
                          className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
                        >
                          Send Reply
                        </button>
                    </div>

                    {/*Post Replies*/}.....
                    
                    {post.replies && post.replies.length > 0 && (
                      <div className="pt-3 space-y-3 text-sm border-t border-gray-200 dark:border-zinc-700"> 
                        <h4 className="font-semibold text-xs text-gray-500 dark:text-gray-400">
                          Replies:
                        </h4>
                        {post.replies.map((reply) => {
                          const isReplyToReplyVisible = replyToReplyVisible[reply.id]
                          const isCommentRepliesVisible = showCommentReplies[reply.id] ?? false;
                          return (
                            <div
                              key={reply.id}
                              className="pl-2 border-l-2 border-gray-200 dark:border-zinc-700"
                            >
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {reply.username} - {new Date(reply.created_at).toLocaleString()}
                              </p>
                              <p className="text-black dark:text-white mt-1">
                                {reply.content}
                              </p>
                              <button
                                onClick={() => {
                                  setReplyToReplyVisible((prev) => ({
                                    ...prev,
                                    [reply.id]: !prev[reply.id],
                                  }))
                                }}
                                className="text-xs text-blue-500 hover:underline"
                              >
                                Reply
                              </button>
                              {isCommentRepliesVisible && reply.comment_replies && reply.comment_replies.length > 0 && (
                                <div>
                                  {reply.comment_replies.map((commentReply) => (
                                    <div key={commentReply.id}>
                                      <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {commentReply.username} - {new Date(commentReply.created_at).toLocaleString()}
                                      </p>
                                      <p>{commentReply.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div 
                                className={`
                                  transition-all duration-300 ease-in-out overflow-hidden 
                                  ${isReplyToReplyVisible 
                                    ? 'max-h-[500px] opacity-100 mt-2'
                                    : 'max-h-0 opacity-0 mt-0'
                                  }
                                `}
                                style={{ maxHeight: isReplyToReplyVisible ? '500px' : '0px' }}
                              >
                                {isReplyToReplyVisible && (
                                  <div className="mt-2">
                                    <textarea
                                      value={replyToReplyInput[reply.id] ?? ""}
                                      onChange={(e) => {
                                        const el = e.target
                                        setReplyToReplyInput((prev) => ({
                                          ...prev,
                                          [reply.id]: el.value,
                                        }))
                                        el.style.height = "auto"
                                        el.style.height = `${el.scrollHeight}px`
                                      }}
                                      rows={2}
                                      placeholder="Write a reply to this reply..."
                                      className="w-full p-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm resize-none overflow-hidden transition-all duration-150 ease-in-out shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                      data-reply-id={reply.id}
                                    />
                                    <button
                                      onClick={() => handleReplyToReplySubmit(reply.id)}
                                      className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
                                    >
                                      Send Reply
                                    </button>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setShowCommentReplies(prev => ({
                                    ...prev,
                                    [reply.id]: !prev[reply.id]
                                  }));
                                }}
                                className="text-xs text-gray-500 hover:underline ml-2"
                              >
                                {showCommentReplies[reply.id] ? 'Hide Replies' : 'Show Replies'}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
           
          )
        })}
      </div>
    </div>
  )
}

export default FeedElements;