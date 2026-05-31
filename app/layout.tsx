import type { Metadata } from 'next';
import { Newsreader, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'uplift — gute nachrichten',
  description:
    'Täglich neue positive, konstruktive und hoffnungsvolle Nachrichten aus Wissenschaft, Natur, Gesellschaft und mehr. Uplift — weil gute Nachrichten wichtig sind.',
  keywords: 'positive Nachrichten, gute Nachrichten, Wissenschaft, Natur, Hoffnung, Uplift',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${newsreader.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
