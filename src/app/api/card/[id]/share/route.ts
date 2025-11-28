import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

// POST - Increment share count for a card
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cardId } = await params;

    // Fetch card with owner for comparison (no need to select shares here)
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: { id: true, userId: true },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Get current session token (if any)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If the sharer is the owner, do NOT increment (optional business logic)
    if (token?.id && token.id === card.userId) {
      return NextResponse.json({ success: true, message: "Owner share ignored" });
    }

    // Increment shares count
    await prisma.$executeRaw`UPDATE cards SET shares = shares + 1 WHERE id = ${cardId}`;

    return NextResponse.json({ success: true, message: "Share count incremented" });
  } catch (error: any) {
    console.error("Error incrementing share count:", error);
    return NextResponse.json(
      { error: error.message || "Failed to increment share count" },
      { status: 500 }
    );
  }
}
