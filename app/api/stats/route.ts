import { sql } from '@/lib/db';
import { RSS_FEEDS } from '@/lib/rss';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const { rows: todayRows } = await sql`
    SELECT COUNT(*) as count FROM articles
    WHERE status = 'published' AND created_at::date = ${today}::date`;

  const { rows: totalRows } = await sql`
    SELECT COUNT(*) as count FROM articles WHERE status = 'published'`;

  return Response.json({
    todayCount: Number(todayRows[0].count),
    totalCount: Number(totalRows[0].count),
    sourcesCount: RSS_FEEDS.length,
  });
}
