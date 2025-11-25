import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key"

// Get all categories
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

    // Check if admin has permission to manage categories
    if (decoded.role !== 'SUPER_ADMIN' && !decoded.permissions.includes('MANAGE_CATEGORIES')) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse tags from JSON for each category
    const categoriesWithParsedTags = categories.map((category: any) => ({
      ...category,
      tags: Array.isArray(category.tags) ? category.tags : JSON.parse(category.tags as string)
    }))

    return NextResponse.json({
      success: true,
      categories: categoriesWithParsedTags
    })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// Create new category
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

    // Check if admin has permission to manage categories
    if (decoded.role !== 'SUPER_ADMIN' && !decoded.permissions.includes('MANAGE_CATEGORIES')) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const data = await request.json()
    const { name, description, icon, color, tags, isActive } = data

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Check if category with same name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: name.trim() }
    })

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    // Prepare tags array
    const tagsArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [])

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        icon: icon || 'Briefcase',
        color: color || '#3B82F6',
        tags: JSON.stringify(tagsArray),
        isActive: isActive !== undefined ? isActive : true,
        userCount: 0
      }
    })

    return NextResponse.json({
      success: true,
      category: {
        ...newCategory,
        tags: Array.isArray(newCategory.tags) ? newCategory.tags : JSON.parse(newCategory.tags as string)
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
