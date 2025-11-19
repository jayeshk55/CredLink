"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import "../../globals.css"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [userInfo, setUserInfo] = useState<{ email: string; fullName: string } | null>(null)
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid reset link. Please request a new password reset.")
        setValidating(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()

        if (response.ok && data.valid) {
          setTokenValid(true)
          setUserInfo(data.user)
        } else {
          setError(data.error || "Invalid or expired reset link. Please request a new password reset.")
        }
      } catch (error) {
        console.error('Token validation error:', error)
        setError("An error occurred while validating the reset link.")
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPasswordMismatch(false)

    if (!password) {
      setError("Please enter a new password")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'An error occurred while resetting your password.')
        return
      }

      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (error) {
      console.error('Password reset error:', error)
      setError('An error occurred while resetting your password.')
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="block">
              <h1 className="auth-logo">MyKard</h1>
            </Link>
            <h2 className="auth-title">Validating Reset Link</h2>
            <p className="auth-subtitle">Please wait while we validate your reset link...</p>
          </div>
          <div className="auth-form">
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="block">
              <h1 className="auth-logo">MyKard</h1>
            </Link>
            <h2 className="auth-title">Invalid Reset Link</h2>
            <p className="auth-subtitle">This password reset link is invalid or has expired.</p>
          </div>
          <div className="auth-form space-y-6">
            <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 text-4xl mb-4">✗</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Link Invalid</h3>
              <p className="text-red-700 text-sm mb-4">{error}</p>
            </div>
            
            <div className="text-center space-y-4">
              <Link 
                href="/auth/forgot-password"
                className="inline-block bg-primary-green text-white px-6 py-2 rounded-md hover:bg-primary-green-dark transition-colors"
              >
                Request New Reset Link
              </Link>
              <div>
                <Link href="/auth/login" className="text-sm text-primary-green hover:text-primary-green-dark">
                  Back to sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="block">
              <h1 className="auth-logo">MyKard</h1>
            </Link>
            <h2 className="auth-title">Password Reset Successful</h2>
            <p className="auth-subtitle">Your password has been successfully reset.</p>
          </div>
          <div className="auth-form space-y-6">
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Success!</h3>
              <p className="text-green-700 text-sm mb-4">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <p className="text-green-600 text-xs">
                Redirecting to sign in page in a few seconds...
              </p>
            </div>
            
            <div className="text-center">
              <Link 
                href="/auth/login"
                className="inline-block bg-primary-green text-white px-6 py-2 rounded-md hover:bg-primary-green-dark transition-colors"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="block">
            <h1 className="auth-logo">MyKard</h1>
          </Link>
          <h2 className="auth-title">Set New Password</h2>
          <p className="auth-subtitle">
            {userInfo ? (
              <>Enter a new password for <strong>{userInfo.email}</strong></>
            ) : (
              "Enter your new password below"
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form space-y-6">
          <div className="auth-input-group">
            <label htmlFor="password" className="label">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="Enter new password (min 8 characters)"
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`auth-input ${passwordMismatch ? 'border-red-600' : ''}`}
              placeholder="Re-enter new password"
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          {passwordMismatch && (
            <p className="text-sm text-red-600">Passwords do not match</p>
          )}

          {error && !passwordMismatch && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button type="submit" disabled={loading} className="auth-submit-button w-full">
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-primary-green hover:text-primary-green-dark">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="block">
              <h1 className="auth-logo">MyKard</h1>
            </Link>
            <h2 className="auth-title">Loading...</h2>
            <p className="auth-subtitle">Please wait while we load the reset page...</p>
          </div>
          <div className="auth-form">
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
