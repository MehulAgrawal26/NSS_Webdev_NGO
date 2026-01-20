import connectDB from '@/lib/mongoose'
import Donation from '@/models/Donation'

function generateTransactionId() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TXN_${timestamp}_${random}`
}

export async function POST(req) {
  try {
    await connectDB()

    const { donationId, outcome } = await req.json()

    if (!donationId || !outcome) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing donationId or outcome',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (outcome !== 'success' && outcome !== 'failed') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid outcome. Must be "success" or "failed"',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Find and update the donation
    const donation = await Donation.findById(donationId)

    if (!donation) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Donation not found',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Update donation status
    donation.status = outcome
    if (outcome === 'success') {
      donation.transactionId = generateTransactionId()
    }

    await donation.save()

    return new Response(
      JSON.stringify({
        success: true,
        message: `Payment ${outcome === 'success' ? 'completed' : 'failed'}`,
        donation,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Payment verification failed',
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
