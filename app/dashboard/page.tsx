import Link from 'next/link';
import { Camera, LayoutGrid } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { CaptureCard } from '@/components/CaptureCard';
import { FilterBar } from '@/components/FilterBar';
import type { Capture, CaptureCategory } from '@/types';
import { Suspense } from 'react';

interface DashboardPageProps {
  searchParams: {
    category?: string;
    important?: string;
  };
}

async function getCaptures(searchParams: DashboardPageProps['searchParams']): Promise<Capture[]> {
  try {
    let query = supabaseAdmin
      .from('captures')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (searchParams.category && searchParams.category !== 'all') {
      query = query.eq('category', searchParams.category as CaptureCategory);
    }
    if (searchParams.important === 'true') {
      query = query.eq('is_important', true);
    }

    const { data } = await query;
    return (data ?? []) as Capture[];
  } catch {
    return [];
  }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const captures = await getCaptures(searchParams);
  const activeCategory = searchParams.category ?? 'all';
  const isImportant = searchParams.important === 'true';

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <header className="pt-14 pb-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
            <Link
              href="/home"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl gradient-brand text-white text-sm font-medium shadow-glow-orange hover:opacity-90 transition-opacity"
            >
              <Camera className="w-4 h-4" />
              Capturar
            </Link>
          </div>
          <p className="text-text-muted text-sm">
            {captures.length} {captures.length === 1 ? 'captura' : 'capturas'}
            {activeCategory !== 'all' ? ` em ${activeCategory}` : ''}
            {isImportant ? ' marcadas como importantes' : ''}
          </p>
        </header>

        {/* Filters */}
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>

        {/* Grid */}
        {captures.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 mt-6">
            {captures.map((capture) => (
              <CaptureCard key={capture.id} capture={capture} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
              <LayoutGrid className="w-7 h-7 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium">Nenhuma captura encontrada</p>
            <p className="text-text-muted text-sm mt-1">
              {activeCategory !== 'all' || isImportant
                ? 'Tente remover os filtros'
                : 'Capture sua primeira tela!'}
            </p>
            <Link href="/home" className="btn-primary mt-6">
              <Camera className="w-4 h-4" />
              Nova captura
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
