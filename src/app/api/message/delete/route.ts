import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
    // Check if this is a conversation deletion (new endpoint)
    const contentType = req.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        try {
            const body = await req.json();
            if (body.userId) {
                // This is a conversation deletion request
                return await deleteConversation(req, body.userId);
            }
        } catch (error) {
            // If JSON parsing fails, fall back to single message deletion
        }
    }

    // Original single message deletion logic
    const url = new URL(req.url);
    const fromHeader = req.headers.get("x-message-id") || undefined;
    const fromQuery = url.searchParams.get("id") || undefined;
    let fromBody: string | undefined;
    try {
        const body = await req.json().catch(() => null) as { id?: string } | null;
        fromBody = body?.id;
    } catch {}

    const messageId = fromHeader || fromQuery || fromBody;
    if (!messageId) {
        return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
    }

    try {
        await prisma.message.delete({ where: { id: messageId } });
        return NextResponse.json({ ok: true });
    } catch (error: any) {
        // Prisma not found
        if (error?.code === 'P2025') {
            return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
        }
        console.error("Failed to delete message:", error);
        return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
    }
}

async function deleteConversation(req: NextRequest, conversationUserId: string) {
    try {
        // Extract user ID from middleware headers
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ 
                ok: false, 
                error: "Unauthorized - User not authenticated" 
            }, { status: 401 });
        }

        // Delete all messages between the current user and the specified user
        const deleteResult = await (prisma as any).message.deleteMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        receiverId: conversationUserId
                    },
                    {
                        senderId: conversationUserId,
                        receiverId: userId
                    }
                ]
            }
        });

        return NextResponse.json({ 
            ok: true, 
            deletedCount: deleteResult.count,
            message: "Conversation deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return NextResponse.json({ 
            ok: false, 
            error: "Failed to delete conversation" 
        }, { status: 500 });
    }
}