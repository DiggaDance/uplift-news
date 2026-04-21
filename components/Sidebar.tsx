'use client';

import { useState, useEffect } from 'react';

interface Stats {
  todayCount: number;
  totalCount: number;
  sourcesCount: number;
}

export default function Sidebar() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => null);
  }, []);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setStatus('success');
        setMessage(data.message ?? 'Erfolgreich angemeldet!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Fehler aufgetreten.');
      }
    } catch {
      setStatus('error');
      setMessage('Verbindungsfehler. Bitte versuche es erneut.');
    }
  }

  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-4">
      {/* Newsletter */}
      <div className="bg-[#1A1A2E] p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#FFB800] text-[#1A1A2E] text-xs font-black px-2 py-0.5 uppercase tracking-wide">
            Newsletter
          </span>
        </div>
        <h3 className="font-black text-xl mt-3 mb-1 leading-tight">Täglich Uplift</h3>
        <p className="text-stone-400 text-sm mb-4 leading-relaxed">
          Die besten positiven Nachrichten — direkt in dein Postfach. Kostenlos.
        </p>
        {status === 'success' ? (
          <p className="bg-[#3DAA5C]/20 border border-[#3DAA5C] text-[#3DAA5C] rounded p-3 text-sm font-medium">
            ✓ {message}
          </p>
        ) : (
          <form onSubmit={handleNewsletter} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              className="w-full px-3 py-2.5 bg-white/10 border border-white/20 text-white text-sm placeholder:text-stone-500 focus:outline-none focus:border-[#FFB800] rounded"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#FFB800] text-[#1A1A2E] font-black py-2.5 text-sm hover:bg-[#e6a600] transition-colors disabled:opacity-60 rounded"
            >
              {status === 'loading' ? 'Anmelden…' : 'Jetzt anmelden ✨'}
            </button>
            {status === 'error' && <p className="text-red-400 text-xs">{message}</p>}
          </form>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="bg-white shadow-sm">
          <div className="bg-[#3DAA5C] px-4 py-2">
            <h3 className="font-black text-white text-sm uppercase tracking-wide">📊 Heute bei Uplift.news</h3>
          </div>
          <div className="p-4 space-y-0 divide-y divide-stone-100">
            <div className="flex justify-between items-center py-3">
              <span className="text-stone-600 text-sm">Neue Artikel heute</span>
              <span className="font-black text-[#FFB800] text-2xl">{stats.todayCount}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-stone-600 text-sm">Artikel gesamt</span>
              <span className="font-black text-[#1A1A2E] text-xl">{stats.totalCount}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-stone-600 text-sm">Nachrichtenquellen</span>
              <span className="font-black text-[#1A1A2E] text-xl">{stats.sourcesCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Empfehlungen */}
      <div className="bg-white shadow-sm">
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-2">
          <p className="text-xs font-black text-stone-500 uppercase tracking-widest">Empfehlungen</p>
        </div>
        <div className="divide-y divide-stone-100">
          <div className="flex items-center gap-3 p-4 hover:bg-[#F7F7F2] transition-colors cursor-pointer">
            <span className="text-2xl shrink-0">🌱</span>
            <div>
              <p className="text-sm font-bold text-[#1A1A2E]">Affiliate-Link 1</p>
              <p className="text-xs text-stone-400">Beschreibung eintragen</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 hover:bg-[#F7F7F2] transition-colors cursor-pointer">
            <span className="text-2xl shrink-0">📚</span>
            <div>
              <p className="text-sm font-bold text-[#1A1A2E]">Affiliate-Link 2</p>
              <p className="text-xs text-stone-400">Beschreibung eintragen</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 hover:bg-[#F7F7F2] transition-colors cursor-pointer">
            <span className="text-2xl shrink-0">🛍️</span>
            <div>
              <p className="text-sm font-bold text-[#1A1A2E]">Affiliate-Link 3</p>
              <p className="text-xs text-stone-400">Beschreibung eintragen</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
