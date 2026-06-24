import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'ScreenVault AI',
  description: 'Capture. Extraia. Organize. — Sua central inteligente de capturas de tela.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#F97316',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.className} bg-background text-text-primary antialiased`}>
        {children}
        <Navbar />
        <Toaster
          theme="light"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.08)',
              color: '#0F172A',
            },
          }}
        />
      </body>
    </html>
  );
}
