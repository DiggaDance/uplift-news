'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ArticleCard, { ArticleImage } from './ArticleCard';
import NewsletterBlock from './NewsletterBlock';
import Reactions from './Reactions';
import { CATEGORIES, getCategoryHue, getCategoryLabel } from '@/lib/categories';
import type { Article } from '@/app/page';

const LAYOUT = [
  { slot: 8, size: 'lg' as const },
  { slot: 4, size: 'md' as const },
  { slot: 4, size: 'md' as const },
  { slot: 4, size: 'md' as const },
  { slot: 4, size: 'md' as const },
  { slot: 7, size: 'lg' as const },
  { slot: 5, size: 'md' as const },
  { slot: 4, size: 'md' as const },
  { slot: 4, size: 'md' as const },
  { slot: 4, size: 'md' as const },
  { slot: 6, size: 'md' as const },
];

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return ''; }
}

function readTime(summary: string): number {
  return Math.max(2, Math.round((summary ?? '').split(/\s+/).length / 180));
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(/[\s.-]+/).map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return <div className="avatar">{initials}</div>;
}

function IconArrow() {
  return (
    <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

interface Props {
  featured: Article;
  initialArticles: Article[];
}

function HomeInner({ featured, initialArticles }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');

  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [activeCategory, setActiveCategory] = useState<string | null>(urlCategory);
  const [loading, setLoading] = useState(false);

  const loadArticles = useCallback(async (category: string | null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '20' });
      if (category) params.set('category', category);
      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json() as { articles: Article[] };
      setArticles((data.articles ?? []).filter(a => a.id !== featured.id));
    } catch { /* keep existing */ }
    finally { setLoading(false); }
  }, [featured.id]);

  function handleCategory(category: string | null) {
    setActiveCategory(category);
    router.push(category ? `/?category=${category}` : '/', { scroll: false });
    loadArticles(category);
  }

  const heroHue = getCategoryHue(featured.category);
  const heroLabel = getCategoryLabel(featured.category);
  const heroReadTime = readTime(featured.summary ?? '');

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="wide-container hero-grid">
          <div>
            <div className="hero-meta">
              <span className="pill">Geschichte des Tages</span>
              <span>{heroLabel}</span>
              <span>·</span>
              <span>{heroReadTime} Min. Lesen</span>
            </div>
            <h1
              style={{ cursor: 'pointer' }}
              onClick={() => router.push(`/artikel/${featured.id}`)}
            >
              {featured.title}
            </h1>
            <p className="dek">{featured.summary}</p>
            <div className="byline-row">
              <Avatar name={featured.source} />
              <div>
                <div style={{ color: 'var(--ink)', fontWeight: 500 }}>{featured.source}</div>
                <div style={{ fontSize: 12, color: 'var(--mute)' }}>
                  {fmtDate(featured.published_at ?? featured.created_at)}
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <Reactions articleId={featured.id} />
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
              <Link href={`/artikel/${featured.id}`} className="btn-primary">
                Geschichte lesen <IconArrow />
              </Link>
            </div>
          </div>
          <Link href={`/artikel/${featured.id}`} style={{ display: 'block', borderRadius: 18, overflow: 'hidden' }}>
            <ArticleImage
              imageUrl={featured.image_url}
              alt={featured.title}
              hue={heroHue}
              label={heroLabel}
              className="hero-img"
            />
          </Link>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <div className="container">
        <div className="cat-strip">
          <button
            className="cat-pill"
            data-active={!activeCategory ? 'true' : undefined}
            onClick={() => handleCategory(null)}
          >
            Alle
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className="cat-pill"
              data-active={activeCategory === c.id ? 'true' : undefined}
              onClick={() => handleCategory(c.id)}
            >
              <span style={{ color: `oklch(0.65 0.13 ${c.hue})` }}>●</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAGAZINE GRID */}
      <div className="container">
        <div className="section-head">
          <h2>
            {activeCategory ? `Mehr aus ${getCategoryLabel(activeCategory)}` : 'Mehr gute Geschichten'}
          </h2>
          <div className="sub">{articles.length} Geschichten</div>
        </div>

        {loading ? (
          <div className="mag-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`skeleton slot-${[8, 4, 4, 4, 4, 7][i] ?? 4}`}
                style={{ height: 280 }}
              />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--mute)' }}>
            <p style={{ fontSize: 18 }}>Noch keine Artikel in dieser Kategorie.</p>
          </div>
        ) : (
          <div className="mag-grid">
            {articles.map((article, i) => {
              const li = LAYOUT[i] ?? { slot: 4, size: 'md' as const };
              return (
                <div key={article.id} className={`slot-${li.slot}`}>
                  <ArticleCard article={article} size={li.size} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PULL QUOTE */}
      <div className="pullquote container" style={{ margin: '80px auto' }}>
        <blockquote>
          „Schlechte Nachrichten sind laut, gute sind langsam. Wir haben die Geduld, die guten zu finden."
        </blockquote>
        <cite>— uplift, unser Manifest</cite>
      </div>

      {/* NEWSLETTER */}
      <div className="container" style={{ paddingBottom: 80 }}>
        <NewsletterBlock />
      </div>
    </div>
  );
}

export default function HomeClient({ featured, initialArticles }: Props) {
  return (
    <Suspense fallback={<div style={{ padding: 80, textAlign: 'center', color: 'var(--mute)' }}>Laden…</div>}>
      <HomeInner featured={featured} initialArticles={initialArticles} />
    </Suspense>
  );
}
