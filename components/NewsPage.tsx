'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Article } from '@/app/page';
import ArticleCard from './ArticleCard';
import Sidebar from './Sidebar';

const CATEGORIES = ['Alle', 'Wissenschaft', 'Natur', 'Menschen', 'Wirtschaft', 'Gesundheit', 'Tiere'];

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

  function handleCategory(cat: string) {
    setActiveCategory(cat);
    router.push(cat === 'Alle' ? '/' : `/?category=${cat}`, { scroll: false });
    loadArticles(cat);
  }

  return (
    <div className="bg-[#F7F7F2]">
      {/* Category tab bar — Bild.de style */}
      <div className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-5 py-3.5 text-sm font-bold whitespace-nowrap shrink-0 border-b-4 transition-colors ${
                  activeCategory === cat
                    ? 'border-[#FFB800] text-[#1A1A2E]'
                    : 'border-transparent text-stone-500 hover:text-[#1A1A2E] hover:border-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6 items-start">
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white overflow-hidden shadow-sm animate-pulse">
                    <div className="bg-stone-200" style={{ aspectRatio: '3/2' }} />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-stone-200 rounded w-1/4" />
                      <div className="h-5 bg-stone-200 rounded w-full" />
                      <div className="h-5 bg-stone-200 rounded w-4/5" />
                      <div className="h-3 bg-stone-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-24 text-stone-400">
                <p className="text-5xl mb-4">🌱</p>
                <p className="text-xl font-bold text-[#1A1A2E]">Noch keine Artikel in dieser Kategorie</p>
                <p className="mt-2 text-sm">
                  Starte die Verarbeitung unter{' '}
                  <code className="bg-stone-100 px-1.5 py-0.5 rounded text-[#3DAA5C]">/api/fetch-news</code>
                </p>
              </div>
            ) : (
              <>
                <p className="text-stone-400 text-xs font-semibold uppercase tracking-wide mb-4">
                  {total} positive Artikel{activeCategory !== 'Alle' ? ` · ${activeCategory}` : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            )}
          </main>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
