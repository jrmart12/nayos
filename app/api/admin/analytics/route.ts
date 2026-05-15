import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'nayos_admin_session';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const expectedSecret = process.env.ADMIN_SESSION_SECRET;

  if (!session || !expectedSecret || session.value !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const { searchParams } = new URL(request.url);
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const month = searchParams.get('month') || defaultMonth;
  const [year, mon] = month.split('-').map(Number);

  const monthStart = new Date(year, mon - 1, 1).toISOString();
  const monthEnd = new Date(year, mon, 1).toISOString();

  // Supabase defaults to 1000 rows per query — paginate to fetch all records
  const PAGE_SIZE = 1000;
  const rows: { path: string; referrer: string | null; created_at: string }[] = [];
  let from = 0;
  let done = false;

  while (!done) {
    const { data, error } = await supabase
      .from('page_views')
      .select('path, referrer, created_at')
      .gte('created_at', monthStart)
      .lt('created_at', monthEnd)
      .order('created_at', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const page = data || [];
    rows.push(...page);

    if (page.length < PAGE_SIZE) {
      done = true;
    } else {
      from += PAGE_SIZE;
    }
  }

  // Daily views
  const dailyMap: Record<string, number> = {};
  rows.forEach(row => {
    const day = new Date(row.created_at).toLocaleDateString('es-HN', { day: '2-digit', month: 'short' });
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  });
  const dailyViews = Object.entries(dailyMap).map(([date, views]) => ({ date, views }));

  // Top pages
  const pageMap: Record<string, number> = {};
  rows.forEach(row => { pageMap[row.path] = (pageMap[row.path] || 0) + 1; });
  const topPages = Object.entries(pageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, views]) => ({ path, views }));

  // Top referrers (grouped by hostname)
  const refMap: Record<string, number> = {};
  rows.forEach(row => {
    if (row.referrer) {
      try {
        const host = new URL(row.referrer).hostname.replace(/^www\./, '');
        refMap[host] = (refMap[host] || 0) + 1;
      } catch { /* skip malformed URLs */ }
    }
  });
  const topReferrers = Object.entries(refMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([referrer, views]) => ({ referrer, views }));

  return NextResponse.json({
    totalViews: rows.length,
    dailyViews,
    topPages,
    topReferrers,
  });
}
