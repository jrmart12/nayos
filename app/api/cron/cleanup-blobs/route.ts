import { list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        // List all blobs
        const { blobs } = await list();

        // Calculate the cutoff date (7 days ago)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Filter blobs older than 7 days
        const oldBlobs = blobs.filter(blob => {
            const uploadDate = new Date(blob.uploadedAt);
            return uploadDate < sevenDaysAgo;
        });

        // Delete old blobs
        if (oldBlobs.length > 0) {
            const urlsToDelete = oldBlobs.map(blob => blob.url);
            await del(urlsToDelete);

            console.log(`Deleted ${oldBlobs.length} blobs older than 7 days`);

            return NextResponse.json({
                success: true,
                deletedCount: oldBlobs.length,
                deletedUrls: urlsToDelete.map(url => ({
                    url,
                    uploadedAt: oldBlobs.find(b => b.url === url)?.uploadedAt
                }))
            });
        }

        return NextResponse.json({
            success: true,
            deletedCount: 0,
            message: 'No blobs older than 7 days found'
        });

    } catch (error) {
        console.error('Error cleaning up blobs:', error);
        return NextResponse.json(
            { error: 'Failed to clean up blobs', details: (error as Error).message },
            { status: 500 }
        );
    }
}
