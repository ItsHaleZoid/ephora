'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) setError(error.message)
    else router.push('/feed')

    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-white dark:bg-black px-6">
      <div className="w-full max-w-md space-y-6 border border-gray-200 dark:border-zinc-800 p-8 rounded-xl shadow-[-6px_-6px_0px_rgba(0,0,0,0.1),_2px_2px_25px_rgba(0,0,0,0.15)]">
        <h1 className="text-3xl font-bold text-center">Welcome back!</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleLogin} className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <div className="flex items-center gap-2 my-4">
          <div className="h-px flex-1 bg-gray-300 dark:bg-zinc-700" />
          <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-300 dark:bg-zinc-700" />
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="w-5 h-5" />
          Sign in with Google
        </Button>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  )
}
