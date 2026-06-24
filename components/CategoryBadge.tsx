import { cn } from '@/lib/utils';
import type { CaptureCategory } from '@/types';

const CATEGORY_CONFIG: Record<CaptureCategory, { label: string; color: string; dot: string }> = {
  financial: {
    label: 'Financeiro',
    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  tasks: {
    label: 'Tarefas',
    color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400',
  },
  messages: {
    label: 'Mensagens',
    color: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    dot: 'bg-violet-400',
  },
  documents: {
    label: 'Documentos',
    color: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    dot: 'bg-orange-400',
  },
  code: {
    label: 'Código',
    color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    dot: 'bg-cyan-400',
  },
  links: {
    label: 'Links',
    color: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    dot: 'bg-pink-400',
  },
  dates: {
    label: 'Datas',
    color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  others: {
    label: 'Outros',
    color: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
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