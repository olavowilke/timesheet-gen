'use client';

import { Button } from '@mantine/core';
import { useExportPDF } from '@/hooks/useExportPDF';
import type { TimesheetData, TimesheetRow } from '@/types/timesheet';

interface ExportButtonProps {
  data: TimesheetData;
  rows: TimesheetRow[];
}

export default function ExportButton({ data, rows }: ExportButtonProps) {
  const { exportPDF, isExporting } = useExportPDF(data, rows);

  const isDisabled =
    !data.freelancerName.trim() || !data.clientName.trim() || !data.periodStart;

  return (
    <Button onClick={exportPDF} loading={isExporting} disabled={isDisabled}>
      Export PDF
    </Button>
  );
}
