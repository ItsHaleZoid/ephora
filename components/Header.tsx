'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 w-full z-50  transition-all ${isScrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-zinc-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-blue-600">
          Ephora
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium ml-11">
          <Link href="/#features" className="hover:text-blue-600">Features</Link>
          <Link href="/#pricing" className="hover:text-blue-600">Pricing</Link>
          <Link href="/#community" className="hover:text-blue-600">Community</Link>
        </nav>

        {/* Auth Actions */}
        <div className="flex gap-2">
          <Link href="/auth/login/">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/auth/signup/">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
