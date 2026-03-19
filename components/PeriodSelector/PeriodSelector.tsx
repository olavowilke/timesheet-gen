'use client';

import { MonthPickerInput, DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';

interface PeriodSelectorProps {
  mode: 'weekly' | 'monthly';
  periodStart: Date | null;
  periodEnd: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

export function formatPeriodLabel(
  mode: 'weekly' | 'monthly',
  start: Date | null,
  end: Date | null,
): string {
  if (!start) return '';
  if (mode === 'monthly') {
    return dayjs(start).format('MMMM YYYY');
  }
  const s = dayjs(start);
  const e = end ? dayjs(end) : s.add(6, 'day');
  if (s.month() === e.month()) {
    return `${s.format('MMM D')}–${e.format('D, YYYY')}`;
  }
  return `${s.format('MMM D')}–${e.format('MMM D, YYYY')}`;
}

export default function PeriodSelector({
  mode,
  periodStart,
  periodEnd,
  onChange,
}: PeriodSelectorProps) {
  if (mode === 'monthly') {
    return (
      <MonthPickerInput
        label="Select Month"
        placeholder="Pick a month"
        value={periodStart}
        onChange={(date) => {
          if (!date) {
            onChange(null, null);
            return;
          }
          const start = dayjs(date).startOf('month').toDate();
          const end = dayjs(date).endOf('month').toDate();
          onChange(start, end);
        }}
      />
    );
  }

  // Weekly mode — user picks any day, snapped automatically to Mon–Sun
  return (
    <DatePickerInput
      label="Select Week"
      placeholder="Pick any day in the week"
      value={periodStart}
      onChange={(date) => {
        if (!date) {
          onChange(null, null);
          return;
        }
        const d = dayjs(date);
        const dayOfWeek = d.day(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = d.subtract(daysFromMonday, 'day');
        const sunday = monday.add(6, 'day');
        onChange(monday.toDate(), sunday.toDate());
      }}
    />
  );
}
