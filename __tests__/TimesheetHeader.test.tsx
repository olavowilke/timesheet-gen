import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { render, screen } from '../test-utils';
import TimesheetHeader from '@/components/TimesheetHeader/TimesheetHeader';
import type { TimesheetData } from '@/types/timesheet';
import { initialTimesheetData } from '@/types/timesheet';

const baseData: TimesheetData = { ...initialTimesheetData };
const noop = vi.fn();

describe('TimesheetHeader', () => {
  it('renders all fields', () => {
    render(<TimesheetHeader data={baseData} onChange={noop} />);

    expect(screen.getByLabelText(/freelancer name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/client \/ company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hourly rate/i)).toBeInTheDocument();
    // Mantine Select renders both a combobox input and a listbox with the same label;
    // getAllByLabelText avoids the "multiple elements" error
    expect(screen.getAllByLabelText(/currency/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('character counter starts at 0 / 300', () => {
    render(<TimesheetHeader data={baseData} onChange={noop} />);
    expect(screen.getByText('0 / 300')).toBeInTheDocument();
  });

  it('character counter updates when description changes', () => {
    const text = 'Hello world';
    const data: TimesheetData = { ...baseData, description: text };
    render(<TimesheetHeader data={data} onChange={noop} />);
    expect(screen.getByText(`${text.length} / 300`)).toBeInTheDocument();
  });

  it('calls onChange when freelancer name is typed', () => {
    const handleChange = vi.fn();
    render(<TimesheetHeader data={baseData} onChange={handleChange} />);
    const input = screen.getByLabelText(/freelancer name/i);
    fireEvent.change(input, { target: { value: 'Jane Doe' } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ freelancerName: 'Jane Doe' }),
    );
  });

  it('shows formatted period label when period is set', () => {
    const data: TimesheetData = {
      ...baseData,
      mode: 'monthly',
      periodStart: new Date(2025, 2, 1), // March 1 2025
      periodEnd: new Date(2025, 2, 31),
    };
    render(<TimesheetHeader data={data} onChange={noop} />);
    expect(screen.getByText(/march 2025/i)).toBeInTheDocument();
  });
});
