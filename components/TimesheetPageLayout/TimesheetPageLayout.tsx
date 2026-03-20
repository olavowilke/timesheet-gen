'use client';

import { useState } from 'react';
import { Stack, Title, Divider, Group, Button, Modal, Text, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import TimesheetHeader from '@/components/TimesheetHeader/TimesheetHeader';
import PeriodSelector from '@/components/PeriodSelector/PeriodSelector';
import TimesheetTable, {
  calcTotalHours,
} from '@/components/TimesheetTable/TimesheetTable';
import ExportButton from '@/components/ExportButton/ExportButton';
import StickyBar from '@/components/StickyBar/StickyBar';
import type { TimesheetData, TimesheetRow } from '@/types/timesheet';
import { initialTimesheetData } from '@/types/timesheet';

interface TimesheetPageLayoutProps {
  mode: 'weekly' | 'monthly';
}

export default function TimesheetPageLayout({ mode }: TimesheetPageLayoutProps) {
  const [data, setData] = useState<TimesheetData>({ ...initialTimesheetData, mode });
  const [rows, setRows] = useState<TimesheetRow[]>([]);
  const [resetOpened, { open: openReset, close: closeReset }] = useDisclosure(false);

  function handleReset() {
    setData({ ...initialTimesheetData, mode });
    setRows([]);
    closeReset();
  }

  const totalHours = calcTotalHours(rows);
  const totalAmount = totalHours * data.hourlyRate;
  const title = mode === 'weekly' ? 'Weekly Timesheet' : 'Monthly Timesheet';

  return (
    <>
      {/* pb accounts for sticky bar + AppShell footer */}
      <Stack gap="xl" pb={120}>
        <Group justify="space-between" align="center">
          <Title order={2}>{title}</Title>
          <Group>
            <Button variant="default" size="sm" onClick={openReset}>
              Reset
            </Button>
            <ExportButton data={data} rows={rows} />
          </Group>
        </Group>

        <PeriodSelector
          mode={mode}
          periodStart={data.periodStart}
          periodEnd={data.periodEnd}
          onChange={(start, end) =>
            setData((d) => ({ ...d, periodStart: start, periodEnd: end }))
          }
        />

        <Divider />
        <TimesheetHeader data={data} onChange={setData} />
        <Divider />

        {/* Key forces remount (and fade-in animation) when period changes */}
        <Box
          key={`period-${data.periodStart?.getTime() ?? 0}-${data.periodEnd?.getTime() ?? 0}`}
          style={{
            animation: data.periodStart ? 'fadeIn 0.25s ease' : undefined,
            overflowX: 'auto',
          }}
        >
          <TimesheetTable
            periodStart={data.periodStart}
            periodEnd={data.periodEnd}
            hourlyRate={data.hourlyRate}
            currency={data.currency}
            onChange={setRows}
          />
        </Box>
      </Stack>

      <StickyBar totalHours={totalHours} totalAmount={totalAmount} currency={data.currency} />

      <Modal opened={resetOpened} onClose={closeReset} title="Reset Timesheet">
        <Text size="sm">
          Are you sure you want to clear all fields? This cannot be undone.
        </Text>
        <Group mt="lg" justify="flex-end">
          <Button variant="default" onClick={closeReset}>
            Cancel
          </Button>
          <Button color="red" onClick={handleReset}>
            Yes, reset
          </Button>
        </Group>
      </Modal>
    </>
  );
}
