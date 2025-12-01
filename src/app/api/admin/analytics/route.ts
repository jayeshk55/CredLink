import { NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/services/analytics';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wantsStream =
    searchParams.get('stream') === '1' ||
    request.headers.get('accept')?.includes('text/event-stream');

  const filters = {
    usersPeriod: searchParams.get('period') || 'thisWeek' // Default to this week
  };

  if (!wantsStream) {
    try {
      const data = await getAnalyticsData(filters);
      return NextResponse.json(data);
    } catch (error) {
      console.error('Analytics API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;

      async function push() {
        try {
          const data = await getAnalyticsData(filters);
          const payload = JSON.stringify({
            stats: {
              totalUsers: data.stats.totalUsers,
              newUsers: data.stats.newUsers,
              newUsersThisMonth: (data as any)?.stats?.newUsersThisMonth ?? 0,
              newUsersThisWeek: data.stats.newUsers ?? 0,
              activeCities: (data as any)?.stats?.activeCities ?? 0,
            },
            engagementData: (data as any)?.engagementData ?? [],
            trafficData: (data as any)?.trafficData ?? [],
            activitySummaryDaily: (data as any)?.activitySummaryDaily ?? []
          });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch (e) {
          controller.enqueue(encoder.encode(`event: error\n` + `data: {"message":"fetch failed"}\n\n`));
        }
      }

      // Initial emit
      await push();

      const interval = setInterval(push, 5000);
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: keep-alive\n\n`));
      }, 15000);

      const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(interval);
        clearInterval(heartbeat);
        controller.close();
      };

      // Ensure cleanup on GC or abort
      // @ts-ignore
      request?.signal?.addEventListener?.('abort', cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}