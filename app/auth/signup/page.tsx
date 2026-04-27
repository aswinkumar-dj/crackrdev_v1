'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function SignupPage() {
  const router = useRouter()
  const { signUp, signInWithGithub } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password)
      setSuccess(true)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create account'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGithubSignUp = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGithub()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign up with GitHub'
      )
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="rounded-md bg-green-50 p-4 border border-green-400">
            <h2 className="text-lg font-semibold text-green-900">Verification email sent!</h2>
            <p className="mt-2 text-sm text-green-700">
              Check your email to verify your account before signing in.
            </p>
          </div>
          <Link href="/auth/login" className="text-[#17a1a6] hover:text-[#12898e]">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Create your account</h2>
          <p className="mt-2 text-gray-700">Start your free interview prep today</p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 px-3 py-2 text-gray-700 placeholder-gray-500 focus:border-[#17a1a6] focus:outline-none focus:ring-1 focus:ring-[#17a1a6]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 px-3 py-2 text-gray-700 placeholder-gray-500 focus:border-[#17a1a6] focus:outline-none focus:ring-1 focus:ring-[#17a1a6]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 px-3 py-2 text-gray-700 placeholder-gray-500 focus:border-[#17a1a6] focus:outline-none focus:ring-1 focus:ring-[#17a1a6]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#17a1a6] hover:bg-[#12898e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17a1a6] disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGithubSignUp}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            GitHub
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#17a1a6] hover:text-[#12898e]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
