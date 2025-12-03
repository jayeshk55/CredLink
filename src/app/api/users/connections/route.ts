import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const CACHE_TTL_MS = 10_000; // 10 seconds

type ConnectionsCacheEntry = {
  timestamp: number;
  payload: {
    requests: any[];
  };
};

// Per-user in-memory cache to reduce repeated DB hits for dashboard lists
const connectionsCache = new Map<string, ConnectionsCacheEntry>();

// POST - Send connection request
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("user_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const senderId = decoded.userId;

    const { receiverId } = await req.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      );
    }

    // Check if request already exists
    const existingRequest = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingRequest) {
      // If rejected, allow resending
      if (existingRequest.status === "REJECTED") {
        const updated = await prisma.connection.update({
          where: { id: existingRequest.id },
          data: {
            status: "PENDING",
            senderId,
            receiverId,
          },
        });
        return NextResponse.json({
          message: "Connection request resent",
          request: updated,
        });
      }

      return NextResponse.json(
        { error: "Connection request already exists" },
        { status: 400 }
      );
    }

    // Create new connection request
    const connectionRequest = await prisma.connection.create({
      data: {
        senderId,
        receiverId,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      message: "Connection request sent",
      request: connectionRequest,
    });
  } catch (error) {
    console.error("Error sending connection request:", error);
    return NextResponse.json(
      { error: "Failed to send connection request" },
      { status: 500 }
    );
  }
}

// GET - List connection requests
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("user_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "received"; // received, sent, accepted

    const cacheKey = `${userId}:${type}`;
    const now = Date.now();
    const cached = connectionsCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.payload);
    }

    let requests: any[] = [];

    if (type === "received") {
      // Pending requests received by this user
      requests = await prisma.connection.findMany({
        where: {
          receiverId: userId,
          status: "PENDING",
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              username: true,
              email: true,
              phone: true,
              profileImage: true,
              title: true,
              company: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (type === "sent") {
      // Pending requests sent by this user
      requests = await prisma.connection.findMany({
        where: {
          senderId: userId,
          status: "PENDING",
        },
        include: {
          receiver: {
            select: {
              id: true,
              fullName: true,
              username: true,
              email: true,
              phone: true,
              profileImage: true,
              title: true,
              company: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (type === "accepted") {
      // Accepted connections (friends)
      requests = await prisma.connection.findMany({
        where: {
          OR: [
            { senderId: userId, status: "ACCEPTED" },
            { receiverId: userId, status: "ACCEPTED" },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              username: true,
              email: true,
              phone: true,
              profileImage: true,
              title: true,
              company: true,
            },
          },
          receiver: {
            select: {
              id: true,
              fullName: true,
              username: true,
              email: true,
              phone: true,
              profileImage: true,
              title: true,
              company: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      // Map to show the other user
      requests = requests.map((req: any) => ({
        ...req,
        user: req.senderId === userId ? req.receiver : req.sender,
      }));
    }

    const payload = { requests };
    connectionsCache.set(cacheKey, { timestamp: now, payload });

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("Error fetching connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}
