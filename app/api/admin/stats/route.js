import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import Donation from '@/models/Donation'

export async function GET(req) {
  try {
    await connectDB()

    // Get total users
    const totalUsers = await User.countDocuments()

    // Get total funds raised (sum of successful donations)
    const fundResult = await Donation.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])
    const totalRaised = fundResult.length > 0 ? fundResult[0].total : 0

    // Get recent donations (last 10)
    const recentDonations = await Donation.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .then((donations) =>
        donations.map((d) => ({
          ...d,
          userName: d.userId?.name || 'Unknown',
        }))
      )

    // Get all users
    const users = await User.find().select('name email role createdAt').sort({ createdAt: -1 }).lean()

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalUsers,
          totalRaised,
        },
        recentDonations,
        users,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Admin stats error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch admin stats',
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
