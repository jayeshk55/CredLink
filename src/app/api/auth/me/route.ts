import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

function decodeJwtPayload(token: string): any | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = Buffer.from(padded, 'base64').toString('utf8')
    return JSON.parse(json)
  } catch {
    return null
  }
}

export async function GET() {
  try {
    // Fallback to custom JWT cookie `user_token`
    const cookieStore = await cookies()
    const userToken = cookieStore.get('user_token')?.value
    if (userToken) {
      const decoded = decodeJwtPayload(userToken)
      const userId = decoded?.userId || decoded?.id
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user) {
          return NextResponse.json({ user: {
            id: user.id,
            email: user.email,
            name: user.fullName,
            fullName: user.fullName,
            username: user.username,
            profileImage: user.profileImage,
          } }, { status: 200 })
        }
      }
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal Error' }, { status: 500 })
  }
}
