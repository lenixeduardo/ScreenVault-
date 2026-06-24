'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Search, Settings, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/home#capture', icon: Camera, label: 'Capturar', primary: true },
  { href: '/search', icon: Search, label: 'Buscar' },
  { href: '/settings', icon: Settings, label: 'Config' },
];

export function Navbar() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border safe-area-pb">
      <div className="max-w-lg mx-auto px-2 py-2 flex items-center justify-around">
        {NAV_ITEMS.map(({ href, icon: Icon, label, primary }) => {
          const isActive = pathname === href || pathname.startsWith(href.replace('#capture', ''));

          if (primary) {
            return (
              <Link
                key={href}
                href="/home"
                className="flex flex-col items-center justify-center w-12 h-12 rounded-full gradient-brand shadow-glow-blue -translate-y-2"
              >
                <Icon className="w-5 h-5 text-white" />
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200',
                isActive ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}