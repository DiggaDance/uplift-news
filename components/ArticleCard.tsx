import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/app/page';
import CategoryBadge from './CategoryBadge';

interface Props {
  article: Article;
}

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short' }).format(new Date(dateStr));
  } catch {
    return '';
  }
}

export default function ArticleCard({ article }: Props) {
  const firstSentence = article.summary?.split('. ')[0] + '.';

  return (
    <Link href={`/artikel/${article.id}`} className="group block h-full">
      <article className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col border-t-2 border-transparent hover:border-[#FFB800]">
        {/* Image: ~62% of card visual height */}
        <div className="relative overflow-hidden bg-stone-100 shrink-0" style={{ aspectRatio: '3/2' }}>
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800] to-[#3DAA5C] flex items-center justify-center text-5xl">
              ☀️
            </div>
          )}
          {/* Category badge overlaid bottom-left */}
          <div className="absolute bottom-0 left-0">
            <CategoryBadge category={article.category} />
          </div>
        </div>

        {/* Text area */}
        <div className="p-3 flex flex-col flex-1">
          <h2
            className="font-black text-[#1A1A2E] leading-tight mb-2 line-clamp-3 group-hover:text-[#3DAA5C] transition-colors"
            style={{ fontSize: '20px', lineHeight: '1.25' }}
          >
            {article.title}
          </h2>
          <p className="text-stone-500 text-sm leading-snug line-clamp-2 flex-1">
            {firstSentence}
          </p>
          <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
            <span className="truncate max-w-[65%] font-medium">{article.source}</span>
            <span>{formatDate(article.created_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
