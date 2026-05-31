import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wide-container">
        <div className="footer-row">
          <div style={{ maxWidth: 320 }}>
            <div className="brand" style={{ marginBottom: 12, fontSize: 24 }}>
              <span className="dot" />uplift
            </div>
            <p style={{ margin: 0, lineHeight: 1.55 }}>
              Eine Redaktion, die jeden Tag gute Nachrichten findet. Damit du es nicht musst.
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <strong>Themen</strong>
              {CATEGORIES.map(c => (
                <Link key={c.id} href={`/?category=${c.id}`}>{c.label}</Link>
              ))}
            </div>
            <div className="footer-col">
              <strong>Redaktion</strong>
              <a href="#">Über uns</a>
              <a href="#">Manifest</a>
              <a href="#">Kontakt</a>
            </div>
            <div className="footer-col">
              <strong>Mehr</strong>
              <Link href="/newsletter">Newsletter</Link>
              <a href="/api/fetch-news">Feed aktualisieren</a>
              <a href="/impressum">Impressum</a>
              <a href="/datenschutz">Datenschutz</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} uplift · Täglich kuratiert</span>
          <span>Weil gute Nachrichten wichtig sind.</span>
        </div>
      </div>
    </footer>
  );
}
