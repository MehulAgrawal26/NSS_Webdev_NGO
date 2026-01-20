'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import PaymentModal from '@/components/PaymentModal'

export default function UserDashboard() {
  const router = useRouter()
  const [donations, setDonations] = useState([])
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentDonation, setCurrentDonation] = useState(null)

  // Fetch donations on component mount
  useEffect(() => {
    fetchDonations()
  }, [])

  async function fetchDonations() {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/user/donation', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch donations')
      }

      const data = await response.json()
      setDonations(data.donations || [])
    } catch (err) {
      console.error('Error fetching donations:', err)
      setError('Failed to load donations')
    } finally {
      setLoading(false)
    }
  }

  async function handleDonate(e) {
    e.preventDefault()
    setError('')

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/user/donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      })

      if (!response.ok) {
        throw new Error('Donation failed')
      }

      const data = await response.json()
      
      // Set modal state with donation ID and amount
      setCurrentDonation({
        id: data.donation._id,
        amount: parseFloat(amount),
      })
      setShowModal(true)
      setAmount('')
    } catch (err) {
      console.error('Error creating donation:', err)
      setError('Failed to create donation. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleModalComplete() {
    setShowModal(false)
    setCurrentDonation(null)
    // Re-fetch donations to update status
    await fetchDonations()
  }

  async function handleModalClose() {
    setShowModal(false)
    setCurrentDonation(null)
  }

  function handleLogout() {
    Cookies.remove('token')
    router.push('/login')
  }

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">NSS Portal</span>
          </div>
          <button
            onClick={handleLogout}
            className="border-2 border-red-600 hover:bg-red-50 text-red-600 font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-6xl mx-auto px-6 py-16 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Welcome Back!</h1>
          <p className="text-blue-100 text-lg">Manage your donations and support our mission to create a better world.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Donate Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Make a Donation</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Make an immediate impact by contributing to our cause. Every donation, no matter the size, helps us drive meaningful change in the community.
            </p>
            
            <form onSubmit={handleDonate} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (INR)
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={submitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  min="1"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                {submitting ? 'Processing...' : 'Donate Now'}
              </button>
            </form>
          </div>

          {/* Donation History Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Donation History</h3>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Loading donations...</p>
              </div>
            ) : donations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Transaction ID</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 text-gray-800">{formatDate(donation.createdAt)}</td>
                        <td className="py-3 px-2 text-gray-800 font-semibold">₹{donation.amount}</td>
                        <td className="py-3 px-2 text-gray-600 text-xs">{donation.transactionId || '-'}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeStyles(donation.status)}`}>
                            {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No donations found yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && currentDonation && (
        <PaymentModal
          amount={currentDonation.amount}
          donationId={currentDonation.id}
          onClose={handleModalClose}
          onComplete={handleModalComplete}
        />
      )}
    </div>
  )
}
