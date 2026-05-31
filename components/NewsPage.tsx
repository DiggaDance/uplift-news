'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Article } from '@/app/page';
import ArticleCard from './ArticleCard';

const EMOJI_CATEGORIES = [
  { display: 'Alle', emoji: '', apiName: 'Alle' },
  { display: 'Natur-Wunder', emoji: '🌿', apiName: 'Natur' },
  { display: 'Zukunftsmacher', emoji: '🚀', apiName: 'Wissenschaft' },
  { display: 'Herzstücke', emoji: '❤️', apiName: 'Menschen' },
  { display: 'Heldentaten', emoji: '🏆', apiName: 'Wirtschaft' },
  { display: 'Geistesblitze', emoji: '💡', apiName: 'Gesundheit' },
];

interface Props {
  initialArticles: Article[];
  initialTotal: number;
  hasHero: boolean;
}

export default function NewsPage({ initialArticles, initialTotal, hasHero }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get('category') ?? 'Alle';

  const [articles, setArticles] = useState(initialArticles);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialTotal);
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const loadArticles = useCallback(async (category: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '20' });
      if (category !== 'Alle') params.set('category', category);
      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json() as { articles: Article[]; total: number };
      setArticles(data.articles);
      setTotal(data.total);
    } catch {
      // keep existing articles on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (urlCategory !== 'Alle') {
      setActiveCategory(urlCategory);
      loadArticles(urlCategory);
    }
  }, [urlCategory, loadArticles]);

  function handleCategory(apiName: string) {
    setActiveCategory(apiName);
    router.push(apiName === 'Alle' ? '/' : `/?category=${apiName}`, { scroll: false });
    loadArticles(apiName);
  }

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setNewsletterStatus('success');
        setNewsletterMsg(data.message ?? 'Erfolgreich angemeldet!');
        setEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMsg(data.error ?? 'Fehler aufgetreten.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMsg('Verbindungsfehler. Bitte versuche es erneut.');
    }
  }

  return (
    <div>
      {/* Emoji category pills */}
      <div className="bg-[#FFF8E1] border-b border-[#FFB800]/30 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 scrollbar-none pb-1">
            {EMOJI_CATEGORIES.map((cat) => (
              <button
                key={cat.apiName}
                onClick={() => handleCategory(cat.apiName)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shrink-0 transition-all ${
                  activeCategory === cat.apiName
                    ? 'bg-[#FFB800] text-[#1A1A2E] shadow-md scale-105'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-[#FFB800] hover:text-[#1A1A2E] shadow-sm'
                }`}
              >
                {cat.emoji && <span>{cat.emoji}</span>}
                {cat.display}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Article grid */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl animate-pulse h-72 ${i % 5 === 0 ? 'sm:col-span-2' : ''}`}
              />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            <p className="text-5xl mb-4">🌱</p>
            <p className="text-xl font-bold text-[#1A1A2E]">Noch keine Artikel in dieser Kategorie</p>
            <p className="mt-2 text-sm">
              Starte die Verarbeitung unter{' '}
              <code className="bg-white px-1.5 py-0.5 rounded text-[#3DAA5C]">/api/fetch-news</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, i) => {
              const isLarge = i % 5 === 0;
              return (
                <div
                  key={article.id}
                  className={isLarge ? 'sm:col-span-2' : 'col-span-1'}
                >
                  <ArticleCard article={article} size={isLarge ? 'lg' : 'md'} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Newsletter */}
      <section className="bg-[#1A1A2E] mt-8 py-12 px-4">
        <div className="max-w-lg mx-auto text-center text-white">
          <span className="inline-block bg-[#FFB800] text-[#1A1A2E] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
            Newsletter
          </span>
          <h2 className="font-black text-3xl leading-tight mb-2">Täglich Uplift</h2>
          <p className="text-stone-400 text-sm mb-6 leading-relaxed">
            Die besten positiven Nachrichten — direkt in dein Postfach. Kostenlos.
          </p>
          {newsletterStatus === 'success' ? (
            <p className="bg-[#3DAA5C]/20 border border-[#3DAA5C] text-[#3DAA5C] rounded-xl p-3 text-sm font-medium">
              ✓ {newsletterMsg}
            </p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white text-sm placeholder:text-stone-500 focus:outline-none focus:border-[#FFB800]"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="bg-[#FFB800] text-[#1A1A2E] font-black px-6 py-3 rounded-full text-sm hover:bg-[#F59E0B] transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {newsletterStatus === 'loading' ? 'Anmelden…' : 'Jetzt anmelden'}
              </button>
            </form>
          )}
          {newsletterStatus === 'error' && (
            <p className="text-red-400 text-xs mt-2">{newsletterMsg}</p>
          )}
        </div>
      </section>
    </div>
  );
}
