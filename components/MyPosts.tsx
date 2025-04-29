'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Post {
  id: string;
  created_at: string;
  content: string;
}

const MyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyPosts = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        console.error('Not logged in')
        setLoading(false)
        return
      }

      const userId = userData.user.id

      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (postsError) {
        console.error('Error fetching posts:', postsError)
      } else {
        setPosts(posts)
      }

      setLoading(false)
    }

    fetchMyPosts()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className=" p-4 rounded-lg bg-white shadow-[4px_4px_0px_black] border-black border-2">
          <p className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleString()}
          </p>
          <p className="text-md font-medium">{post.content}</p>
        </div>
      ))}
    </div>
  )
}

export default MyPosts  
