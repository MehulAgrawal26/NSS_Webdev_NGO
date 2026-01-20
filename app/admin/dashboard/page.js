'use client'

import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function AdminDashboard() {
  const router = useRouter()

  function handleLogout() {
    Cookies.remove('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-700 text-lg mb-4">
            Welcome to the Admin Dashboard! Manage users, donations, and NGO operations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Users Management */}
            <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Users Management</h3>
              <p className="text-gray-600 mb-4">Manage and view all registered users.</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                View Users
              </button>
            </div>

            {/* Donations Management */}
            <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-600">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Donations Management</h3>
              <p className="text-gray-600 mb-4">Track and manage all donations.</p>
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                View Donations
              </button>
            </div>

            {/* Reports */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reports</h3>
              <p className="text-gray-600 mb-4">Generate and view system reports.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                View Reports
              </button>
            </div>

            {/* Settings */}
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-600">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Settings</h3>
              <p className="text-gray-600 mb-4">Configure system and application settings.</p>
              <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
