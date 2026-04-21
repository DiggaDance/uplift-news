import type { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
  const offset = parseInt(searchParams.get('offset') ?? '0');

  const db = getDb();

  const whereCategory = category && category !== 'Alle' ? 'AND category = ?' : '';
  const params: (string | number)[] = [];
  if (category && category !== 'Alle') params.push(category);

  const articles = db
    .prepare(
      `SELECT id, title, summary, category, image_url, source, source_url, published_at, created_at
       FROM articles
       WHERE status = 'published' ${whereCategory}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset);

  const { count } = db
    .prepare(
      `SELECT COUNT(*) as count FROM articles WHERE status = 'published' ${whereCategory}`
    )
    .get(...params) as { count: number };

  return Response.json({ articles, total: count });
}
