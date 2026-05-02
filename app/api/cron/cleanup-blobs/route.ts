import { list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const deleted: string[] = [];
    let cursor: string | undefined;

    do {
        const result = await list({ cursor, limit: 1000 });

        const oldBlobs = result.blobs.filter(
            blob => new Date(blob.uploadedAt) < oneWeekAgo
        );

        if (oldBlobs.length > 0) {
            await del(oldBlobs.map(b => b.url));
            deleted.push(...oldBlobs.map(b => b.pathname));
        }

        cursor = result.cursor;
    } while (cursor);

    console.log(`Cron cleanup-blobs: deleted ${deleted.length} blobs older than 1 week`);
    return NextResponse.json({ ok: true, deleted: deleted.length, files: deleted });
}
