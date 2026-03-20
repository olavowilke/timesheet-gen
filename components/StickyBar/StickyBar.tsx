'use client';

import { Paper, Group, Text } from '@mantine/core';
import { formatCurrency } from '@/components/TimesheetTable/TimesheetTable';

interface StickyBarProps {
  totalHours: number;
  totalAmount: number;
  currency: string;
}

export default function StickyBar({ totalHours, totalAmount, currency }: StickyBarProps) {
  return (
    <Paper
      shadow="md"
      withBorder
      data-testid="sticky-bar"
      style={{
        position: 'fixed',
        bottom: 52, // sits above the AppShell footer (height: 52px)
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '10px 24px',
        borderLeft: 'none',
        borderRight: 'none',
        borderRadius: 0,
      }}
    >
      <Group justify="flex-end" gap="xl">
        <Group gap={6}>
          <Text size="sm" c="dimmed">
            Total Hours:
          </Text>
          <Text size="sm" fw={700} data-testid="sticky-total-hours">
            {totalHours.toFixed(1)} hrs
          </Text>
        </Group>
        <Group gap={6}>
          <Text size="sm" c="dimmed">
            Total Amount:
          </Text>
          <Text size="sm" fw={700} data-testid="sticky-total-amount">
            {formatCurrency(totalAmount, currency)}
          </Text>
        </Group>
      </Group>
    </Paper>
  );
}
