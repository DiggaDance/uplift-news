import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { sql } from '@/lib/db';
import type { Article } from '@/app/page';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import CategoryBadge from '@/components/CategoryBadge';

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return '';
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id);

  let article: Article | undefined;
  let related: Article[] = [];

  try {
    const { rows } = await sql`
      SELECT id, title, summary, category, image_url, source, source_url, published_at, created_at
      FROM articles WHERE id = ${numId} AND status = 'published'`;
    article = rows[0] as Article | undefined;

    if (article) {
      const { rows: relRows } = await sql`
        SELECT id, title, summary, category, image_url, source, source_url, published_at, created_at
        FROM articles
        WHERE status = 'published' AND id != ${numId}
        ORDER BY (category = ${article.category}) DESC, created_at DESC
        LIMIT 3`;
      related = relRows as Article[];
    }
  } catch {
    notFound();
  }

  if (!article) notFound();

  const sentences = article.summary?.split('. ').filter(Boolean) ?? [];

  return (
    <>
      <Header />
      <div className="bg-[#F7F7F2] min-h-screen">
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6 font-semibold uppercase tracking-wide">
            <Link href="/" className="hover:text-[#FFB800] transition-colors">Uplift.news</Link>
            <span className="text-stone-300">›</span>
            <Link href={`/?category=${article.category}`} className="hover:text-[#FFB800] transition-colors">
              {article.category}
            </Link>
            <span className="text-stone-300">›</span>
            <span className="text-stone-500 truncate max-w-xs normal-case tracking-normal">{article.title}</span>
          </nav>

          <article className="bg-white shadow-sm">
            {/* Article header */}
            <div className="p-6 md:p-8 pb-0">
              <div className="flex items-center gap-3 mb-4">
                <CategoryBadge category={article.category} />
                <time className="text-stone-400 text-sm">{formatDate(article.created_at)}</time>
              </div>

              <h1
                className="font-black text-[#1A1A2E] leading-tight mb-6"
                style={{ fontSize: 'clamp(24px, 4vw, 40px)', lineHeight: '1.15' }}
              >
                {article.title}
              </h1>
            </div>

            {article.image_url && (
              <div className="relative overflow-hidden bg-stone-100" style={{ aspectRatio: '16/7' }}>
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="space-y-4">
                {sentences.map((sentence, i) => (
                  <p key={i} className="text-stone-700 text-lg leading-relaxed">
                    {sentence}{sentence.endsWith('.') ? '' : '.'}
                  </p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t-2 border-[#FFB800] flex items-center gap-3">
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-1">Originalquelle</p>
                  <a
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3DAA5C] hover:text-[#2d8a49] font-bold text-sm transition-colors"
                  >
                    {article.source} ↗
                  </a>
                </div>
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-1 w-8 bg-[#FFB800]" />
                <h2 className="text-xl font-black text-[#1A1A2E] uppercase tracking-wide">
                  Weitere positive Nachrichten
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <ArticleCard key={rel.id} article={rel} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#e6a600] text-[#1A1A2E] font-black px-8 py-3 transition-colors"
            >
              ← Alle positiven Nachrichten
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
