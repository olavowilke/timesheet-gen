import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import TimesheetAppShell from '@/components/AppShell/TimesheetAppShell';

export const metadata: Metadata = {
  title: 'TimesheetGen',
  description: 'Professional timesheet generator for freelancers and service providers',
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
