'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Post {
  id: string
  content: string
  created_at: string
  user_id: string
}

const FeedPage = () => {
  const [data, setData] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
        const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          user_id,
        `)
        .order('created_at', { ascending: false })
      

      if (error) {
        console.error('Error fetching posts:', error)
        return
      }

      setData(data || [])
    }

    fetchPosts()
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
    {data.length === 0 ? (
      <p className="text-center text-gray-500">No posts found.</p>
    ) : (
      data.map((post) => (
        <div
          key={post.id}
          className="p-4 border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900"
        >
          <p className="text-sm text-gray-500">
            {post.user_id} • {new Date(post.created_at).toLocaleString()}
          </p>
          <p className="text-lg mt-2 text-black dark:text-white">{post.content}</p>
        </div>
      ))
    )}
  </div>
)
}

export default FeedPage
