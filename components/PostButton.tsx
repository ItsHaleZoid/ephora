'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface PostButtonProps {
  content: string
  onPostCreated?: () => void
  buttonText?: string
  loadingText?: string
}

export default function PostButton({ content, onPostCreated, buttonText = 'Post', loadingText = 'Posting...' }: PostButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      onPostCreated?.() // ✅ triggers refresh in parent
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 space-y-2">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button onClick={handlePost} disabled={loading || content.trim().length === 0} className="w-full shadow-[6px_6px_0px_#002605] border-black border-2 bg-green-400 transition-all duration-200 ease-in-out hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-[0px_0px_0px_#002605] active:scale-95">
        {loading ? loadingText : buttonText}
      </Button>
    </div>
  )
}
