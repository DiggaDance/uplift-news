const CATEGORY_MAP: Record<string, { emoji: string; label: string }> = {
  Natur: { emoji: '🌿', label: 'Natur-Wunder' },
  Tiere: { emoji: '🌿', label: 'Natur-Wunder' },
  Wissenschaft: { emoji: '🚀', label: 'Zukunftsmacher' },
  Wirtschaft: { emoji: '🏆', label: 'Heldentaten' },
  Menschen: { emoji: '❤️', label: 'Herzstücke' },
  Gesundheit: { emoji: '💡', label: 'Geistesblitze' },
};

export const CATEGORY_COLORS: Record<string, string> = {
  Wissenschaft: 'bg-blue-500',
  Natur: 'bg-emerald-500',
  Menschen: 'bg-rose-500',
  Wirtschaft: 'bg-amber-600',
  Gesundheit: 'bg-purple-500',
  Tiere: 'bg-emerald-500',
};

export default function CategoryBadge({ category }: { category: string }) {
  const cat = CATEGORY_MAP[category];
  const emoji = cat?.emoji ?? '✨';
  const label = cat?.label ?? category;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#1A1A2E] shadow-sm">
      {emoji} {label}
    </span>
  );
}
