import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { site } from '@/content';
import '@/styles/base.css';
import '@/styles/cursor.css';
import '@/styles/ink.css';
import '@/styles/hero.css';
import '@/styles/marquee.css';
import '@/styles/about.css';
import '@/styles/flip-cards.css';
import '@/styles/portfolio.css';
import '@/styles/process.css';
import '@/styles/testimonials.css';
import '@/styles/booking.css';
import '@/styles/faq.css';
import '@/styles/footer.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.artist }],
  keywords: ['tatuagem', 'tatuador', 'São Paulo', 'blackwork', 'fine line', 'realismo', 'tatuagem autoral', 'estúdio privado'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: '/',
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <noscript>
          <style>{'.rv{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
