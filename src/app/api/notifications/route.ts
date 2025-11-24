import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Build derived notifications from messages and connection requests
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    // Incoming messages for this user
    const messages = await (prisma as any).message.findMany({
      where: { receiverId: userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const senderIds = Array.from(
      new Set(messages.map((m: any) => m.senderId).filter(Boolean))
    );

    const senders = senderIds.length
      ? await (prisma as any).user.findMany({
          where: { id: { in: senderIds } },
          select: { id: true, fullName: true, email: true },
        })
      : [];

    const sendersMap = new Map<string, { id: string; fullName?: string | null; email?: string | null }>();
    (senders as any[]).forEach((s: any) => {
      if (!s || !s.id) return;
      sendersMap.set(s.id, s);
    });

    const messageNotifications = (messages as any[]).map((m: any) => {
      const sender = m.senderId ? sendersMap.get(m.senderId) : undefined;
      const displayName =
        sender?.fullName?.trim() || sender?.email || "Someone";

      return {
        id: `msg-${m.id}`,
        title: "Message received",
        message: `Message received from ${displayName}`,
        createdAt: (m.createdAt || new Date()).toISOString(),
        read: false,
      };
    });

    // Pending connection requests received by this user
    const connections = await (prisma as any).connection.findMany({
      where: { receiverId: userId, status: "PENDING" },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const connectionNotifications = (connections as any[]).map((c: any) => {
      const sender = c.sender;
      const displayName =
        sender?.fullName?.trim() || sender?.email || "Someone";

      return {
        id: `conn-${c.id}`,
        title: "Connection request",
        message: `Connection request received from ${displayName}`,
        createdAt: (c.createdAt || new Date()).toISOString(),
        read: false,
      };
    });

    const notifications = [...messageNotifications, ...connectionNotifications];

    return NextResponse.json({ ok: true, notifications });
  } catch (error) {
    console.error("Error building notifications:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
