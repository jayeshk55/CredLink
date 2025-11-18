import { prisma } from '@/lib/prisma';

export async function getNewUsersCount(period: 'thisMonth' | 'thisWeek') {
  if (period === 'thisWeek') {
    return prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return prisma.user.count({
    where: {
      createdAt: {
        gte: startOfMonth
      }
    }
  });
}

export async function getAnalyticsData(filters: { usersPeriod?: string } = {}) {
  try {
    let dateRange = {};
    const now = new Date();

    switch(filters.usersPeriod) {
      case 'thisWeek':
        dateRange = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'lastMonth':
        dateRange = { 
          gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          lt: new Date(now.getFullYear(), now.getMonth(), 1)
        };
        break;
      case 'last3Months':
        dateRange = { 
          gte: new Date(now.getFullYear(), now.getMonth() - 3, 1),
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        };
        break;
      case 'thisYear':
        dateRange = { 
          gte: new Date(now.getFullYear(), 0, 1),
          lt: new Date(now.getFullYear() + 1, 0, 1)
        };
        break;
      default:
        // No date filter by default
        dateRange = {};
    }

    // Get user statistics with optional date filter
    const totalUsers = await prisma.user.count();
    const newUsers = await prisma.user.count({
      where: {
        ...(Object.keys(dateRange).length ? { createdAt: dateRange } : {})
      }
    });

    // Get total profile views
    const totalProfileViews = await prisma.user.aggregate({
      _sum: {
        views: true
      }
    });

    // Get message statistics
    const totalMessages = await prisma.message.count();
    const newMessages = await prisma.message.count({
      where: {
        createdAt: dateRange
      }
    });

    // Get daily user registrations for the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyRegistrations = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Format daily data for chart
    const trafficData = [] as { name: string; visits: number }[];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const registrationsForDay = dailyRegistrations.filter((reg: any) => 
        reg.createdAt.toISOString().split('T')[0] === dateStr
      );
      
      const visits = registrationsForDay.reduce((sum: number, reg: any) => sum + reg._count.id, 0);
      
      trafficData.push({
        name: dayName,
        visits: visits
      });
    }

    // Get user distribution by title
    const usersByTitle = await prisma.user.groupBy({
      by: ['title'],
      where: {
        title: {
          not: null
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    const recentUsers = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 30,
      select: {
        id: true,
        fullName: true,
        title: true,
        location: true,
        createdAt: true
      }
    });

    // Build daily activity summary for last 10 days preserving original UI structure
    const since = new Date();
    since.setDate(since.getDate() - 10);

    const usersLastNDays = await prisma.user.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        title: true,
        location: true,
        createdAt: true,
      },
    });

    function formatUIDate(d: Date) {
      const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      return new Intl.DateTimeFormat('en-US', opts).format(d);
    }

    type DayRow = {
      date: string;
      newUsers: number;
      usersJoined: { name: string; city: string; category: string }[];
      topCity: string;
      topCategory: string;
    };

    const byDay = new Map<string, { users: { name: string; city: string; category: string }[] }>();
    for (const u of usersLastNDays) {
      const key = formatUIDate(new Date(u.createdAt));
      const list = byDay.get(key) ?? { users: [] };
      list.users.push({ name: u.fullName, city: u.location || 'Unknown', category: u.title || 'Other' });
      byDay.set(key, list);
    }

    function topOf(arr: string[]) {
      if (arr.length === 0) return 'Unknown';
      const freq: Record<string, number> = {};
      for (const v of arr) freq[v] = (freq[v] || 0) + 1;
      return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
    }

    const activitySummaryDaily: DayRow[] = Array.from(byDay.entries())
      .map(([date, { users }]) => ({
        date,
        newUsers: users.length,
        usersJoined: users,
        topCity: topOf(users.map(u => u.city)),
        topCategory: topOf(users.map(u => u.category)),
      }))
      // keep latest dates first
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const engagementData = usersByTitle.map((titleGroup: any) => ({
      name: titleGroup.title || 'Other',
      value: titleGroup._count.id
    }));

    // Compute active cities (distinct user locations)
    const citiesGroup = await prisma.user.groupBy({
      by: ['location'],
      where: {
        AND: [
          { location: { not: null } },
          { location: { not: '' } },
        ]
      }
    });
    const activeCitiesCount = citiesGroup.length;

    // If no title data, provide default categories
    if (engagementData.length === 0) {
      engagementData.push(
        { name: 'Professionals', value: Math.floor(totalUsers * 0.4) },
        { name: 'Students', value: Math.floor(totalUsers * 0.3) },
        { name: 'Freelancers', value: Math.floor(totalUsers * 0.2) },
        { name: 'Others', value: Math.floor(totalUsers * 0.1) }
      );
    }

    return {
      trafficData,
      engagementData,
      stats: {
        totalVisits: totalProfileViews._sum.views || 0,
        profileViews: totalProfileViews._sum.views || 0,
        totalSearches: totalMessages,
        newUsers,
        totalUsers,
        totalMessages,
        newMessages,
        activeCities: activeCitiesCount
      },
      activitySummary: recentUsers.map((user: any) => ({
        id: user.id,
        name: user.fullName,
        city: user.location || 'Unknown',
        category: user.title || 'Other',
        date: user.createdAt
      })),
      activitySummaryDaily
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Fallback to basic stats if detailed queries fail
    try {
      const totalUsers = await prisma.user.count();
      const totalMessages = await prisma.message.count();
      
      return {
        trafficData: [
          { name: 'Mon', visits: 0 },
          { name: 'Tue', visits: 0 },
          { name: 'Wed', visits: 0 },
          { name: 'Thu', visits: 0 },
          { name: 'Fri', visits: 0 },
          { name: 'Sat', visits: 0 },
          { name: 'Sun', visits: 0 }
        ],
        engagementData: [
          { name: 'Users', value: totalUsers }
        ],
        stats: {
          totalVisits: 0,
          profileViews: 0,
          totalSearches: totalMessages,
          newUsers: 0,
          totalUsers,
          totalMessages,
          newMessages: 0,
          activeCities: 0
        },
        activitySummary: [],
        activitySummaryDaily: []
      };
    } catch (fallbackError) {
      console.error('Fallback analytics query failed:', fallbackError);
      throw fallbackError;
    }
  }
}