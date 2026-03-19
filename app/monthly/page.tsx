'use client';

import { useState } from 'react';
import { Stack, Title, Divider, Group } from '@mantine/core';
import TimesheetHeader from '@/components/TimesheetHeader/TimesheetHeader';
import PeriodSelector from '@/components/PeriodSelector/PeriodSelector';
import TimesheetTable from '@/components/TimesheetTable/TimesheetTable';
import ExportButton from '@/components/ExportButton/ExportButton';
import type { TimesheetData, TimesheetRow } from '@/types/timesheet';
import { initialTimesheetData } from '@/types/timesheet';

export default function MonthlyPage() {
  const [data, setData] = useState<TimesheetData>({ ...initialTimesheetData, mode: 'monthly' });
  const [rows, setRows] = useState<TimesheetRow[]>([]);

  return (
    <Stack gap="xl">
      <Title order={2}>Monthly Timesheet</Title>
      <PeriodSelector
        mode="monthly"
        periodStart={data.periodStart}
        periodEnd={data.periodEnd}
        onChange={(start, end) => setData((d) => ({ ...d, periodStart: start, periodEnd: end }))}
      />
      <Divider />
      <TimesheetHeader data={data} onChange={setData} />
      <Divider />
      <TimesheetTable
        periodStart={data.periodStart}
        periodEnd={data.periodEnd}
        hourlyRate={data.hourlyRate}
        currency={data.currency}
        onChange={setRows}
      />
      <Group justify="flex-end">
        <ExportButton data={data} rows={rows} />
      </Group>
    </Stack>
  );
}
