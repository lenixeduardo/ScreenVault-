'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { CaptureCard } from '@/components/CaptureCard';
import type { Capture, CaptureCategory } from '@/types';
import { cn } from '@/lib/utils';

const CATEGORIES: { value: CaptureCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'tasks', label: 'Tarefas' },
  { value: 'messages', label: 'Mensagens' },
  { value: 'documents', label: 'Documentos' },
  { value: 'code', label: 'Código' },
  { value: 'links', label: 'Links' },
  { value: 'dates', label: 'Datas' },
  { value: 'others', label: 'Outros' },
];

export default function SearchPage() {
  const [results, setResults] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [category, setCategory] = useState<CaptureCategory | 'all'>('all');
  const [important, setImportant] = useState(false);

  const doSearch = useCallback(async (query: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('search', query);
      if (category !== 'all') params.set('category', category);
      if (important) params.set('important', 'true');
      const res = await fetch(`/api/captures?${params.toString()}`);
      const json = await res.json();
      setResults(json.data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [category, important]);

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4">
        <header className="pt-14 pb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Buscar</h1>
          <p className="text-text-muted text-sm">Encontre capturas por texto, categoria ou tipo</p>
        </header>

        <SearchBar onSearch={doSearch} placeholder="Buscar por texto extraído, título..." loading={loading} />

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-text-muted" />
            <span className="text-text-muted text-sm">Filtros</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setCategory(value); doSearch(''); }}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
                  category === value ? 'bg-primary text-white border-primary' : 'bg-card text-text-secondary border-border hover:border-border-active'
                )}
              >{label}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => { setImportant(!important); doSearch(''); }}
              className={cn('w-10 h-5 rounded-full transition-colors relative cursor-pointer', important ? 'bg-primary' : 'bg-surface border border-border')}
            >
              <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform', important ? 'translate-x-5' : 'translate-x-0.5')} />
            </div>
            <span className="text-text-secondary text-sm">Apenas importantes</span>
          </label>
        </div>

        <div className="mt-6">
          {loading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-2" />
              <p className="text-text-muted text-sm">Buscando...</p>
            </div>
          )}
          {!loading && searched && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">Nenhum resultado encontrado</p>
              <p className="text-text-muted text-sm mt-1">Tente termos diferentes ou remova os filtros</p>
            </div>
          )}
          {!loading && results.length > 0 && (
            <>
              <p className="text-text-muted text-xs mb-4">{results.length} resultado{results.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-2 gap-3">
                {results.map((capture) => <CaptureCard key={capture.id} capture={capture} />)}
              </div>
            </>
          )}
          {!searched && (
            <div className="text-center py-12 text-text-muted">
              <p className="text-sm">Digite algo para buscar</p>
              <p className="text-xs mt-1">Ou use os filtros acima para navegar</p>
              <Link href="/dashboard" className="text-primary text-sm mt-4 inline-block hover:underline">Ver todas as capturas →</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}