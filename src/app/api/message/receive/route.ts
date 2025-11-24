import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        // Extract user ID from middleware headers
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ 
                ok: false, 
                error: "Unauthorized - User not authenticated" 
            }, { status: 401 });
        }

        // Fetch messages sent *to* the user (incoming)
        const incomingMessages = await (prisma as any).message.findMany({
            where: {
                receiverId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Fetch all messages sent *by* this user (outgoing)
        const allSentMessages = await (prisma as any).message.findMany({
            where: {
                senderId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Combine all unique conversation partners (both senders and receivers)
        const allPartnerIds = new Set([
            ...incomingMessages.map((msg: any) => msg.senderId),
            ...allSentMessages.map((msg: any) => msg.receiverId)
        ]);

        // Fetch details for all conversation partners
        const senders = await (prisma as any).user.findMany({
            where: {
                id: { in: Array.from(allPartnerIds) },
            },
            select: {
                id: true,
                fullName: true,
                email: true,
            },
        });

        // For the frontend, we need to structure the data properly
        // Messages sent TO the user (incoming)
        const messages = incomingMessages;
        
        // Messages sent BY the user to these partners (outgoing)
        const sentMessages = allSentMessages.filter((msg: any) => 
            allPartnerIds.has(msg.receiverId)
        );

        return NextResponse.json({ 
            ok: true, 
            messages,       // incoming messages (others -> user)
            sentMessages,   // outgoing messages (user -> others)
            senders 
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ 
            ok: false, 
            error: "Failed to fetch messages" 
        }, { status: 500 });
    }
}