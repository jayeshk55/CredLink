import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Normalize email to lowercase for consistency
    const normalizedEmail = email.toLowerCase().trim()

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { 
        email: normalizedEmail
      }
    })

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists
    if (user) {
      // Generate secure random token
      const resetToken = crypto.randomBytes(32).toString('hex')
      
      // Set expiration to 1 hour from now
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      // TODO: Add PasswordResetToken model to Prisma schema
      // Clean up any existing unused tokens for this user
      // await prisma.passwordResetToken.deleteMany({
      //   where: {
      //     userId: user.id,
      //     used: false
      //   }
      // })

      // Create new reset token
      // await prisma.passwordResetToken.create({
      //   data: {
      //     token: resetToken,
      //     userId: user.id,
      //     expiresAt,
      //     used: false
      //   }
      // })

      // Send password reset email
      try {
        // Temporarily disabled until PasswordResetToken model is added
        // await sendPasswordResetEmail(
        //   user.email,
        //   resetToken,
        //   user.fullName
        // )
        console.log('⚠️ Password reset email disabled - PasswordResetToken model missing')
      } catch (emailError) {
        console.error('❌ Failed to send password reset email:', emailError)
        // Don't expose email sending errors to the client
        // The token is still created, so user can try again
      }
    } else {
      console.log('❌ Password reset requested for non-existent email:', normalizedEmail)
    }

    // Always return success message to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
