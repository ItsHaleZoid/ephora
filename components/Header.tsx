'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/app/hooks/useCurrentUser'
import BurgerMenu from '@/components/ui/burger-menu'
import ButtonShadow from '@/components/ui/button-shadow'
import { ButtonArrow } from './ui/button-arrow'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const user = useCurrentUser()

  const [IsActive, setIsActive] = useState<'features' | 'pricing' | 'communities' | undefined>()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={` bg-black fixed top-0 left-0 w-full z-50 transition-all ${isScrolled ? 'bg-white/50 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-zinc-800 ' : 'bg-white/20'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-blue-600 ">
          Ephora
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
          <Link href="/#features" className={`hover:text-blue-600 ${IsActive === 'features' ? 'bg-blue-600 text-white rounded-md p-2 transition-all duration-300 hover:text-white' : ''}`} onClick={() => setIsActive('features')}>Features</Link>
          <Link href="/#pricing" className={`hover:text-blue-600 ${IsActive === 'pricing' ? 'bg-blue-600 text-white rounded-md p-2 transition-all duration-300 hover:text-white' : ''}`} onClick={() => setIsActive('pricing')}>Pricing</Link>
          <Link href="/communities" className={`hover:text-blue-600 ${IsActive === 'communities' ? 'bg-blue-600 text-white rounded-md p-2 transition-all duration-300 hover:text-white' : ''}`} onClick={() => setIsActive('communities')}>Communities</Link>
        </nav>

        {/* Auth Actions */}
        <div className="flex gap-4">
          {!user ? (
            <>
              <Link href="/auth/login/">
                <ButtonShadow color="bg-yellow-400" size="sm">Login</ButtonShadow>
              </Link>
              <Link href="/auth/signup/">
                <ButtonShadow variant="default" size="sm">Sign Up</ButtonShadow>
              </Link>
            </>
          ) : (
            <BurgerMenu />
          )}
        </div>
      </div>
    </header>
  )
}
