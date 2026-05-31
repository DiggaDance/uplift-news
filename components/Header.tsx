'use client';

import Link from 'next/link';
import { useState, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SearchOverlay from './SearchOverlay';
import { CATEGORIES } from '@/lib/categories';

function IconSearch() {
  return (
    <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function TopBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const navItems = [
    { href: '/', label: 'Startseite', active: pathname === '/' && !activeCategory },
    ...CATEGORIES.slice(0, 4).map(c => ({
      href: `/?category=${c.id}`,
      label: c.label,
      active: pathname === '/' && activeCategory === c.id,
    })),
  ];

  return (
    <>
      <header className="topbar">
        <div className="wide-container topbar-row">
          <Link href="/" className="brand">
            <span className="dot" />uplift<span className="tag">gute nachrichten</span>
          </Link>
          <nav className="nav">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                data-active={item.active ? 'true' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="topbar-actions">
            <span className="mood-pill" title="Stimmung heute">
              <span className="dot" /> Heute: hell
            </span>
            <button className="icon-btn" onClick={() => setSearchOpen(true)} title="Suchen">
              <IconSearch />
            </button>
            <Link href="/newsletter" className="btn-primary">
              Newsletter
            </Link>
          </div>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="topbar">
        <div className="wide-container topbar-row">
          <span className="brand">
            <span className="dot" />uplift<span className="tag">gute nachrichten</span>
          </span>
        </div>
      </header>
    }>
      <TopBarInner />
    </Suspense>
  );
}
