import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterBlock from '@/components/NewsletterBlock';

function IconBack() {
  return (
    <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

const FEATURES = [
  { emoji: '🌅', title: 'Täglich aktuell', desc: 'Frisch in deinem Postfach — bevor die Welt wieder laut wird.' },
  { emoji: '✦', title: 'Handverlesen', desc: 'Kuratiert aus dutzenden Quellen. Nur das Beste kommt durch.' },
  { emoji: '🤝', title: 'Kostenlos', desc: 'Immer. Für immer. Kein Abo, kein Trick.' },
  { emoji: '♡', title: 'Kein Tracking', desc: 'Deine Daten gehören dir. Punkt.' },
];

export default function NewsletterPage() {
  return (
    <>
      <Header />
      <div className="page">
        <div className="container" style={{ paddingTop: 64, maxWidth: 760 }}>
          <Link href="/" className="back-link">
            <IconBack /> zurück
          </Link>
          <div className="hero-meta" style={{ marginTop: 24 }}>
            <span className="pill">Newsletter</span>
            <span>kostenlos · jederzeit kündbar</span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 400,
              fontSize: 'clamp(38px, 5vw, 64px)',
              letterSpacing: '-0.025em',
              lineHeight: 1.04,
              margin: '0 0 20px',
            }}
          >
            Gute Nachrichten. Täglich. Per Mail.
          </h1>
          <p
            style={{
              fontSize: 19,
              color: 'var(--ink-soft)',
              lineHeight: 1.55,
              maxWidth: '52ch',
              margin: '0 0 40px',
            }}
          >
            Die besten positiven Nachrichten des Tages — handverlesen, direkt zu dir.
            Keine Reizüberflutung, keine Werbung, kein Drama.
          </p>

          <NewsletterBlock />

          <div className="divider" style={{ margin: '48px 0' }} />

          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 400,
              fontSize: 28,
              letterSpacing: '-0.02em',
              margin: '0 0 24px',
            }}
          >
            Was dich erwartet
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
              paddingBottom: 80,
            }}
          >
            {FEATURES.map(({ emoji, title, desc }) => (
              <div
                key={title}
                style={{
                  padding: 20,
                  background: 'var(--surface-2)',
                  borderRadius: 14,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{emoji}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
