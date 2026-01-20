'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('user') // 'user' or 'admin'
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.')
        setLoading(false)
        return
      }

      // Check role match
      if (role === 'admin' && data.user.role !== 'admin') {
        setError('This account does not have admin privileges')
        setLoading(false)
        return
      }

      if (role === 'user' && data.user.role === 'admin') {
        setError('Please use Admin Login to access admin account')
        setLoading(false)
        return
      }

      // Save token to cookie (1 day expiry)
      Cookies.set('token', data.token, { expires: 1 })

      // Redirect based on role tab
      if (role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo Section */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="w-16 h-16">
            <Image
              src="/nss_logo.svg"
              alt="NSS Logo"
              width={60}
              height={60}
              priority
            />
          </div>
          <div className="w-16 h-16">
            <Image
              src="/iitr-logo.svg"
              alt="IIT Roorkee Logo"
              width={60}
              height={60}
              priority
            />
          </div>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setRole('user')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition duration-200 ${
              role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-700 hover:text-gray-900'
            }`}
          >
            User Login
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition duration-200 ${
              role === 'admin'
                ? 'bg-red-600 text-white'
                : 'bg-transparent text-gray-700 hover:text-gray-900'
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {role === 'admin' ? 'Admin Access' : 'Welcome Back'}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {role === 'admin'
            ? 'Sign in to your admin account'
            : 'Sign in to your account'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 px-4 rounded-lg transition duration-200 text-white ${
              role === 'admin'
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-semibold">
            Sign up here
          </a>
        </div>
      </div>
    </div>
  )
}
