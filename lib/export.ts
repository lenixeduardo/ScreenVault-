import type { Capture } from '@/types';

export async function exportAsPDF(elementId: string, filename: string): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');
  const { default: jsPDF } = await import('jspdf');

  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  const canvas = await html2canvas(element, {
    backgroundColor: '#FAFAFA',
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width / 2, canvas.height / 2],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(filename);
}

export function downloadMarkdown(capture: Capture): void {
  const md = [
    `# ${capture.title ?? 'Untitled Capture'}`,
    '',
    `> ${capture.summary ?? ''}`,
    '',
    `**Category:** ${capture.category}`,
    `**Tags:** ${(capture.tags ?? []).join(', ')}`,
    `**Captured:** ${new Date(capture.created_at).toLocaleString()}`,
    `**Important:** ${capture.is_important ? 'Yes' : 'No'}`,
    '',
    '## Extracted Text',
    '',
    capture.extracted_text ?? '_No text extracted_',
    '',
    ...(capture.metadata
      ? [
          '## Metadata',
          '',
          ...Object.entries(capture.metadata)
            .filter(([, v]) => Array.isArray(v) && (v as unknown[]).length > 0)
            .map(([k, v]) => `**${k}:** ${(v as string[]).join(', ')}`),
        ]
      : []),
  ].join('\n');

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `screenvault-${capture.id}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(captures: Capture[]): void {
  const headers = ['id', 'title', 'summary', 'category', 'tags', 'is_important', 'created_at'];
  const rows = captures.map((c) =>
    [
      c.id,
      c.title ?? '',
      c.summary ?? '',
      c.category,
      (c.tags ?? []).join('|'),
      c.is_important ? 'true' : 'false',
      c.created_at,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `screenvault-export.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
