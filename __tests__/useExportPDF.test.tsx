import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { render, screen } from '../test-utils';
import { generateFilename, useExportPDF } from '@/hooks/useExportPDF';
import ExportButton from '@/components/ExportButton/ExportButton';
import { initialTimesheetData } from '@/types/timesheet';
import type { TimesheetData } from '@/types/timesheet';

// Mock @react-pdf/renderer so no actual PDF rendering happens in tests
vi.mock('@react-pdf/renderer', () => ({
  pdf: vi.fn(() => ({
    toBlob: vi.fn().mockResolvedValue(new Blob(['%PDF'], { type: 'application/pdf' })),
  })),
  Document: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Page: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  View: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Text: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  StyleSheet: { create: (s: unknown) => s },
}));

// ---- generateFilename ----

describe('generateFilename', () => {
  it('builds filename from client name and monthly period', () => {
    const data: TimesheetData = {
      ...initialTimesheetData,
      clientName: 'Acme Corp',
      mode: 'monthly',
      periodStart: new Date(2025, 2, 1),
      periodEnd: new Date(2025, 2, 31),
    };
    expect(generateFilename(data)).toBe('timesheet_acme_corp_march_2025.pdf');
  });

  it('builds filename from client name and weekly period', () => {
    const data: TimesheetData = {
      ...initialTimesheetData,
      clientName: 'John Doe',
      mode: 'weekly',
      periodStart: new Date(2025, 2, 10), // Mar 10
      periodEnd: new Date(2025, 2, 16),   // Mar 16
    };
    // "Mar 10–16, 2025" → "mar_10-16_2025"
    expect(generateFilename(data)).toBe('timesheet_john_doe_mar_10-16_2025.pdf');
  });

  it('falls back to "client" when clientName is empty', () => {
    const data: TimesheetData = {
      ...initialTimesheetData,
      clientName: '',
      mode: 'monthly',
      periodStart: new Date(2025, 0, 1),
      periodEnd: new Date(2025, 0, 31),
    };
    expect(generateFilename(data)).toMatch(/^timesheet_client_/);
  });
});

// ---- useExportPDF ----

describe('useExportPDF', () => {
  it('returns exportPDF function and isExporting boolean', () => {
    const { result } = renderHook(() => useExportPDF(initialTimesheetData, []));
    expect(typeof result.current.exportPDF).toBe('function');
    expect(result.current.isExporting).toBe(false);
  });
});

// ---- ExportButton disabled state ----

describe('ExportButton', () => {
  it('is disabled when freelancerName is empty', () => {
    const data = { ...initialTimesheetData, clientName: 'Acme', periodStart: new Date() };
    render(<ExportButton data={data} rows={[]} />);
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeDisabled();
  });

  it('is disabled when clientName is empty', () => {
    const data = { ...initialTimesheetData, freelancerName: 'Jane', periodStart: new Date() };
    render(<ExportButton data={data} rows={[]} />);
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeDisabled();
  });

  it('is disabled when periodStart is null', () => {
    const data = { ...initialTimesheetData, freelancerName: 'Jane', clientName: 'Acme' };
    render(<ExportButton data={data} rows={[]} />);
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeDisabled();
  });

  it('is enabled when freelancerName, clientName, and periodStart are all set', () => {
    const data: TimesheetData = {
      ...initialTimesheetData,
      freelancerName: 'Jane Doe',
      clientName: 'Acme Corp',
      periodStart: new Date(2025, 2, 1),
      periodEnd: new Date(2025, 2, 31),
    };
    render(<ExportButton data={data} rows={[]} />);
    expect(screen.getByRole('button', { name: /export pdf/i })).not.toBeDisabled();
  });
});
