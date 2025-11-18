import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verify(token, JWT_SECRET) as { userId: string };
    const { id: cardId } = await params;

    // Find the card
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: { id: true, userId: true, cardActive: true } as any
    }) as any;

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Verify ownership
    if (card.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Toggle cardActive
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: { cardActive: !card.cardActive } as any,
      select: {
        id: true,
        cardName: true,
        cardActive: true,
        fullName: true
      } as any
    }) as any;

    return NextResponse.json({
      success: true,
      message: updatedCard.cardActive ? 'Card activated successfully' : 'Card paused successfully',
      card: updatedCard
    });

  } catch (error: any) {
    console.error("Error toggling card status:", error);
    return NextResponse.json({
      error: error.message || "Failed to toggle card status"
    }, { status: 500 });
  }
}
