'use client'

import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-600 dark:text-gray-400">
        {/* Left: Branding */}
        <div className="text-center md:text-left">
          <p className="font-semibold text-black dark:text-white">Ephora</p>
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        {/* Right: Navigation */}
        <div className="flex flex-wrap justify-center gap-4 md:justify-end">
          <Link href="/#features" className="hover:text-blue-600 transition">Features</Link>
          <Link href="/#faq" className="hover:text-blue-600 transition">FAQ</Link>
          <Link href="/auth/login" className="hover:text-blue-600 transition">Login</Link>
          <Link href="/auth/signup" className="hover:text-blue-600 transition">Sign Up</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
