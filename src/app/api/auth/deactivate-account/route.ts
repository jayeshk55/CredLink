import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { verifyUserToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('user_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const decoded = verifyUserToken(token) as {
      userId: string
      email: string
      fullName: string
    }

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { password, reasons } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required to deactivate account' },
        { status: 400 }
      )
    }

    // Get user and verify password
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        password: true,
        status: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is already deactivated' },
        { status: 400 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Soft delete: Set status to inactive instead of deleting
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        status: 'inactive'
      }
    })

    // Clear the authentication cookie
    cookieStore.delete('user_token')

    return NextResponse.json({
      success: true,
      message: 'Account deactivated successfully'
    })
  } catch (error: any) {
    console.error('Deactivate account error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred while deactivating account' },
      { status: 500 }
    )
  }
}

