export const CATEGORY_COLORS: Record<string, string> = {
  Wissenschaft: 'bg-[#3DAA5C]',
  Natur: 'bg-[#2d8a49]',
  Menschen: 'bg-[#48b86a]',
  Wirtschaft: 'bg-[#1a7a40]',
  Gesundheit: 'bg-[#3DAA5C]',
  Tiere: 'bg-[#5bc97a]',
};

export default function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block text-xs font-black px-2.5 py-1 bg-[#3DAA5C] text-white uppercase tracking-wide">
      {category}
    </span>
  );
}
