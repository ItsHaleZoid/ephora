'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function Subscribe() {
  const [email, setEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data?.user?.email || null)
      setUserId(data?.user?.id || null)
    })
  }, [])

  const handleCheckout = async () => {
    const res = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ userId, email }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Unlock Premium</h2>
      <Button onClick={handleCheckout}>Subscribe for $5/month</Button>
    </div>
  )
}
