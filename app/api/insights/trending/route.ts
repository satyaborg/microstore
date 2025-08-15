import { NextRequest, NextResponse } from 'next/server';
import { trending } from '@/lib/providers/googleTrends';
import { withCache } from '@/lib/redis';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const geo = searchParams.get('geo') || process.env.DEFAULT_GEO || 'AU';
    const mode = (searchParams.get('mode') || 'realtime') as 'daily' | 'realtime';
    const category = searchParams.get('category') || 'b';

    const cacheKey = `gt:trending:${geo}:${mode}:${category}`;

    const data = await withCache(cacheKey, 300, async () => {
      return await trending(geo, mode, category);
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Trending API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending data' },
      { status: 500 }
    );
  }
}