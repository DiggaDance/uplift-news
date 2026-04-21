import { getDb } from '@/lib/db';
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

function getInitialData() {
  try {
    const db = getDb();
    const articles = db
      .prepare(
        `SELECT id, title, summary, category, image_url, source, source_url, published_at, created_at
         FROM articles WHERE status = 'published'
         ORDER BY created_at DESC LIMIT 21`
      )
      .all() as Article[];

    const { count } = db
      .prepare(`SELECT COUNT(*) as count FROM articles WHERE status = 'published'`)
      .get() as { count: number };

    return { articles, total: count };
  } catch {
    return { articles: [], total: 0 };
  }
}

export default function Home() {
  const { articles, total } = getInitialData();
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
