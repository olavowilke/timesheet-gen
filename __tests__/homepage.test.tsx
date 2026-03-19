import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test-utils';
import Home from '@/app/page';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Home page', () => {
  it('renders both timesheet cards', () => {
    render(<Home />);
    expect(screen.getByText('Weekly Timesheet')).toBeInTheDocument();
    expect(screen.getByText('Monthly Timesheet')).toBeInTheDocument();
  });

  it('Weekly Timesheet card links to /weekly', () => {
    render(<Home />);
    const link = screen.getByText('Weekly Timesheet').closest('a');
    expect(link).toHaveAttribute('href', '/weekly');
  });

  it('Monthly Timesheet card links to /monthly', () => {
    render(<Home />);
    const link = screen.getByText('Monthly Timesheet').closest('a');
    expect(link).toHaveAttribute('href', '/monthly');
  });
});
