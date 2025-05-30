'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import ButtonShadow from '@/components/ui/button-shadow'

interface CreatePostProps {
  onPostCreated?: () => void
  inputRef?: React.RefObject<HTMLTextAreaElement | null>
  autoFocus?: boolean
}

export default function CreatePost({ onPostCreated, inputRef, autoFocus = false }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus()
    }
  }, [autoFocus, textareaRef])

  const handlePost = async () => {
    if (!content.trim()) return
    setLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to post.')
      setLoading(false)
      return
    }
    const { error: insertError } = await supabase.from('posts').insert({
      content,
      user_id: user.id,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setContent('')
      onPostCreated?.() // ✅ triggers refresh in parent
    }

    setLoading(false)
  }

  const focusTextarea = () => {
    textareaRef.current?.focus()
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 space-y-2">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full h-28 px-4 py-3 rounded-md dark:border-zinc-700 resize-none bg-white dark:bg-zinc-900 text-sm shadow-[6px_6px_0px_black] border-black border-2"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button onClick={handlePost} disabled={loading || content.trim().length === 0} className="w-full shadow-[6px_6px_0px_#002605] border-black border-2 bg-green-400 transition-all duration-200 ease-in-out hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-[0px_0px_0px_#002605] active:scale-95">
        {loading ? 'Posting...' : 'Post'}
      </Button>
    </div>
  )
}
