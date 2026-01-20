import connectDB from '@/lib/mongoose'
import Donation from '@/models/Donation'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key')

async function verifyToken(req) {
  try {
    const authHeader = req.headers.get('Authorization')
    const cookieToken = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
    const token = authHeader?.replace('Bearer ', '') || cookieToken

    if (!token) return null

    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload
  } catch (err) {
    console.error('Token verification error:', err)
    return null
  }
}

// GET: Fetch user's donations
export async function GET(req) {
  try {
    await connectDB()

    const payload = await verifyToken(req)
    if (!payload) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const donations = await Donation.find({ userId: payload.id }).sort({ createdAt: -1 })

    return new Response(
      JSON.stringify({ success: true, donations }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('GET donation error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to fetch donations', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// POST: Create a new donation
export async function POST(req) {
  try {
    await connectDB()

    const payload = await verifyToken(req)
    if (!payload) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { amount } = await req.json()

    if (!amount || parseFloat(amount) <= 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid amount' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const donation = new Donation({
      userId: payload.id,
      amount: parseFloat(amount),
      currency: 'INR',
      status: 'pending',
    })

    await donation.save()

    return new Response(
      JSON.stringify({ success: true, message: 'Donation created', donation }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('POST donation error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to create donation', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
