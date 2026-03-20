import { useState } from 'react';
import type { TimesheetData, TimesheetRow } from '@/types/timesheet';
import { formatPeriodLabel } from '@/components/PeriodSelector/PeriodSelector';

export function generateFilename(data: TimesheetData): string {
  const client =
    data.clientName.trim().toLowerCase().replace(/\s+/g, '_') || 'client';

  const period = formatPeriodLabel(data.mode, data.periodStart, data.periodEnd)
    .toLowerCase()
    .replace(/[–—]/g, '-')        // em-dash → hyphen
    .replace(/[^a-z0-9-]/g, '_') // everything else → underscore
    .replace(/_+/g, '_')          // collapse runs
    .replace(/^_|_$/g, '')        // trim edges
    || 'period';

  return `timesheet_${client}_${period}.pdf`;
}

export function useExportPDF(data: TimesheetData, rows: TimesheetRow[]) {
  const [isExporting, setIsExporting] = useState(false);

  async function exportPDF() {
    setIsExporting(true);
    try {
      const totalHours = rows.reduce((sum, r) => sum + (r.hoursWorked ?? 0), 0);
      const totalAmount = totalHours * data.hourlyRate;

      // Dynamic imports keep @react-pdf/renderer out of the SSR bundle entirely.
      // vi.mock() in tests intercepts these the same as static imports.
      const [{ pdf }, { default: TimesheetPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/TimesheetPDF/TimesheetPDF'),
      ]);

      const blob = await pdf(
        <TimesheetPDF
          data={data}
          rows={rows}
          totalHours={totalHours}
          totalAmount={totalAmount}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateFilename(data);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  return { exportPDF, isExporting };
}
