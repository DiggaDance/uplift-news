import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/app/page';
import CategoryBadge from './CategoryBadge';

interface Props {
  article: Article;
  size?: 'large' | 'small';
}

export default function ArticleCard({ article, size = 'small' }: Props) {
  const titleSize = size === 'large' ? '21px' : '14px';

  return (
    <Link href={`/artikel/${article.id}`} className="group block h-full">
      <div className="relative overflow-hidden bg-stone-900 w-full h-full">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800] to-[#3DAA5C]" />
        )}

        {/* Dark gradient for readability — heavier at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Category badge — top-left */}
        <div className="absolute top-0 left-0">
          <CategoryBadge category={article.category} />
        </div>

        {/* Headline overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <h2
            className="font-black text-white leading-tight line-clamp-3 group-hover:text-[#FFB800] transition-colors"
            style={{ fontSize: titleSize, lineHeight: '1.2' }}
          >
            {article.title}
          </h2>
        </div>
      </div>
    </Link>
  );
}
