'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Post {
  id: string
  content: string
  created_at: string
  user_id: string
  mock_score: number
}

export default function RecommendationPage() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, content, created_at, user_id')

      if (error) {
        console.error('Error fetching posts:', error)
        // Handle error appropriately, e.g., set posts to an empty array or show a message
        setPosts([]) 
        return
      }

      // Add mock "score" for recommendation
      const scored = (data as Post[] || []).map((post) => ({
        ...post,
        mock_score: Math.random() * 100 // Simulate a smart algorithm
      }))

      // Sort by score
      const sorted = scored.sort((a, b) => b.mock_score - a.mock_score)

      

      setPosts(sorted)

      
    }

    fetchPosts()
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Recommended For You</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet. Try again later!</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900"
          >
            <div className="text-sm text-gray-500">
              Score: <strong>{post.mock_score.toFixed(1)}</strong> •{' '}
              {new Date(post.created_at).toLocaleString()}
            </div>
            <p className="text-lg mt-2 text-black dark:text-white">{post.content}</p>
          </div>
        ))
      )}
    </div>
  )
}
