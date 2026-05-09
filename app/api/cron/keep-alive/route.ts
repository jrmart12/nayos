import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { error } = await supabase.from('orders').select('id').limit(1);
    if (error) {
        console.error('Supabase keep-alive failed:', error.message);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    console.log('Supabase keep-alive ping succeeded');
    return NextResponse.json({ ok: true });
}
