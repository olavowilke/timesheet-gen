import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import TimesheetAppShell from '@/components/AppShell/TimesheetAppShell';

export const metadata: Metadata = {
  title: {
    default: 'TimesheetGen',
    template: '%s | TimesheetGen',
  },
  description:
    'Generate and export professional PDF timesheets. Free, open-source, and runs entirely in your browser.',
  openGraph: {
    title: 'TimesheetGen',
    description: 'Generate and export professional PDF timesheets for freelancers.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <TimesheetAppShell>{children}</TimesheetAppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
