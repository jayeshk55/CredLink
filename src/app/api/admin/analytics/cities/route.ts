import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, JWT_SECRET) as {
        adminId: string; role: string; permissions: string[];
      };
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Basic permission check – allow SUPER_ADMIN or MANAGE_ANALYTICS
    if (decoded.role !== 'SUPER_ADMIN' && !decoded.permissions?.includes('MANAGE_ANALYTICS')) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const locations = await prisma.user.findMany({
      where: { location: { not: null } },
      select: { location: true }
    });

    const uniqueCities = Array.from(new Set(locations
      .map(l => (l.location || '').trim())
      .filter(l => l.length > 0)))
      .sort((a, b) => a.localeCompare(b));

    // Optionally also include counts per city
    const cityCounts: Record<string, number> = {};
    for (const l of locations) {
      const key = (l.location || '').trim();
      if (!key) continue;
      cityCounts[key] = (cityCounts[key] || 0) + 1;
    }

    return NextResponse.json({ success: true, cities: uniqueCities, counts: cityCounts });
  } catch (err) {
    console.error('Failed to fetch cities:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch cities' }, { status: 500 });
  }
}