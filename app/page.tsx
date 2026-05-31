import { sql } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeClient from '@/components/HomeClient';

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
    return { articles };
  } catch {
    return { articles: [] };
  }
}

export default async function Home() {
  const { articles } = await getInitialData();
  const [featured, ...rest] = articles;

  if (!featured) {
    return (
      <>
        <Header />
        <div style={{ padding: '120px 0', textAlign: 'center', color: 'var(--mute)' }}>
          <p style={{ fontSize: 18 }}>Noch keine Artikel vorhanden.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            Starte die Verarbeitung unter{' '}
            <a href="/api/fetch-news" style={{ color: 'var(--accent-strong)' }}>
              /api/fetch-news
            </a>
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <HomeClient featured={featured} initialArticles={rest} />
      <Footer />
    </>
  );
}
