import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ScreenVault AI',
  description: 'Capture. Extraia. Organize. — Sua central inteligente de capturas de tela.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0B0E1A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-background text-text-primary antialiased`}>
        {children}
        <Navbar />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1A1D2E',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F1F5F9',
            },
          }}
        />
      </body>
    </html>
  );
}