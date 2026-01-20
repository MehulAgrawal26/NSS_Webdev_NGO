'use client'

import { useState } from 'react'

export default function PaymentModal({ amount, donationId, onClose, onComplete }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePayment(outcome) {
    setError('')
    setLoading(true)

    // Simulate 2 second loading
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationId,
          outcome, // 'success' or 'failed'
        }),
      })

      if (!response.ok) {
        throw new Error('Payment verification failed')
      }

      const data = await response.json()

      if (data.success) {
        onComplete()
      } else {
        setError(data.message || 'Payment failed')
        setLoading(false)
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError('An error occurred during payment processing')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment Gateway</h2>
          <p className="text-gray-600 text-sm mt-1">Simulate payment processing</p>
        </div>

        {/* Amount Display */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <p className="text-gray-600 text-sm mb-1">Amount to Pay</p>
          <p className="text-4xl font-bold text-blue-600">₹{amount}</p>
        </div>

        {/* Donation ID */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <p className="text-gray-600 text-xs mb-1">Donation ID</p>
          <p className="text-gray-800 font-mono text-sm break-all">{donationId}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="mb-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Action Buttons */}
        {!loading ? (
          <div className="space-y-3">
            <button
              onClick={() => handlePayment('success')}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Simulate Success
            </button>

            <button
              onClick={() => handlePayment('failed')}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Simulate Failure
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">Processing payment...</p>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-gray-500 text-xs text-center mt-6">
          This is a simulated payment gateway for testing purposes.
        </p>
      </div>
    </div>
  )
}
