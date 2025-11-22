import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    // TODO: Add PasswordResetToken model to Prisma schema
    return NextResponse.json(
      { error: 'Password reset feature is temporarily disabled - PasswordResetToken model missing from schema' },
      { status: 503 }
    )

    // if (!token || !password) {
    //   return NextResponse.json(
    //     { error: 'Token and password are required' },
    //     { status: 400 }
    //   )
    // }

    // if (password.length < 8) {
    //   return NextResponse.json(
    //     { error: 'Password must be at least 8 characters long' },
    //     { status: 400 }
    //   )
    // }

    // // Find the reset token
    // const resetToken = await prisma.passwordResetToken.findFirst({
    //   where: {
    //     token: token,
    //     used: false,
    //     expiresAt: {
    //       gt: new Date() // Token must not be expired
    //     }
    //   },
    //   include: {
    //     user: true
    //   }
    // })

    // if (!resetToken) {
    //   return NextResponse.json(
    //     { error: 'Invalid or expired reset token' },
    //     { status: 400 }
    //   )
    // }

    // // Hash the new password
    // const saltRounds = 12
    // const hashedPassword = await bcrypt.hash(password, saltRounds)

    // // Update user's password and mark token as used
    // await prisma.$transaction([
    //   prisma.user.update({
    //     where: { id: resetToken.userId },
    //     data: { password: hashedPassword }
    //   }),
    //   prisma.passwordResetToken.update({
    //     where: { id: resetToken.id },
    //     data: { used: true }
    //   })
    // ])

    // console.log('✅ Password reset successful for user:', resetToken.user.email)

    // return NextResponse.json({
    //   success: true,
    //   message: 'Password has been reset successfully'
    // })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred while resetting your password' },
      { status: 500 }
    )
  }
}

// GET endpoint to validate reset token
export async function GET(request: NextRequest) {
  try {
    // TODO: Add PasswordResetToken model to Prisma schema
    return NextResponse.json(
      { error: 'Password reset feature is temporarily disabled - PasswordResetToken model missing from schema' },
      { status: 503 }
    )

    // const { searchParams } = new URL(request.url)
    // const token = searchParams.get('token')

    // if (!token) {
    //   return NextResponse.json(
    //     { error: 'Token is required' },
    //     { status: 400 }
    //   )
    // }

    // // Check if token exists and is valid
    // const resetToken = await prisma.passwordResetToken.findFirst({
    //   where: {
    //     token: token,
    //     used: false,
    //     expiresAt: {
    //       gt: new Date() // Token must not be expired
    //     }
    //   },
    //   include: {
    //     user: {
    //       select: {
    //         email: true,
    //         fullName: true
    //       }
    //     }
    //   }
    // })

    // if (!resetToken) {
    //   return NextResponse.json(
    //     { error: 'Invalid or expired reset token' },
    //     { status: 400 }
    //   )
    // }

    // return NextResponse.json({
    //   valid: true,
    //   user: {
    //     email: resetToken.user.email,
    //     fullName: resetToken.user.fullName
    //   }
    // })

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'An error occurred while validating the token' },
      { status: 500 }
    )
  }
}
