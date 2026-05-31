import { notFound } from 'next/navigation';
import Link from 'next/link';
import { sql } from '@/lib/db';
import type { Article } from '@/app/page';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard, { ArticleImage } from '@/components/ArticleCard';
import Reactions from '@/components/Reactions';
import { getCategoryHue, getCategoryLabel } from '@/lib/categories';

export const dynamic = 'force-dynamic';

function fmtDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('de-DE', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(iso));
  } catch { return ''; }
}

function readTime(summary: string): number {
  return Math.max(2, Math.round((summary ?? '').split(/\s+/).length / 180));
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(/[\s.-]+/).map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return <div className="avatar">{initials}</div>;
}

function IconBack() {
  return (
    <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  let article: Article | undefined;
  let related: Article[] = [];

  try {
    const rows = await sql`
      SELECT id, title, summary, category, image_url, source, source_url, published_at, created_at
      FROM articles WHERE id = ${numId} AND status = 'published'`;
    article = rows[0] as Article | undefined;

    if (article) {
      const relRows = await sql`
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

  const hue = getCategoryHue(article.category);
  const label = getCategoryLabel(article.category);
  const rt = readTime(article.summary ?? '');

  const sentences = (article.summary ?? '').split(/(?<=[.!?])\s+/).filter(Boolean);
  const lede = sentences[0] ?? '';
  const body = sentences.slice(1);

  return (
    <>
      <Header />
      <div className="page">
        <div className="container">
          <Link href="/" className="back-link">
            <IconBack /> zurück zur Übersicht
          </Link>
        </div>

        <article className="article-hero container">
          <div className="article-meta">
            <span className="accent">{label}</span>
            <span>·</span>
            <span>{rt} Min. Lesen</span>
            <span>·</span>
            <span>{fmtDate(article.published_at ?? article.created_at)}</span>
          </div>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-dek">{lede}</p>
          <div className="article-byline">
            <Avatar name={article.source} />
            <div>
              <div style={{ color: 'var(--ink)', fontWeight: 500 }}>{article.source}</div>
              <div style={{ fontSize: 12, color: 'var(--mute)' }}>Quelle</div>
            </div>
            <div style={{ flex: 1 }} />
            <Reactions articleId={article.id} />
          </div>
        </article>

        <div className="article-img container">
          <ArticleImage
            imageUrl={article.image_url}
            alt={article.title}
            hue={hue}
            label={label}
          />
        </div>

        <div className="container">
          <div className="article-body">
            {lede && <p className="lede">{lede}</p>}
            {body.map((p, i) => <p key={i}>{p}</p>)}

            <div className="divider" />

            <div className="article-source">
              <div>
                <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Originalquelle
                </span>
                <div style={{ marginTop: 4 }}>
                  <a href={article.source_url} target="_blank" rel="noopener noreferrer">
                    {article.source} ↗
                  </a>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginTop: 32 }}>
              <div style={{ fontSize: 14, color: 'var(--mute)' }}>
                Gefällt dir die Geschichte? Reagier darauf — das hilft uns, mehr davon zu finden.
              </div>
              <Reactions articleId={article.id} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related">
            <div className="container">
              <div className="section-head" style={{ marginTop: 0, borderColor: 'var(--line-strong)' }}>
                <h2>Wenn dich das bewegt hat</h2>
                <div className="sub">Verwandte Geschichten</div>
              </div>
              <div className="mag-grid">
                {related.map(a => (
                  <div key={a.id} className="slot-4">
                    <ArticleCard article={a} size="md" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="container" style={{ paddingBottom: 80 }}>
          <div style={{ paddingBottom: 80 }} />
        </div>
      </div>
      <Footer />
    </>
  );
}
