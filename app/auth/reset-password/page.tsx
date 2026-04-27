'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSupabase } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()
  const supabase = getSupabase()

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [mode, setMode] = useState<'request' | 'reset'>('request')

  // Check if we're in reset mode (coming from email link)
  const token = searchParams.get('token')
  const type = searchParams.get('type')

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
      setEmail('')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send reset email'
      )
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setSuccess(true)
      setNewPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to reset password'
      )
    } finally {
      setLoading(false)
    }
  }

  // If token is present, show reset form
  if (token && type === 'recovery') {
    if (success) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="rounded-md bg-green-50 p-4">
              <h2 className="text-lg font-semibold text-green-900">Password reset successful!</h2>
              <p className="mt-2 text-sm text-green-700">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black">Set new password</h2>
            <p className="mt-2 text-gray-700">Enter your new password below</p>
          </div>

          <form onSubmit={handlePasswordReset} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-black">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Default request password reset form
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="rounded-md bg-green-50 p-4">
            <h2 className="text-lg font-semibold text-green-900">Check your email</h2>
            <p className="mt-2 text-sm text-green-700">
              We've sent a password reset link to your email address.
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
          <h2 className="text-3xl font-bold text-black">Reset password</h2>
          <p className="mt-2 text-gray-700">Enter your email to reset your password</p>
        </div>

        <form onSubmit={handlePasswordResetRequest} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#17a1a6] hover:bg-[#12898e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17a1a6] disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-[#17a1a6] hover:text-[#12898e]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
