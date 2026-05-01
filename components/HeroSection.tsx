import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/app/page';
import CategoryBadge from './CategoryBadge';

interface Props {
  article: Article;
}

export default function HeroSection({ article }: Props) {
  return (
    <section className="w-full">
      <Link href={`/artikel/${article.id}`} className="group block">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/7' }}>
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800] via-[#FF8C42] to-[#1A1A2E]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

          <div className="absolute top-5 left-5 md:top-8 md:left-10 flex items-center gap-3">
            <span className="bg-[#FFB800] text-[#1A1A2E] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow">
              ✨ Nachricht des Tages
            </span>
            <CategoryBadge category={article.category} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-tight max-w-4xl group-hover:text-[#FFB800] transition-colors drop-shadow-lg">
              {article.title}
            </h1>
            <p className="mt-3 text-white/75 text-sm md:text-lg max-w-3xl line-clamp-2 hidden md:block font-medium">
              {article.summary?.split('. ')[0]}.
            </p>
            <p className="mt-3 text-[#FFB800]/60 text-xs uppercase tracking-widest">Quelle: {article.source}</p>
          </div>
        </div>
      </Link>
    </section>
  );
}
