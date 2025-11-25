import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE - Remove a single contact (card connection) owned by the logged-in user
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    const params = await context.params;
    const id = params.id;

    // Find the card connection and ensure the current user owns it
    const connection = await (prisma as any).cardConnection.findUnique({
      where: { id },
      include: {
        card: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    // User can delete if they are the explicit owner or the card owner
    const ownerUserId = (connection as any).ownerUserId;
    const cardUserId = (connection as any).card?.userId;

    if (ownerUserId !== userId && cardUserId !== userId) {
      return NextResponse.json(
        { error: "Forbidden - You do not have permission to delete this contact" },
        { status: 403 }
      );
    }

    await (prisma as any).cardConnection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete contact" },
      { status: 500 }
    );
  }
}
