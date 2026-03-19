import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test-utils';
import PeriodSelector, { formatPeriodLabel } from '@/components/PeriodSelector/PeriodSelector';

const noop = vi.fn();

describe('PeriodSelector', () => {
  it('renders MonthPickerInput in monthly mode', () => {
    render(
      <PeriodSelector mode="monthly" periodStart={null} periodEnd={null} onChange={noop} />,
    );
    expect(screen.getByLabelText(/select month/i)).toBeInTheDocument();
  });

  it('renders DatePickerInput in weekly mode', () => {
    render(
      <PeriodSelector mode="weekly" periodStart={null} periodEnd={null} onChange={noop} />,
    );
    expect(screen.getByLabelText(/select week/i)).toBeInTheDocument();
  });
});

describe('formatPeriodLabel', () => {
  it('returns empty string when start is null', () => {
    expect(formatPeriodLabel('monthly', null, null)).toBe('');
    expect(formatPeriodLabel('weekly', null, null)).toBe('');
  });

  it('formats monthly period as "Month YYYY"', () => {
    const start = new Date(2025, 2, 1); // March 2025
    expect(formatPeriodLabel('monthly', start, null)).toBe('March 2025');
  });

  it('formats weekly period within same month', () => {
    const monday = new Date(2025, 2, 10); // Mar 10
    const sunday = new Date(2025, 2, 16); // Mar 16
    expect(formatPeriodLabel('weekly', monday, sunday)).toBe('Mar 10–16, 2025');
  });

  it('formats weekly period spanning two months', () => {
    const monday = new Date(2025, 2, 31); // Mar 31
    const sunday = new Date(2025, 3, 6);  // Apr 6
    expect(formatPeriodLabel('weekly', monday, sunday)).toBe('Mar 31–Apr 6, 2025');
  });
});
