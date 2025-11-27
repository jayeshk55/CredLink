import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single card by ID (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cardId } = await params;

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
            location: true,
          }
        }
      }
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Only return the card; do NOT increment views here.
    return NextResponse.json({ 
      success: true,
      card
    });

  } catch (error: any) {
    console.error("Error fetching card:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to fetch card" 
    }, { status: 500 });
  }
}
