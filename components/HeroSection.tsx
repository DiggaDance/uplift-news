import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/app/page';

interface Props {
  article: Article;
}

export default function HeroSection({ article }: Props) {
  return (
    <section className="w-full bg-[#F7F7F2]">
      <div className="max-w-7xl mx-auto">
        <Link href={`/artikel/${article.id}`} className="group block">
          <div className="relative w-full overflow-hidden bg-[#1A1A2E]" style={{ aspectRatio: '21/8' }}>
            {article.image_url ? (
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#3DAA5C] via-[#1A7A40] to-[#1A1A2E]" />
            )}

            {/* Gradient overlay — green-tinted dark */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/95 via-[#1A1A2E]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A2E]/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#FFB800] text-[#1A1A2E] text-xs font-black uppercase tracking-widest px-3 py-1">
                  ✨ Nachricht des Tages
                </span>
                <span className="bg-[#3DAA5C] text-white text-xs font-bold px-2.5 py-1 uppercase tracking-wide">
                  {article.category}
                </span>
              </div>
              <h1 className="text-2xl md:text-5xl font-black text-white leading-tight max-w-4xl group-hover:text-[#FFB800] transition-colors">
                {article.title}
              </h1>
              <p className="mt-3 text-white/75 text-sm md:text-lg max-w-3xl line-clamp-2 hidden md:block">
                {article.summary?.split('. ')[0]}.
              </p>
              <p className="mt-3 text-white/40 text-xs uppercase tracking-widest">Quelle: {article.source}</p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
