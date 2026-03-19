'use client';

import { useState } from 'react';
import { Stack, Title, Divider } from '@mantine/core';
import TimesheetHeader from '@/components/TimesheetHeader/TimesheetHeader';
import PeriodSelector from '@/components/PeriodSelector/PeriodSelector';
import TimesheetTable from '@/components/TimesheetTable/TimesheetTable';
import type { TimesheetData, TimesheetRow } from '@/types/timesheet';
import { initialTimesheetData } from '@/types/timesheet';

export default function WeeklyPage() {
  const [data, setData] = useState<TimesheetData>({ ...initialTimesheetData, mode: 'weekly' });
  const [rows, setRows] = useState<TimesheetRow[]>([]);

  return (
    <Stack gap="xl">
      <Title order={2}>Weekly Timesheet</Title>
      <PeriodSelector
        mode="weekly"
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
    </Stack>
  );
}
