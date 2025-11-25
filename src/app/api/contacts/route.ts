import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CACHE_TTL_MS = 10_000; // 10 seconds

type ContactsCacheEntry = {
  timestamp: number;
  payload: {
    success: boolean;
    contacts: any[];
    count: number;
  };
};

// Per-user in-memory cache to reduce repeated DB hits
const contactsCache = new Map<string, ContactsCacheEntry>();

// GET - Retrieve all card connections for the logged-in user
export async function GET(req: NextRequest) {
  try {
    // Get user ID from headers (set by middleware)
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized - User not found' 
      }, { status: 401 });
    }

    const cacheKey = userId;
    const now = Date.now();
    const cached = contactsCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.payload);
    }

    // Fetch all card connections where the user is the owner
    // For existing records without ownerUserId, we'll also fetch by card ownership
    const connections = await (prisma as any).cardConnection.findMany({
      where: { 
        OR: [
          { ownerUserId: userId },
          { 
            ownerUserId: null,
            card: { userId: userId }
          }
        ]
      },
      include: {
        card: {
          select: {
            id: true,
            fullName: true,
            cardName: true
          }
        }
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    });

    const payload = { 
      success: true,
      contacts: connections,
      count: connections.length
    };

    contactsCache.set(cacheKey, { timestamp: now, payload });

    return NextResponse.json(payload);

  } catch (error: any) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to fetch contacts" 
    }, { status: 500 });
  }
}
