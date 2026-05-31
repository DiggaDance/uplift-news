'use client';

import { useState, useEffect } from 'react';

interface Props {
  articleId: number;
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21s-7-4.5-9.3-9.2C1.2 8.4 3.4 5 6.8 5c1.8 0 3.4.9 4.4 2.4l.8 1.1.8-1.1C13.8 5.9 15.4 5 17.2 5c3.4 0 5.6 3.4 4.1 6.8C19 16.5 12 21 12 21z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
  );
}

type ReactionStore = Record<string, { heart?: boolean; sun?: boolean }>;

export default function Reactions({ articleId }: Props) {
  const key = String(articleId);
  const [store, setStore] = useState<ReactionStore>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem('uplift:reactions');
      if (raw) setStore(JSON.parse(raw) as ReactionStore);
    } catch { /* ignore */ }
  }, []);

  const my = store[key] ?? {};

  const toggle = (kind: 'heart' | 'sun') => {
    setStore(prev => {
      const next = { ...prev, [key]: { ...prev[key], [kind]: !prev[key]?.[kind] } };
      try { localStorage.setItem('uplift:reactions', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <div className="reactions">
      <button
        className="react-btn"
        data-active={my.heart ? 'true' : undefined}
        onClick={e => { e.preventDefault(); e.stopPropagation(); toggle('heart'); }}
        title="Bewegt mich"
      >
        <IconHeart /> {my.heart ? '1' : '0'}
      </button>
      <button
        className="react-btn"
        data-active={my.sun ? 'true' : undefined}
        onClick={e => { e.preventDefault(); e.stopPropagation(); toggle('sun'); }}
        title="Macht meinen Tag"
      >
        <IconSun /> {my.sun ? '1' : '0'}
      </button>
    </div>
  );
}
