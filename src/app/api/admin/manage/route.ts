import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key"

// Get all admins
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const decoded = verify(token, JWT_SECRET) as {
      adminId: string
      role: string
      permissions: string[]
    }

    // Check if admin has permission
    if (decoded.role !== 'SUPER_ADMIN' && !decoded.permissions.includes('MANAGE_ADMINS')) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        permissions: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse permissions for each admin
    const adminsWithParsedPermissions = admins.map((admin: any) => ({
      ...admin,
      permissions: JSON.parse(admin.permissions)
    }))

    return NextResponse.json({ admins: adminsWithParsedPermissions })
  } catch (error) {
    console.error("Get admins error:", error)
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 })
  }
}

// Create new admin
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const decoded = verify(token, JWT_SECRET) as {
      adminId: string
      role: string
      permissions: string[]
    }

    // Only SUPER_ADMIN can create admins
    if (decoded.role !== 'SUPER_ADMIN' && !decoded.permissions.includes('MANAGE_ADMINS')) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { email, fullName, password, role, permissions } = body

    if (!email || !fullName || !password) {
      return NextResponse.json(
        { error: "Email, full name, and password are required" },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin
    const newAdmin = await prisma.admin.create({
      data: {
        email: email.toLowerCase(),
        fullName,
        password: hashedPassword,
        role: role || 'SUB_ADMIN',
        permissions: JSON.stringify(permissions || []),
        createdBy: decoded.adminId,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        role: newAdmin.role,
        permissions: JSON.parse(newAdmin.permissions)
      }
    })
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}
