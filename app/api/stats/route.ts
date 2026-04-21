import { getDb } from '@/lib/db';
import { RSS_FEEDS } from '@/lib/rss';

export async function GET() {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  const { todayCount } = db
    .prepare(`SELECT COUNT(*) as todayCount FROM articles WHERE status = 'published' AND DATE(created_at) = ?`)
    .get(today) as { todayCount: number };

  const { totalCount } = db
    .prepare(`SELECT COUNT(*) as totalCount FROM articles WHERE status = 'published'`)
    .get() as { totalCount: number };

  return Response.json({
    todayCount,
    totalCount,
    sourcesCount: RSS_FEEDS.length,
  });
}
