import connectDB from '@/lib/mongoose'
import User from '@/models/User'

export async function GET(req) {
  try {
    await connectDB()

    const userCount = await User.countDocuments()

    return new Response(
      JSON.stringify({
        status: 'ok',
        message: 'Database connection successful',
        userCount,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Health check error:', error)
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
