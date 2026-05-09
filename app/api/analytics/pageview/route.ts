import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, referrer } = body;

    if (!path || typeof path !== 'string' || !path.startsWith('/')) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await supabase.from('page_views').insert({
      path: path.slice(0, 255),
      referrer: referrer ? String(referrer).slice(0, 500) : null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
