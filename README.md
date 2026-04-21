# ☀️ Uplift.news

Eine vollständige positive Nachrichten-Website gebaut mit Next.js, Tailwind CSS, SQLite und der Claude AI API.

## Features

- **Automatischer RSS-Abruf** aus 12 internationalen Quellen alle 3 Stunden
- **KI-Kuratierung** mit Claude: nur positive, konstruktive Artikel werden veröffentlicht
- **Automatische Übersetzung & Umschreibung** auf Deutsch mit emotionalen Überschriften
- **Unsplash-Bilder** werden automatisch zum Thema geladen
- **Duplikat-Prüfung** über URL-Abgleich in SQLite
- **Kategorie-Filter** ohne Seitenreload
- **Newsletter-Anmeldung** (Adressen werden in SQLite gespeichert)
- **Mobiloptimiert** (Mobile First)

---

## Schritt-für-Schritt: Lokaler Start

### 1. Voraussetzungen

- Node.js 18+ installiert
- npm 9+

### 2. Abhängigkeiten installieren

```bash
cd my-app
npm install
```

### 3. API-Keys besorgen

#### Anthropic API Key (Claude)

1. Gehe zu [console.anthropic.com](https://console.anthropic.com)
2. Registrieren / Einloggen
3. Linkes Menü → **API Keys** → **Create Key**
4. Key kopieren

> **Kosten:** Die Claude API ist kostenpflichtig. Bei moderatem Einsatz (3-stündliche Abrufe, ~50 neue Artikel/Tag) ca. 1–3 USD/Tag. Überprüfe die aktuellen Preise unter [anthropic.com/pricing](https://anthropic.com/pricing).

#### Unsplash Access Key

1. Gehe zu [unsplash.com/developers](https://unsplash.com/developers)
2. **Your apps** → **New Application**
3. Nutzungsbedingungen akzeptieren, App-Name und Beschreibung eintragen
4. Unter **Keys** den **Access Key** kopieren

> **Kosten:** Kostenlos bis 50 Anfragen/Stunde (Demo-Modus). Für mehr Anfragen ist eine Produktionsgenehmigung nötig.

### 4. Umgebungsvariablen einrichten

```bash
cp .env.example .env.local
```

Öffne `.env.local` und trage deine Keys ein:

```
ANTHROPIC_API_KEY=sk-ant-...
UNSPLASH_ACCESS_KEY=...
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Die Website ist nun unter [http://localhost:3000](http://localhost:3000) erreichbar.

### 6. Ersten Nachrichten-Abruf starten

Öffne im Browser: [http://localhost:3000/api/fetch-news](http://localhost:3000/api/fetch-news)

Oder via Terminal:

```bash
curl http://localhost:3000/api/fetch-news
```

Die Konsole zeigt dir jeden Schritt: welcher Feed abgerufen wird, welche Artikel positiv sind, und was gespeichert wird.

---

## Projektstruktur

```
my-app/
├── app/
│   ├── api/
│   │   ├── fetch-news/route.ts   # Manueller Trigger + Cron-Endpunkt
│   │   ├── articles/route.ts     # Artikel-API mit Kategorie-Filter
│   │   ├── stats/route.ts        # Tages-Statistiken
│   │   └── newsletter/route.ts   # Newsletter-Anmeldung
│   ├── artikel/[id]/page.tsx     # Artikel-Detailseite
│   └── page.tsx                  # Startseite
├── components/
│   ├── Header.tsx                # Sticky Header mit Navigation
│   ├── HeroSection.tsx           # "Nachricht des Tages"
│   ├── NewsPage.tsx              # Interaktives Grid mit Filter
│   ├── ArticleCard.tsx           # Artikel-Karte
│   ├── CategoryBadge.tsx         # Kategorie-Labels
│   ├── Sidebar.tsx               # Newsletter + Affiliate + Stats
│   └── Footer.tsx
├── lib/
│   ├── db.ts                     # SQLite-Datenbankverbindung
│   ├── rss.ts                    # RSS-Feed-Abruf
│   ├── ai.ts                     # Claude API Integration
│   ├── images.ts                 # Unsplash API
│   └── processor.ts              # Haupt-Pipeline
├── instrumentation.ts            # Cron-Job Registrierung
├── data/uplift.db                # SQLite-Datenbank (auto-erstellt)
└── .env.local                    # Deine API-Keys (nicht in Git!)
```

---

## Affiliate-Links einrichten

In `components/Sidebar.tsx` findest du einen Bereich mit dem Kommentar:

```
{/* ↑ AFFILIATE LINKS: Ersetze die Platzhalter oben mit echten Links */}
```

Ersetze die drei Platzhalter-Divs durch echte Links, z.B.:

```tsx
<a href="https://dein-affiliate-link.de" target="_blank" rel="noopener noreferrer sponsored"
   className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-amber-50 transition-colors">
  <span className="text-2xl">🌱</span>
  <div>
    <p className="text-sm font-medium text-stone-700">Produktname</p>
    <p className="text-xs text-stone-400">Kurze Beschreibung</p>
  </div>
</a>
```

---

## Deployment auf einem VPS / Root-Server

SQLite läuft am besten auf einem persistenten Server (VPS, Root-Server):

```bash
# Auf dem Server:
git clone <dein-repo>
cd my-app
npm install
npm run build
npm start
```

Empfehlung: PM2 für dauerhaften Betrieb:

```bash
npm install -g pm2
pm2 start npm --name "uplift-news" -- start
pm2 save
pm2 startup
```

### Reverse Proxy mit Nginx

```nginx
server {
    listen 80;
    server_name deine-domain.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Deployment auf Vercel

> ⚠️ **Wichtig:** SQLite funktioniert auf Vercel nicht, da das Dateisystem ephemer ist. Für Vercel-Deployment empfiehlt sich:
> - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (mit `pg`-Adapter)
> - [Turso](https://turso.tech) (SQLite-kompatibel, Vercel-freundlich)

Für einen VPS oder lokalen Betrieb funktioniert SQLite problemlos.

---

## Umgebungsvariablen-Übersicht

| Variable | Pflicht | Beschreibung |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Ja | Claude API Key von console.anthropic.com |
| `UNSPLASH_ACCESS_KEY` | Empfohlen | Unsplash Access Key für Bilder |
| `NEXT_PUBLIC_BASE_URL` | Optional | Basis-URL der Website |

---

## Lizenz

MIT – Viel Spaß mit Uplift.news! ☀️
