import { sql } from '@/lib/db';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import NewsPage from '@/components/NewsPage';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  image_url: string | null;
  source: string;
  source_url: string;
  published_at: string;
  created_at: string;
}

async function getInitialData() {
  try {
    const articles = await sql`
      SELECT id, title, summary, category, image_url, source, source_url, published_at, created_at
      FROM articles WHERE status = 'published'
      ORDER BY created_at DESC LIMIT 21` as Article[];

    const countRows = await sql`
      SELECT COUNT(*) as count FROM articles WHERE status = 'published'`;

    return { articles, total: Number(countRows[0].count) };
  } catch {
    return { articles: [], total: 0 };
  }
}

export default async function Home() {
  const { articles, total } = await getInitialData();
  const [hero, ...rest] = articles;

  return (
    <>
      <Header />
      {hero && <HeroSection article={hero} />}
      <NewsPage initialArticles={rest} initialTotal={total} hasHero={!!hero} />
      <Footer />
    </>
  );
}
