import Link from 'next/link';
import Image from 'next/image';
import Reactions from './Reactions';
import { getCategoryHue, getCategoryLabel } from '@/lib/categories';
import type { Article } from '@/app/page';

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return ''; }
}

function readTime(summary: string): number {
  return Math.max(2, Math.round((summary ?? '').split(/\s+/).length / 180));
}

export function ArticleImage({
  imageUrl, alt, hue, label, className = '',
}: {
  imageUrl: string | null;
  alt: string;
  hue: number;
  label: string;
  className?: string;
}) {
  const ph1 = `oklch(0.86 0.06 ${hue})`;
  const ph2 = `oklch(0.93 0.04 ${hue})`;

  if (imageUrl) {
    return (
      <div
        className={`imgph real-img ${className}`}
        style={{ '--ph-1': ph1, '--ph-2': ph2, padding: 0 } as React.CSSProperties}
      >
        <Image src={imageUrl} alt={alt} fill style={{ objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div
      className={`imgph ${className}`}
      style={{ '--ph-1': ph1, '--ph-2': ph2 } as React.CSSProperties}
    >
      <span className="ph-label">{label}</span>
    </div>
  );
}

interface Props {
  article: Article;
  size?: 'md' | 'lg' | 'xl';
}

export default function ArticleCard({ article, size = 'md' }: Props) {
  const hue = getCategoryHue(article.category);
  const label = getCategoryLabel(article.category);
  const rt = readTime(article.summary ?? '');
  const dateStr = fmtDate(article.published_at ?? article.created_at);

  return (
    <Link href={`/artikel/${article.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article className={`card ${size}`}>
        <ArticleImage
          imageUrl={article.image_url}
          alt={article.title}
          hue={hue}
          label={label}
        />
        <div className="meta">
          <span className="accent">{label}</span>
          <span>·</span>
          <span>{rt} Min.</span>
        </div>
        <h3>{article.title}</h3>
        {(size === 'lg' || size === 'xl') && (
          <p className="dek">{article.summary}</p>
        )}
        <div className="footrow">
          <span>{article.source} · {dateStr}</span>
          <Reactions articleId={article.id} />
        </div>
      </article>
    </Link>
  );
}
