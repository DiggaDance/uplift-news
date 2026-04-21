'use client';

import Link from 'next/link';
import { useState } from 'react';

const CATEGORIES = ['Alle', 'Wissenschaft', 'Natur', 'Menschen', 'Wirtschaft', 'Gesundheit', 'Tiere'];

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

  return (
    <header className="sticky top-0 z-50">
      {/* Ticker */}
      <div className="bg-[#FFB800] overflow-hidden" style={{ height: '34px' }}>
        <div className="flex items-center h-full">
          <div className="shrink-0 bg-[#1A1A2E] text-[#FFB800] text-xs font-black uppercase tracking-wide px-4 h-full flex items-center whitespace-nowrap">
            Gute Nachrichten
          </div>
          <div className="overflow-hidden flex-1 relative h-full flex items-center pl-4">
            <div className="animate-ticker whitespace-nowrap gap-12 text-sm font-semibold text-[#1A1A2E]">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className="shrink-0 mr-12">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b-4 border-[#FFB800] shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl leading-none">☀️</span>
              <span className="text-2xl font-black tracking-tight text-[#1A1A2E]">
                Uplift<span className="text-[#FFB800]">.news</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={`/?category=${cat}`}
                  className="px-3 py-4 text-sm font-bold text-[#1A1A2E] hover:text-[#FFB800] hover:bg-[#1A1A2E] transition-colors whitespace-nowrap"
                >
                  {cat}
                </a>
              ))}
            </nav>

            <button
              className="md:hidden p-2 text-[#1A1A2E]"
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

          {menuOpen && (
            <nav className="md:hidden py-3 border-t border-stone-100 flex flex-wrap gap-2 pb-4">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={`/?category=${cat}`}
                  className="px-4 py-2 text-sm font-bold bg-[#F7F7F2] text-[#1A1A2E] rounded hover:bg-[#FFB800] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
