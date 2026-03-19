'use client';

import { useState } from 'react';
import { Stack, Title, Divider } from '@mantine/core';
import TimesheetHeader from '@/components/TimesheetHeader/TimesheetHeader';
import PeriodSelector from '@/components/PeriodSelector/PeriodSelector';
import type { TimesheetData } from '@/types/timesheet';
import { initialTimesheetData } from '@/types/timesheet';

export default function MonthlyPage() {
  const [data, setData] = useState<TimesheetData>({ ...initialTimesheetData, mode: 'monthly' });

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
    </Stack>
  );
}
