import { describe, it, expect, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../test-utils';
import TimesheetPageLayout from '@/components/TimesheetPageLayout/TimesheetPageLayout';

// --- module mocks (hoisted) ---

vi.mock('@react-pdf/renderer', () => ({
  pdf: vi.fn(() => ({ toBlob: vi.fn().mockResolvedValue(new Blob()) })),
  Document: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Page: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  View: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Text: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  StyleSheet: { create: (s: unknown) => s },
}));

// Replace PeriodSelector with a simple button that fires the onChange with a
// fixed period (March 2025 — 31 days). Named exports (formatPeriodLabel) are
// preserved so TimesheetHeader can still compute the period label.
vi.mock('@/components/PeriodSelector/PeriodSelector', async (importOriginal) => {
  const mod =
    await importOriginal<typeof import('@/components/PeriodSelector/PeriodSelector')>();
  return {
    ...mod,
    default: ({
      onChange,
    }: {
      onChange: (start: Date | null, end: Date | null) => void;
    }) => (
      <button
        data-testid="mock-period-selector"
        onClick={() => onChange(new Date(2025, 2, 1), new Date(2025, 2, 31))}
      >
        Select Period
      </button>
    ),
  };
});

// ---

describe('Integration: TimesheetPageLayout', () => {
  it('full flow: select period → fill fields → edit hours → totals update → export enabled', async () => {
    const user = userEvent.setup();
    render(<TimesheetPageLayout mode="monthly" />);

    // Initially: Export PDF disabled, empty-state alert shown
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeDisabled();
    expect(screen.getByText(/select a period above/i)).toBeInTheDocument();

    // 1. Select a monthly period (March 2025 = 31 days)
    await user.click(screen.getByTestId('mock-period-selector'));

    await waitFor(() => {
      expect(screen.getAllByTestId(/^hours-input-/)).toHaveLength(31);
    });

    // Empty-state alert gone
    expect(screen.queryByText(/select a period above/i)).not.toBeInTheDocument();

    // 2. Fill required header fields
    await user.type(screen.getByLabelText(/freelancer name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/client \/ company name/i), 'Acme Corp');

    // Export PDF should now be enabled (freelancerName + clientName + periodStart all set)
    expect(screen.getByRole('button', { name: /export pdf/i })).not.toBeDisabled();

    // 3. Edit hours for the first row
    fireEvent.change(screen.getByTestId('hours-input-0'), { target: { value: '8' } });

    // 4. Table summary row updates
    await waitFor(() => {
      expect(screen.getByTestId('total-hours')).toHaveTextContent('8.0 hrs');
    });

    // 5. Sticky bar reflects the same total
    expect(screen.getByTestId('sticky-total-hours')).toHaveTextContent('8.0 hrs');
  });

  it('Reset clears all fields and disables Export PDF', async () => {
    const user = userEvent.setup();
    render(<TimesheetPageLayout mode="monthly" />);

    // Select period and fill a field
    await user.click(screen.getByTestId('mock-period-selector'));
    await waitFor(() => screen.getAllByTestId(/^hours-input-/));

    await user.type(screen.getByLabelText(/freelancer name/i), 'Jane');
    await user.type(screen.getByLabelText(/client \/ company name/i), 'Acme');
    expect(screen.getByRole('button', { name: /export pdf/i })).not.toBeDisabled();

    // Open reset modal and wait for the portal to render confirm button
    await user.click(screen.getByRole('button', { name: /^reset$/i }));
    const confirmBtn = await screen.findByRole('button', { name: /yes, reset/i });
    await user.click(confirmBtn);

    // Fields cleared, export disabled again
    await waitFor(() => {
      expect(
        (screen.getByLabelText(/freelancer name/i) as HTMLInputElement).value,
      ).toBe('');
    });
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeDisabled();
  });
});
