'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const CreatePost = ({ onPostCreated }: { onPostCreated?: () => void }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePost = async () => {
    setLoading(true)
    const user = await supabase.auth.getUser()
    if (!user.data.user) return

    await supabase.from('posts').insert({
      content,
      user_id: user.data.user.id,
    })

    setContent('')
    setLoading(false)
    onPostCreated?.()
  }

  return (
    <div className="w-full space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full h-24 border px-4 py-3 rounded-md bg-white dark:bg-zinc-900"
      />
      <Button className="w-full" onClick={handlePost} disabled={loading || !content}>
        {loading ? 'Posting...' : 'Post'}
      </Button>
    </div>
  )
}

export default CreatePost;