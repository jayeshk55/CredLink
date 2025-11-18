import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

// Get all users
export async function GET() {
  try {
    console.log('🔍 GET /api/users - Starting...');
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    console.log('🍪 Admin token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('❌ No admin token found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const decoded = verify(token, JWT_SECRET) as {
      adminId: string
      role: string
      permissions: string[]
    }

    console.log('✅ Decoded token:', decoded);

    // Check if admin has permission to view users
    if (!decoded.adminId) {
      console.log('❌ No adminId in token');
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check for MANAGE_USERS permission or SUPER_ADMIN role
    if (decoded.role !== 'SUPER_ADMIN' && !decoded.permissions.includes('MANAGE_USERS')) {
      console.log('❌ Insufficient permissions for user management');
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    console.log('📊 Fetching users from database...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        status: true,
        location: true,
        title: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Map database fields to frontend expected format
    const mappedUsers = users.map((user: any) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      city: user.location || '',
      category: user.title || '',
      status: user.status || 'active', // Default to active if status is null
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))

    console.log(`✅ Found ${users.length} users`);
    return NextResponse.json({ users: mappedUsers })
  } catch (error) {
    console.error('❌ Get users error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => ({}))
  return NextResponse.json({ ok: true, resource: 'users', created: data })
}
