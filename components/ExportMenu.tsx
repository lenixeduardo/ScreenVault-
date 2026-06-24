'use client';

import { useState } from 'react';
import { Download, FileText, Table, FileCode, ChevronDown } from 'lucide-react';
import type { Capture } from '@/types';
import { downloadMarkdown, downloadCSV, exportAsPDF } from '@/lib/export';
import { cn } from '@/lib/utils';

interface ExportMenuProps {
  capture: Capture;
  pdfElementId?: string;
}

export function ExportMenu({ capture, pdfElementId }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (format: 'pdf' | 'markdown' | 'csv') => {
    setLoading(format);
    setOpen(false);
    try {
      if (format === 'pdf' && pdfElementId) {
        await exportAsPDF(pdfElementId, `screenvault-${capture.id}.pdf`);
      } else if (format === 'markdown') {
        downloadMarkdown(capture);
      } else if (format === 'csv') {
        downloadCSV([capture]);
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setLoading(null);
    }
  };

  const options = [
    ...(pdfElementId
      ? [{ key: 'pdf' as const, icon: FileText, label: 'Exportar como PDF' }]
      : []),
    { key: 'markdown' as const, icon: FileCode, label: 'Exportar como Markdown' },
    { key: 'csv' as const, icon: Table, label: 'Exportar como CSV' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-secondary text-sm font-medium hover:border-border-active hover:text-primary transition-all duration-200"
      >
        <Download className="w-4 h-4" />
        Exportar
        <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl overflow-hidden shadow-card z-20">
            {options.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => handleExport(key)}
                disabled={loading === key}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-surface hover:text-primary transition-colors text-left disabled:opacity-50"
              >
                <Icon className="w-4 h-4" />
                {loading === key ? 'Exportando...' : label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}