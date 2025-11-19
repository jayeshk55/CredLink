"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import "../../globals.css"

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!email) {
      setError("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'An error occurred. Please try again.')
        return
      }

      setSuccess(true)
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="block">
            <h1 className="auth-logo">MyKard</h1>
          </Link>
          <h2 className="auth-title">
            {success ? "Check your email" : "Forgot your password?"}
          </h2>
          <p className="auth-subtitle">
            {success 
              ? "We've sent a password reset link to your email address."
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </p>
        </div>

        {success ? (
          <div className="auth-form space-y-6">
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Email sent successfully!</h3>
              <p className="text-green-700 text-sm mb-4">
                If an account with <strong>{email}</strong> exists, we've sent a password reset link to that email address.
              </p>
              <p className="text-green-600 text-xs">
                The link will expire in 1 hour for security reasons.
              </p>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                  setError("")
                }}
                className="text-sm text-primary-green hover:text-primary-green-dark"
              >
                Send another email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form space-y-6">
            <div className="auth-input-group">
              <label htmlFor="email" className="label">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="Enter your email address"
                required
                disabled={loading}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="auth-submit-button w-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-primary-green hover:text-primary-green-dark">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
