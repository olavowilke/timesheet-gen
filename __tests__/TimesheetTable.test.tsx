import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { render, screen } from '../test-utils';
import TimesheetTable, {
  generateRows,
  calcTotalHours,
  formatCurrency,
} from '@/components/TimesheetTable/TimesheetTable';

// Mar 10 2025 = Monday, Mar 16 2025 = Sunday
const MAR_10 = new Date(2025, 2, 10);
const MAR_16 = new Date(2025, 2, 16);

// ------- pure helper tests -------

describe('generateRows', () => {
  it('generates correct number of rows for a 7-day week', () => {
    expect(generateRows(MAR_10, MAR_16)).toHaveLength(7);
  });

  it('generates correct number of rows for a full month (March = 31 days)', () => {
    expect(generateRows(new Date(2025, 2, 1), new Date(2025, 2, 31))).toHaveLength(31);
  });

  it('marks Saturday and Sunday as weekend', () => {
    const rows = generateRows(MAR_10, MAR_16);
    // Mon–Fri (index 0–4) not weekend
    expect(rows[0].isWeekend).toBe(false); // Monday
    expect(rows[4].isWeekend).toBe(false); // Friday
    // Sat + Sun (index 5–6) are weekend
    expect(rows[5].isWeekend).toBe(true);  // Saturday
    expect(rows[6].isWeekend).toBe(true);  // Sunday
  });

  it('sets dayName correctly', () => {
    const rows = generateRows(MAR_10, MAR_16);
    expect(rows[0].dayName).toBe('Monday');
    expect(rows[5].dayName).toBe('Saturday');
    expect(rows[6].dayName).toBe('Sunday');
  });

  it('initialises hoursWorked as null and notes as empty string', () => {
    const rows = generateRows(MAR_10, MAR_16);
    rows.forEach((r) => {
      expect(r.hoursWorked).toBeNull();
      expect(r.notes).toBe('');
    });
  });
});

describe('calcTotalHours', () => {
  it('sums hoursWorked and treats null as 0', () => {
    const rows = generateRows(MAR_10, MAR_16).map((r, i) => ({
      ...r,
      hoursWorked: [8, 7.5, 6, null, null, null, null][i] ?? null,
    }));
    expect(calcTotalHours(rows)).toBe(21.5);
  });

  it('returns 0 when all rows are null', () => {
    expect(calcTotalHours(generateRows(MAR_10, MAR_16))).toBe(0);
  });
});

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1250, 'USD')).toBe('$1,250.00');
  });

  it('formats EUR correctly', () => {
    expect(formatCurrency(100, 'EUR')).toBe('€100.00');
  });

  it('total amount equals totalHours × hourlyRate', () => {
    const rows = generateRows(MAR_10, MAR_16).map((r, i) => ({
      ...r,
      hoursWorked: i === 0 ? 8 : null,
    }));
    const totalHours = calcTotalHours(rows);
    const hourlyRate = 50;
    expect(totalHours * hourlyRate).toBe(400);
    expect(formatCurrency(totalHours * hourlyRate, 'USD')).toBe('$400.00');
  });
});

// ------- component tests -------

describe('TimesheetTable component', () => {
  it('shows empty-state alert when no period is given', () => {
    render(
      <TimesheetTable
        periodStart={null}
        periodEnd={null}
        hourlyRate={100}
        currency="USD"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText(/select a period above/i)).toBeInTheDocument();
  });

  it('renders one hours-input per day in the period', () => {
    render(
      <TimesheetTable
        periodStart={MAR_10}
        periodEnd={MAR_16}
        hourlyRate={100}
        currency="USD"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId(/^hours-input-/)).toHaveLength(7);
  });

  it('calls onChange with generated rows on mount', () => {
    const handleChange = vi.fn();
    render(
      <TimesheetTable
        periodStart={MAR_10}
        periodEnd={MAR_16}
        hourlyRate={100}
        currency="USD"
        onChange={handleChange}
      />,
    );
    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleChange.mock.calls[0][0]).toHaveLength(7);
  });

  it('calls onChange with updated rows when an hours input changes', () => {
    const handleChange = vi.fn();
    render(
      <TimesheetTable
        periodStart={MAR_10}
        periodEnd={MAR_16}
        hourlyRate={100}
        currency="USD"
        onChange={handleChange}
      />,
    );
    handleChange.mockClear();

    const firstInput = screen.getByTestId('hours-input-0');
    fireEvent.change(firstInput, { target: { value: '8' } });

    expect(handleChange).toHaveBeenCalled();
    const updatedRows = handleChange.mock.calls[0][0];
    expect(updatedRows[0].hoursWorked).toBe(8);
  });

  it('displays total hours and total amount in summary row', () => {
    render(
      <TimesheetTable
        periodStart={MAR_10}
        periodEnd={MAR_16}
        hourlyRate={50}
        currency="USD"
        onChange={vi.fn()}
      />,
    );
    // all hoursWorked start as null → totals should be 0
    expect(screen.getByTestId('total-hours')).toHaveTextContent('0.0 hrs');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('$0.00');
  });
});
