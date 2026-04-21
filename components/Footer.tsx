export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-0 bg-[#1A1A2E] text-stone-400">
      {/* Yellow accent bar at top */}
      <div className="h-1 bg-[#FFB800]" />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">☀️</span>
              <span className="text-2xl font-black text-white">
                Uplift<span className="text-[#FFB800]">.news</span>
              </span>
            </div>
            <p className="text-sm max-w-xs leading-relaxed text-stone-400">
              Täglich kuratierte positive Nachrichten aus aller Welt — weil gute Dinge passieren,
              auch wenn man davon nichts hört.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3DAA5C] animate-pulse" />
              <span className="text-xs text-[#3DAA5C] font-semibold">Täglich aktualisiert</span>
            </div>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="text-[#FFB800] font-black mb-4 text-xs uppercase tracking-widest">Kategorien</h4>
              <ul className="space-y-2 text-sm">
                {['Wissenschaft', 'Natur', 'Menschen', 'Wirtschaft', 'Gesundheit', 'Tiere'].map((cat) => (
                  <li key={cat}>
                    <a href={`/?category=${cat}`} className="hover:text-[#FFB800] transition-colors">
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[#FFB800] font-black mb-4 text-xs uppercase tracking-widest">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/impressum" className="hover:text-[#FFB800] transition-colors">Impressum</a>
                </li>
                <li>
                  <a href="/datenschutz" className="hover:text-[#FFB800] transition-colors">Datenschutz</a>
                </li>
                <li>
                  <a href="/api/fetch-news" className="hover:text-[#FFB800] transition-colors">
                    Feed aktualisieren
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <span>© {year} Uplift.news – Positive Nachrichten, täglich kuratiert mit ❤️ und KI</span>
          <span className="text-[#3DAA5C] font-semibold">Weil gute Nachrichten wichtig sind.</span>
        </div>
      </div>
    </footer>
  );
}
