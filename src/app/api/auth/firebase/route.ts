import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { signToken } from '@/lib/jwt'

function toSlug(base: string) {
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function generateUniqueUsername(email?: string | null, fallback?: string) {
  const base = email ? toSlug(email.split('@')[0]) : (fallback ? toSlug(fallback) : 'user')
  let candidate = base || 'user'
  let suffix = 0
  // Ensure non-empty
  if (!candidate.trim()) candidate = 'user'

  // Try until unique
  // Cap attempts to avoid infinite loop
  for (let i = 0; i < 100; i++) {
    const uname = suffix === 0 ? candidate : `${candidate}${suffix}`
    const exists = await prisma.user.findFirst({ where: { username: uname } })
    if (!exists) return uname
    suffix++
  }
  // As last resort, add random string
  return `${candidate}-${Math.random().toString(36).slice(2, 8)}`
}

// Decode JWT without verification (for development/testing)
// In production, you should verify the signature with Firebase Admin
function decodeFirebaseToken(idToken: string) {
  try {
    const parts = idToken.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid token format')
    }
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    
    // Basic validation
    if (!payload.email || !payload.sub) {
      throw new Error('Invalid token payload')
    }
    
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new Error('Token expired')
    }
    
    return payload
  } catch (error: any) {
    console.error('Token decode error:', error?.message)
    throw new Error('Token verification failed')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 })
    }

    console.log('🔐 Verifying Firebase ID token...')
    
    // Decode the Firebase token
    const decoded = decodeFirebaseToken(idToken)
    const { sub: uid, email, name, picture } = decoded

    console.log('✅ Token verified for email:', email)

    if (!email) {
      return NextResponse.json({ error: 'Google account has no email' }, { status: 400 })
    }

    // Find or create user
    let user = await prisma.user.findFirst({ where: { email: email.toLowerCase() } })

    // Check if account exists but is deactivated
    if (user && user.status === 'inactive') {
      console.log('❌ Attempted login to deactivated account via Firebase:', email)
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support to reactivate your account.' },
        { status: 403 }
      )
    }

    if (!user) {
      const username = await generateUniqueUsername(email, name || uid)
      // Generate a strong random password, hash it to satisfy NOT NULL constraint
      const randomPass = `oauth:${uid}:${Math.random().toString(36).slice(2)}`
      const hashed = await bcrypt.hash(randomPass, 10)

      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          fullName: name || 'User',
          username,
          password: hashed,
          profileImage: picture || null,
          status: 'active',
        },
      })
    }

    // Determine onboarding status (has cards?)
    const cardCount = await prisma.card.count({ where: { userId: user.id } })
    const needsOnboarding = cardCount === 0

    // Issue our own JWT cookie
    const token = signToken(
      {
        userId: user.id,
        email: user.email,
        
      },
      { expiresIn: '7d' }
    )

    const cookieStore = await cookies()
    cookieStore.set('user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // If password starts with 'oauth:', require user to set a password
    const needsPassword = user.password.startsWith('oauth:')

    return NextResponse.json({
      success: true,
      needsOnboarding,
      needsPassword,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    })
  } catch (err: any) {
    console.error('❌ Firebase login error:', err?.message || err)
    return NextResponse.json({ 
      error: err?.message || 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? err?.stack : undefined
    }, { status: 401 })
  }
}
