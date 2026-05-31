export interface Category {
  id: string;
  label: string;
  hue: number;
}

export const CATEGORIES: Category[] = [
  { id: 'Natur', label: 'Natur', hue: 145 },
  { id: 'Tiere', label: 'Tiere', hue: 90 },
  { id: 'Wissenschaft', label: 'Wissenschaft', hue: 220 },
  { id: 'Wirtschaft', label: 'Wirtschaft', hue: 25 },
  { id: 'Menschen', label: 'Menschen', hue: 30 },
  { id: 'Gesundheit', label: 'Gesundheit', hue: 10 },
];

export function getCategoryHue(category: string): number {
  return CATEGORIES.find(c => c.id === category)?.hue ?? 60;
}

export function getCategoryLabel(category: string): string {
  return CATEGORIES.find(c => c.id === category)?.label ?? category;
}
