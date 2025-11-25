import { NextRequest, NextResponse } from 'next/server'

// Password reset intentionally disabled per request. Forgot-password flow issues addressed separately.
// Original implementation kept for future reactivation.

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      { error: 'Password reset feature is disabled' },
      { status: 503 }
    )
    // const body = await request.json()
    // const { token, password } = body
    // (disabled logic here)
  } catch (error) {
    console.error('Password reset error (disabled route):', error)
    return NextResponse.json(
      { error: 'An error occurred while resetting your password' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { error: 'Password reset feature is disabled' },
      { status: 503 }
    )
    // const { searchParams } = new URL(request.url)
    // const token = searchParams.get('token')
    // (disabled validation logic)
  } catch (error) {
    console.error('Token validation error (disabled route):', error)
    return NextResponse.json(
      { error: 'An error occurred while validating the token' },
      { status: 500 }
    )
  }
}
