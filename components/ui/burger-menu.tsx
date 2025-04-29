'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="relative z-50">
      {/* Hamburger Icon */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md focus:outline-none">
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Slide-out Menu */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-56 bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#001d2e]  border-2 border-black rounded-lg p-4 space-y-3">
          <a href="/" className="block text-sm font-medium hover:underline" onClick={handleLogout}>Logout</a>
          <a href="/account" className="block text-sm font-medium hover:underline">Account</a>
         
        </div>
      )}
    </div>
  )
}
