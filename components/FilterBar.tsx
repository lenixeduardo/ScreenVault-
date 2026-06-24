'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Star, X } from 'lucide-react';
import { CATEGORY_CONFIG } from './CategoryBadge';
import type { CaptureCategory } from '@/types';
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

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') ?? 'all';
  const currentImportant = searchParams.get('important') === 'true';

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('?');
  };

  const hasActiveFilters = currentCategory !== 'all' || currentImportant;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map(({ value, label }) => {
          const isActive = currentCategory === value || (value === 'all' && currentCategory === 'all');
          const config = value !== 'all' ? CATEGORY_CONFIG[value as CaptureCategory] : null;

          return (
            <button
              key={value}
              onClick={() => updateFilter('category', value)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
                isActive
                  ? 'bg-primary text-white border-primary shadow-glow-orange'
                  : 'bg-card text-text-secondary border-border hover:border-border-active hover:text-primary'
              )}
            >
              {config && (
                <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
              )}
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateFilter('important', currentImportant ? null : 'true')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
            currentImportant
              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
              : 'bg-card text-text-secondary border-border hover:border-yellow-200 hover:text-yellow-700'
          )}
        >
          <Star className={cn('w-3.5 h-3.5', currentImportant && 'fill-yellow-600')} />
          Importantes
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-text-muted border border-border hover:border-danger/40 hover:text-danger transition-all duration-200"
          >
            <X className="w-3 h-3" />
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
