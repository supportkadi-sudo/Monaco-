import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600']
});

const sans = Manrope({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-sans'
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Monaco Aquapark — крытый аквапарк в Ташкенте',
  description: 'Monaco Aquapark в Ташкенте: бассейны, детские зоны, SPA, хаммам, сауна и бронирование посещения.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Monaco Aquapark — Ташкент',
    description: 'Крытый аквапарк в Ташкенте. Оставьте заявку на посещение.',
    url: '/',
    siteName: 'Monaco Aquapark',
    locale: 'ru_RU',
    type: 'website',
    images: ['/images/monaco/hero.webp']
  },
  icons: { icon: '/favicon.svg' }
};

export const viewport: Viewport = {
  themeColor: '#faf9f6',
  colorScheme: 'light'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <meta name="color-scheme" content="light only" />
      </head>
      <body>{children}</body>
    </html>
  );
}
