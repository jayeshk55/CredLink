import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CACHE_TTL_MS = 10_000; // 10 seconds

interface DashboardSummaryPayload {
  notificationsCount: number;
  unreadMessages: number;
  pendingConnections: number;
  newContacts: number;
}

type DashboardSummaryCacheEntry = {
  timestamp: number;
  payload: DashboardSummaryPayload;
};

// Per-user in-memory cache to reduce repeated DB hits
const dashboardSummaryCache = new Map<string, DashboardSummaryCacheEntry>();

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    const cacheKey = userId;
    const now = Date.now();
    const cached = dashboardSummaryCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.payload);
    }

    // --- Notifications count (matches /api/notifications logic) ---
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
      const displayName = sender?.fullName?.trim() || sender?.email || "Someone";

      return {
        id: `msg-${m.id}`,
        title: "Message received",
        message: `Message received from ${displayName}`,
        createdAt: (m.createdAt || new Date()).toISOString(),
        read: false,
      };
    });

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
      const displayName = sender?.fullName?.trim() || sender?.email || "Someone";

      return {
        id: `conn-${c.id}`,
        title: "Connection request",
        message: `Connection request received from ${displayName}`,
        createdAt: (c.createdAt || new Date()).toISOString(),
        read: false,
      };
    });

    const notifications = [...messageNotifications, ...connectionNotifications];
    const notificationsCount = notifications.length;

    // --- Unread messages count approximation (reuses /api/message/receive DB shape) ---
    // For summary we treat all incoming messages as unread; the detailed
    // per-conversation read pointers are still handled on the client
    // using /api/message/receive and localStorage.
    const unreadMessages = messages.length;

    // --- Pending connections count (matches /api/users/connections?type=received core logic) ---
    const pendingConnections = await (prisma as any).connection.count({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
    });

    // --- New contacts count (matches /api/contacts core logic) ---
    const contacts = await (prisma as any).cardConnection.findMany({
      where: {
        OR: [
          { ownerUserId: userId },
          {
            ownerUserId: null,
            card: { userId: userId },
          },
        ],
      },
      include: {
        card: {
          select: {
            id: true,
            fullName: true,
            cardName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const newContacts = contacts.length;

    const payload: DashboardSummaryPayload = {
      notificationsCount,
      unreadMessages,
      pendingConnections,
      newContacts,
    };

    dashboardSummaryCache.set(cacheKey, { timestamp: now, payload });

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("Error building dashboard summary:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard summary" },
      { status: 500 }
    );
  }
}
