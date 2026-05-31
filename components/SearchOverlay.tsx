'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Article } from '@/app/page';
import { getCategoryHue, getCategoryLabel } from '@/lib/categories';

interface Props {
  open: boolean;
  onClose: () => void;
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ArticleThumb({ category }: { category: string }) {
  const hue = getCategoryHue(category);
  const ph1 = `oklch(0.86 0.06 ${hue})`;
  const ph2 = `oklch(0.93 0.04 ${hue})`;
  return (
    <div
      className="thumb"
      style={{
        background: `repeating-linear-gradient(135deg, ${ph1} 0px, ${ph1} 6px, ${ph2} 6px, ${ph2} 12px)`,
        borderRadius: 8,
      } as React.CSSProperties}
    />
  );
}

export default function SearchOverlay({ open, onClose }: Props) {
  const [q, setQ] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    setQ('');
    setLoading(true);
    fetch('/api/articles?limit=50')
      .then(r => r.json())
      .then((data: { articles: Article[] }) => {
        setArticles(data.articles ?? []);
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 60);
      })
      .catch(() => setLoading(false));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const results = q.trim().length === 0
    ? articles.slice(0, 6)
    : articles.filter(a => {
        const blob = `${a.title} ${a.summary} ${a.source} ${a.category}`.toLowerCase();
        return blob.includes(q.toLowerCase());
      });

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrap">
          <div style={{ width: 22, height: 22, color: 'var(--mute)', flexShrink: 0 }}>
            <IconSearch />
          </div>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Wonach suchst du Hoffnung?"
          />
          <button className="icon-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
            <div style={{ width: 14, height: 14 }}><IconClose /></div>
          </button>
        </div>
        <div className="search-results">
          {loading && (
            <div className="search-empty">Suche läuft…</div>
          )}
          {!loading && results.length === 0 && (
            <div className="search-empty">
              Keine Treffer — aber gute Nachrichten findest du trotzdem in den Kategorien.
            </div>
          )}
          {!loading && results.map(a => (
            <button
              key={a.id}
              className="search-result"
              onClick={() => { router.push(`/artikel/${a.id}`); onClose(); }}
            >
              <ArticleThumb category={a.category} />
              <div style={{ flex: 1 }}>
                <div className="meta">{getCategoryLabel(a.category)}</div>
                <h4>{a.title}</h4>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
