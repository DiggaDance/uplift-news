'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const EMOJI_CATEGORIES = [
  { display: 'Alle', emoji: '', apiName: 'Alle' },
  { display: 'Natur-Wunder', emoji: '🌿', apiName: 'Natur' },
  { display: 'Zukunftsmacher', emoji: '🚀', apiName: 'Wissenschaft' },
  { display: 'Herzstücke', emoji: '❤️', apiName: 'Menschen' },
  { display: 'Heldentaten', emoji: '🏆', apiName: 'Wirtschaft' },
  { display: 'Geistesblitze', emoji: '💡', apiName: 'Gesundheit' },
];

const TICKER_ITEMS = [
  '🌱 Regenwald-Restaurierung: 10 Millionen Bäume in Brasilien gepflanzt',
  '🔬 Durchbruch bei Alzheimer-Forschung gibt neue Hoffnung',
  '☀️ Solarenergie deckt erstmals 50% des deutschen Strombedarfs',
  '🤝 Studie: Weltweite Hilfsbereitschaft auf Rekordhoch',
  '🐋 Walpopulationen erholen sich schneller als erwartet',
  '🏫 Neue Initiative: Bildungszugang für 2 Millionen Kinder weltweit verbessert',
  '🌍 Ozonschicht erholt sich planmäßig – Wissenschaftler jubeln',
  '💊 Neues Medikament heilt seltene Kinderkrankheit vollständig',
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [todayCount, setTodayCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data: { todayCount: number }) => setTodayCount(data.todayCount))
      .catch(() => {});
  }, []);

  const liveStat =
    todayCount !== null
      ? `☀️ HEUTE: ${todayCount} LICHTBLICKE ENTDECKT`
      : '☀️ POSITIVE NACHRICHTEN AUS ALLER WELT';

  const allTickerItems = [liveStat, ...TICKER_ITEMS];

  return (
    <header className="sticky top-0 z-50">
      {/* LIVE Ticker */}
      <div className="bg-[#1A1A2E] overflow-hidden" style={{ height: '36px' }}>
        <div className="flex items-center h-full">
          <div className="shrink-0 bg-red-500 text-white text-xs font-black uppercase tracking-widest px-4 h-full flex items-center gap-2 whitespace-nowrap">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse inline-block" />
            LIVE
          </div>
          <div className="overflow-hidden flex-1 relative h-full flex items-center pl-4">
            <div className="animate-ticker whitespace-nowrap text-xs font-semibold text-[#FFB800]">
              {[...allTickerItems, ...allTickerItems].map((item, i) => (
                <span key={i} className="shrink-0 mr-14">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-[#FFF8E1] border-b-2 border-[#FFB800] shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Sun logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <SunLogo />
              <span className="text-2xl font-black tracking-tight text-[#1A1A2E]">
                Uplift<span className="text-[#F59E0B]">.news</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {EMOJI_CATEGORIES.map((cat) => (
                <a
                  key={cat.apiName}
                  href={cat.apiName === 'Alle' ? '/' : `/?category=${cat.apiName}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-[#1A1A2E] rounded-full hover:bg-[#FFB800]/40 transition-colors whitespace-nowrap"
                >
                  {cat.emoji} {cat.display}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-1.5 bg-[#FFB800] text-[#1A1A2E] font-black text-sm px-4 py-2 rounded-full hover:bg-[#F59E0B] transition-colors shadow-sm whitespace-nowrap">
                ⭐ Mein Glücks-Konto
              </button>
              <button
                className="lg:hidden p-2 text-[#1A1A2E]"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menü"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="lg:hidden py-3 border-t border-[#FFB800]/30 flex flex-wrap gap-2 pb-4">
              {EMOJI_CATEGORIES.map((cat) => (
                <a
                  key={cat.apiName}
                  href={cat.apiName === 'Alle' ? '/' : `/?category=${cat.apiName}`}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-bold bg-white text-[#1A1A2E] rounded-full hover:bg-[#FFB800] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.emoji} {cat.display}
                </a>
              ))}
              <button className="flex items-center gap-1.5 bg-[#FFB800] text-[#1A1A2E] font-black text-sm px-4 py-2 rounded-full">
                ⭐ Mein Glücks-Konto
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

function SunLogo() {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    return {
      x1: 18 + 10 * Math.cos(angle),
      y1: 18 + 10 * Math.sin(angle),
      x2: 18 + 16 * Math.cos(angle),
      y2: 18 + 16 * Math.sin(angle),
    };
  });

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="8" fill="#FFB800" />
      {rays.map((r, i) => (
        <line
          key={i}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke="#FFB800"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
