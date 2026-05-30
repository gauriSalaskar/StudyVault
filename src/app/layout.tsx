import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'StudyVault — Learn. Share. Earn.',
  description: 'The decentralized AI-powered notes sharing platform for students. Upload notes, earn SVT tokens, and trade knowledge as NFTs.',
  keywords: ['notes', 'AI', 'blockchain', 'NFT', 'education', 'crypto', 'Web3'],
  openGraph: {
    title: 'StudyVault — Learn. Share. Earn.',
    description: 'The decentralized AI-powered notes sharing platform for students.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
