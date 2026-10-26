import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Analytics from '@/components/Analytics';
import './globals.css';

const fraunces = localFont({
  src: './fonts/Fraunces-Variable.woff2',
  weight: '300 900',
  variable: '--font-fraunces',
  display: 'swap',
});

const manrope = localFont({
  src: './fonts/Manrope-Variable.woff2',
  weight: '300 800',
  variable: '--font-manrope',
  display: 'swap',
});

const siteUrl = 'https://skedaddle.example.com'; // TODO: replace with the real production domain

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Skedaddle — Real people. Real places. Real belonging.',
    template: '%s | Skedaddle',
  },
  description:
    'Skedaddle is an AI coordination engine that moves people from strangers to shared real-world experiences — in days, not months.',
  openGraph: {
    type: 'website',
    siteName: 'Skedaddle',
    title: 'Skedaddle — Real people. Real places. Real belonging.',
    description:
      'Skedaddle is an AI coordination engine that moves people from strangers to shared real-world experiences — in days, not months.',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skedaddle — Real people. Real places. Real belonging.',
    description:
      'Skedaddle is an AI coordination engine that moves people from strangers to shared real-world experiences — in days, not months.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
