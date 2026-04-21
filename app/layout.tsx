import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Uplift.news – Positive Nachrichten aus aller Welt',
  description:
    'Täglich neue positive, konstruktive und hoffnungsvolle Nachrichten aus Wissenschaft, Natur, Gesellschaft und mehr. Uplift.news – weil gute Nachrichten wichtig sind.',
  keywords: 'positive Nachrichten, gute Nachrichten, Wissenschaft, Natur, Hoffnung, Uplift',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
