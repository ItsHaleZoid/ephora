'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useCurrentUser() {
  const [user, setUser] = useState<null | { id: string; email: string }>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return user
}
export default useCurrentUser
