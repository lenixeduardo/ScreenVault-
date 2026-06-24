import Link from 'next/link';
import { LayoutDashboard, TrendingUp, CheckSquare, MessageSquare, FileText, Code2, Link as LinkIcon, Calendar, MoreHorizontal } from 'lucide-react';
import { CaptureButton } from '@/components/CaptureButton';
import { CaptureCard } from '@/components/CaptureCard';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { Capture } from '@/types';

async function getRecentCaptures(): Promise<Capture[]> {
  try {
    const { data } = await supabaseAdmin
      .from('captures')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);
    return (data ?? []) as Capture[];
  } catch {
    return [];
  }
}

const CATEGORY_SHORTCUTS = [
  { href: '/dashboard?category=financial', icon: TrendingUp, label: 'Financeiro', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { href: '/dashboard?category=tasks', icon: CheckSquare, label: 'Tarefas', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { href: '/dashboard?category=messages', icon: MessageSquare, label: 'Mensagens', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  { href: '/dashboard?category=documents', icon: FileText, label: 'Documentos', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { href: '/dashboard?category=code', icon: Code2, label: 'Código', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { href: '/dashboard?category=links', icon: LinkIcon, label: 'Links', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  { href: '/dashboard?category=dates', icon: Calendar, label: 'Datas', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { href: '/dashboard?category=others', icon: MoreHorizontal, label: 'Outros', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
];

export default async function HomePage() {
  const recentCaptures = await getRecentCaptures();

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4">
        <header className="pt-14 pb-8">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-text-muted text-sm">Bem-vindo ao</p>
              <h1 className="text-2xl font-bold text-text-primary">
                Screen<span className="gradient-text">Vault</span> AI
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-text-secondary text-sm hover:border-border-active hover:text-primary transition-all duration-200"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </header>

        <section className="flex flex-col items-center py-8 mb-8">
          <p className="text-text-secondary text-sm mb-8 text-center">
            Capture uma tela e deixe a IA extrair e organizar as informações
          </p>
          <CaptureButton />
        </section>

        <section className="mb-8">
          <h2 className="text-text-primary font-semibold text-sm mb-3">Categorias rápidas</h2>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORY_SHORTCUTS.map(({ href, icon: Icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 hover:scale-105 ${color}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {recentCaptures.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-text-primary font-semibold text-sm">Capturas recentes</h2>
              <Link href="/dashboard" className="text-primary text-xs hover:underline">Ver todas</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {recentCaptures.map((capture) => (
                <CaptureCard key={capture.id} capture={capture} />
              ))}
            </div>
          </section>
        )}

        {recentCaptures.length === 0 && (
          <div className="text-center py-10 text-text-muted">
            <p className="text-sm">Nenhuma captura ainda.</p>
            <p className="text-xs mt-1">Use o botão acima para começar!</p>
          </div>
        )}
      </div>
    </main>
  );
}