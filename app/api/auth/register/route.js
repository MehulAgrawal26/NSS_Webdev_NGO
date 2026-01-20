import connectDB from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req) {
  try {
    await connectDB()

    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Name, email, and password are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User already exists with this email',
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = new User({ name, email, password })
    await user.save()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Registration failed',
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
