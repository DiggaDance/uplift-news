'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Article } from '@/app/page';

const CATEGORY_EMOJI: Record<string, string> = {
  Natur: '🌿',
  Tiere: '🌿',
  Wissenschaft: '🚀',
  Wirtschaft: '🏆',
  Menschen: '❤️',
  Gesundheit: '💡',
};

const CATEGORY_LABEL: Record<string, string> = {
  Natur: 'Natur-Wunder',
  Tiere: 'Natur-Wunder',
  Wissenschaft: 'Zukunftsmacher',
  Wirtschaft: 'Heldentaten',
  Menschen: 'Herzstücke',
  Gesundheit: 'Geistesblitze',
};

interface Props {
  article: Article;
  size?: 'large' | 'small';
}

export default function ArticleCard({ article, size = 'small' }: Props) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const key = `reaction_${article.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const { count: c, liked: l } = JSON.parse(stored) as { count: number; liked: boolean };
        setCount(c);
        setLiked(l);
      } catch { /* ignore */ }
    } else {
      const initial = Math.floor(Math.random() * 80) + 10;
      setCount(initial);
      localStorage.setItem(key, JSON.stringify({ count: initial, liked: false }));
    }
  }, [article.id]);

  function handleReaction(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : Math.max(0, count - 1);
    const key = `reaction_${article.id}`;
    setLiked(newLiked);
    setCount(newCount);
    localStorage.setItem(key, JSON.stringify({ count: newCount, liked: newLiked }));
  }

  const emoji = CATEGORY_EMOJI[article.category] ?? '✨';
  const label = CATEGORY_LABEL[article.category] ?? article.category;
  const imageHeight = size === 'large' ? 'h-56' : 'h-44';

  return (
    <Link href={`/artikel/${article.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className={`relative ${imageHeight} w-full shrink-0 overflow-hidden`}>
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800] to-[#FF8C42]" />
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[#1A1A2E] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {emoji} {label}
            </span>
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col flex-1 p-4">
          <h2
            className={`font-black uppercase text-[#1A1A2E] leading-tight line-clamp-3 flex-1 group-hover:text-[#F59E0B] transition-colors ${size === 'large' ? 'text-xl' : 'text-sm'}`}
          >
            {article.title}
          </h2>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-stone-400 truncate max-w-[55%]">{article.source}</span>
            <button
              onClick={handleReaction}
              className={`flex items-center gap-1.5 text-sm font-bold transition-all shrink-0 ${liked ? 'text-red-500 scale-110' : 'text-stone-400 hover:text-red-400'}`}
              aria-label="Gefällt mir"
            >
              <span className="text-base">{liked ? '❤️' : '🤍'}</span>
              <span>{count}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
