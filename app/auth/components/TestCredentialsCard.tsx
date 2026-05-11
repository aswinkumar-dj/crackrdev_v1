'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function TestCredentialsCard() {
  const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null)

  const testEmail = 'testing@gmail.com'
  const testPassword = 'testing123'

  const handleCopy = (text: string, field: 'email' | 'password') => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="p-3 bg-gray-50 rounded border border-gray-200">
      <p className="text-xs text-gray-600 mb-2">Test credentials:</p>
      
      <div className="space-y-2">
        {/* Email */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700">{testEmail}</span>
          <button
            type="button"
            onClick={() => handleCopy(testEmail, 'email')}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {copiedField === 'email' ? (
              <Check size={14} className="text-[#17a1a6]" />
            ) : (
              <Copy size={14} className="text-gray-500" />
            )}
          </button>
        </div>

        {/* Password */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700">{testPassword}</span>
          <button
            type="button"
            onClick={() => handleCopy(testPassword, 'password')}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {copiedField === 'password' ? (
              <Check size={14} className="text-[#17a1a6]" />
            ) : (
              <Copy size={14} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
