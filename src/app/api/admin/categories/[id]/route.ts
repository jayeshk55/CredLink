import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key"

// Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    
    const category = await prisma.category.findUnique({ 
      where: { id } 
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      category: {
        ...category,
        tags: Array.isArray(category.tags) ? category.tags : JSON.parse(category.tags as string)
      }
    })
  } catch (error) {
    console.error('Failed to fetch category:', error)
    return NextResponse.json(
      { success: false, error: 'Category not found' },
      { status: 404 }
    )
  }
}

// Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const data = await request.json()
    const { name, description, icon, color, tags, isActive } = data

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if another category with same name exists (excluding current category)
    const duplicateCategory = await prisma.category.findFirst({
      where: { 
        name: name.trim(),
        id: { not: id }
      }
    })

    if (duplicateCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    // Prepare tags array
    const tagsArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [])
    
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        icon: icon || existingCategory.icon,
        color: color || existingCategory.color,
        tags: JSON.stringify(tagsArray),
        isActive: isActive !== undefined ? isActive : existingCategory.isActive,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      category: {
        ...updatedCategory,
        tags: Array.isArray(updatedCategory.tags) ? updatedCategory.tags : JSON.parse(updatedCategory.tags as string)
      }
    })
  } catch (error) {
    console.error('Failed to update category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    await prisma.category.delete({ 
      where: { id } 
    })
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Failed to delete category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
