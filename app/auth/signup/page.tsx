'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User } from 'lucide-react'
import ButtonShadow from '@/components/ui/button-shadow'
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) setError(error.message)
    else router.push('/feed')

    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <main>
    
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br  from-white to-zinc-100 dark:from-black dark:to-zinc-900">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-950 rounded-2xl shadow-[10px_10px_0px_black] border-3 border-black  p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Sign up to Ephora</h2>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 pl-10 text-sm bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 pl-10 text-sm bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <ButtonShadow onClick={handleSignUp} width="w-full" color="bg-blue-400">
            {loading ? 'Signing up...' : 'Sign up'}
          </ButtonShadow>
        </div>

        <div className="flex items-center justify-center py">
          <span className="text-lg text-gray-400">or</span>
        </div>

        <ButtonShadow onClick={handleGoogleLogin} variant="default" width="w-full" color="bg-gray-100">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4 mr-2" />
          Sign in with Google
        </ButtonShadow>
      </div>
    </div>
    </main>
  )
}
