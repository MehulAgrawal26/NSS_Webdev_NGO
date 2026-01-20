'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [recentDonations, setRecentDonations] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('donations')

  useEffect(() => {
    fetchAdminData()
  }, [])

  async function fetchAdminData() {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/admin/stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch admin data')
      }

      const data = await response.json()
      setStats(data.stats)
      setRecentDonations(data.recentDonations || [])
      setUsers(data.users || [])
    } catch (err) {
      console.error('Error fetching admin data:', err)
      setError('Failed to load admin data')
    } finally {
      setLoading(false)
    }
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.243a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.757 15.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM4 10a1 1 0 01-1-1V8a1 1 0 012 0v1a1 1 0 01-1 1zM5.757 5.757a1 1 0 000-1.414L5.05 3.636a1 1 0 10-1.414 1.414l.707.707z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="border-2 border-red-600 hover:bg-red-50 text-red-600 font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading admin data...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Total Users Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Total Registered Users</p>
                    <p className="text-5xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Funds Raised Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Total Funds Raised</p>
                    <p className="text-5xl font-bold text-green-600">₹{(stats?.totalRaised || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tab Headers */}
              <div className="border-b border-gray-200 flex">
                <button
                  onClick={() => setActiveTab('donations')}
                  className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${
                    activeTab === 'donations'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Recent Donations
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${
                    activeTab === 'users'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Users Database
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Recent Donations Tab */}
                {activeTab === 'donations' && (
                  <div className="overflow-x-auto">
                    {recentDonations.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Donor Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentDonations.map((donation) => (
                            <tr key={donation._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4 text-gray-800 font-medium">{donation.userName || 'Unknown'}</td>
                              <td className="py-4 px-4 text-gray-800 font-semibold">₹{donation.amount}</td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeStyles(donation.status)}`}>
                                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-600">{formatDate(donation.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No donations found</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Users Database Tab */}
                {activeTab === 'users' && (
                  <div className="overflow-x-auto">
                    {users.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Join Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4 text-gray-800 font-medium">{user.name}</td>
                              <td className="py-4 px-4 text-gray-600">{user.email}</td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-600">{formatDate(user.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No users found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
