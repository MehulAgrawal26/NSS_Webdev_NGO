import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key'
)

async function verifyToken(token) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload
  } catch (err) {
    console.error('Token verification failed:', err)
    return null
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl

  // Check if the request is for protected routes
  const isAdminRoute = pathname.startsWith('/admin')
  const isUserRoute = pathname.startsWith('/user')

  if (!isAdminRoute && !isUserRoute) {
    return NextResponse.next()
  }

  // Extract token from cookies or Authorization header
  let token = req.cookies.get('token')?.value

  if (!token) {
    const authHeader = req.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }

  // No token found - redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Verify token
  const payload = await verifyToken(token)

  if (!payload) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Role-based access control
  if (isAdminRoute && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/user/dashboard', req.url))
  }

  // Token is valid and user has access - continue
  const response = NextResponse.next()
  response.headers.set('x-user-id', payload.id)
  response.headers.set('x-user-role', payload.role)

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
}
