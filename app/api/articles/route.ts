import type { NextRequest } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
  const offset = parseInt(searchParams.get('offset') ?? '0');

  const filterByCategory = category && category !== 'Alle';

  const { rows: articles } = filterByCategory
    ? await sql`
        SELECT id, title, summary, category, image_url, source, source_url, published_at, created_at
        FROM articles
        WHERE status = 'published' AND category = ${category}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}`
    : await sql`
        SELECT id, title, summary, category, image_url, source, source_url, published_at, created_at
        FROM articles
        WHERE status = 'published'
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}`;

  const { rows: countRows } = filterByCategory
    ? await sql`SELECT COUNT(*) as count FROM articles WHERE status = 'published' AND category = ${category}`
    : await sql`SELECT COUNT(*) as count FROM articles WHERE status = 'published'`;

  return Response.json({ articles, total: Number(countRows[0].count) });
}
