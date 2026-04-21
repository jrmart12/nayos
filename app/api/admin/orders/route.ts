import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'nayos_admin_session';

export async function GET(request: NextRequest) {
  // Verify admin session
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const expectedSecret = process.env.ADMIN_SESSION_SECRET;

  if (!session || !expectedSecret || session.value !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { searchParams } = new URL(request.url);
  // Expect month in YYYY-MM format; default to current month
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const month = searchParams.get('month') || defaultMonth;
  const [year, mon] = month.split('-').map(Number);

  const monthStart = new Date(year, mon - 1, 1);
  const monthEnd = new Date(year, mon, 1); // exclusive upper bound

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', monthStart.toISOString())
    .lt('created_at', monthEnd.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}
