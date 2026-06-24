import { cn } from '@/lib/utils';
import type { CaptureCategory } from '@/types';

const CATEGORY_CONFIG: Record<CaptureCategory, { label: string; color: string; dot: string }> = {
  financial: {
    label: 'Financeiro',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  tasks: {
    label: 'Tarefas',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  messages: {
    label: 'Mensagens',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
  },
  documents: {
    label: 'Documentos',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
  },
  code: {
    label: 'Código',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    dot: 'bg-cyan-500',
  },
  links: {
    label: 'Links',
    color: 'bg-pink-50 text-pink-700 border-pink-200',
    dot: 'bg-pink-500',
  },
  dates: {
    label: 'Datas',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-500',
  },
  others: {
    label: 'Outros',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
};

interface CategoryBadgeProps {
  category: CaptureCategory;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export function CategoryBadge({
  category,
  size = 'sm',
  showDot = true,
  className,
}: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.others;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.color,
        className
      )}
    >
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />}
      {config.label}
    </span>
  );
}

export { CATEGORY_CONFIG };
