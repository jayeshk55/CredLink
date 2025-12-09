"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Shield } from "lucide-react"
import { toast } from "react-hot-toast"

export default function AdminSecureLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter your email and password')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Login failed')
        return
      }

      toast.success('Login successful!')
      localStorage.setItem('token', result.token)
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card max-w-md">
        <div className="auth-header mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="auth-logo text-3xl mb-3">Admin Portal</h1>
          <h2 className="auth-title text-xl mb-2">
            Sign in to Admin Dashboard
          </h2>
          <p className="auth-subtitle text-base">
            Secure access for administrators only
          </p>
        </div>

        <form onSubmit={handleLogin} className="auth-form space-y-6">
          <div className="auth-input-group">
            <label htmlFor="email" className="label text-sm font-medium mb-2 block">
              Admin Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="auth-input py-3"
                placeholder="Enter your admin email"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="password" className="label text-sm font-medium mb-2 block">
              Password
            </label>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="auth-input py-3"
                placeholder="Enter your password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault()
                  setShowPassword(!showPassword)
                }}
              >
                {!showPassword ? (
                  <EyeOff className="h-5 w-5" aria-label="Show password" />
                ) : (
                  <Eye className="h-5 w-5" aria-label="Hide password" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`auth-submit-button py-3.5 text-base font-semibold ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Sign in to Admin Panel'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-medium text-primary-green hover:text-primary-green-dark transition-colors">
            ← Back to main site
          </Link>
        </div>

        <div className="mt-6 p-5 bg-background-light-green rounded-lg border border-primary-green/10">
          <p className="text-xs text-center text-secondary flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            This is a secure admin area. All login attempts are logged.
          </p>
        </div>
      </div>
    </div>
  )
}
