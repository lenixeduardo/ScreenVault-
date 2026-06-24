'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Capture } from '@/types';
import { cn } from '@/lib/utils';

interface CaptureActionsProps {
  capture: Capture;
}

export function CaptureActions({ capture }: CaptureActionsProps) {
  const [isImportant, setIsImportant] = useState(capture.is_important);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const toggleImportant = async () => {
    const next = !isImportant;
    setIsImportant(next);
    try {
      const res = await fetch(`/api/captures/${capture.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_important: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(next ? 'Marcada como importante' : 'Removida dos importantes');
    } catch {
      setIsImportant(!next);
      toast.error('Erro ao atualizar captura');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta captura?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/captures/${capture.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Captura excluída');
      router.push('/dashboard');
    } catch {
      toast.error('Erro ao excluir captura');
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={toggleImportant}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200',
          isImportant
            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 hover:bg-yellow-500/30'
            : 'border-border text-text-secondary hover:border-yellow-500/40 hover:text-yellow-400'
        )}
      >
        <Star className={cn('w-4 h-4', isImportant && 'fill-yellow-400')} />
        {isImportant ? 'Importante' : 'Marcar importante'}
      </button>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-text-muted hover:border-danger/40 hover:text-danger transition-all duration-200 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
        {deleting ? 'Excluindo...' : 'Excluir'}
      </button>
    </div>
  );
}