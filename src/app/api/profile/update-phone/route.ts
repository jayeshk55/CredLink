import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    // Get session to verify user is authenticated
    const cookieStore = await cookies();
       const token = cookieStore.get('user_token')?.value;
   
       if (!token) {
         return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
       }
   
       const decoded = verify(token, JWT_SECRET) as { userId: string };
   

    const { phone } = await req.json();

    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Basic phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    // Update user's phone number in database
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { phone: phone.trim() },
      select: {
        id: true,
        phone: true,
        fullName: true,
        email: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Phone number updated successfully",
      user: updatedUser
    });

  } catch (error: any) {
    console.error("Error updating phone number:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update phone number" },
      { status: 500 }
    );
  }
}
