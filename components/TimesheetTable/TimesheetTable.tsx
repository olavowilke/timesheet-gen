'use client';

import { useEffect, useRef, useState } from 'react';
import { Alert, Table, NumberInput, TextInput, Text } from '@mantine/core';
import dayjs from 'dayjs';
import type { TimesheetRow } from '@/types/timesheet';

interface TimesheetTableProps {
  periodStart: Date | null;
  periodEnd: Date | null;
  hourlyRate: number;
  currency: string;
  onChange: (rows: TimesheetRow[]) => void;
}

export function generateRows(start: Date, end: Date): TimesheetRow[] {
  const rows: TimesheetRow[] = [];
  let current = dayjs(start);
  const endDay = dayjs(end);

  while (!current.isAfter(endDay)) {
    const dow = current.day(); // 0 = Sun, 6 = Sat
    rows.push({
      date: current.toDate(),
      dayName: current.format('dddd'),
      hoursWorked: null,
      notes: '',
      isWeekend: dow === 0 || dow === 6,
    });
    current = current.add(1, 'day');
  }

  return rows;
}

export function calcTotalHours(rows: TimesheetRow[]): number {
  return rows.reduce((sum, r) => sum + (r.hoursWorked ?? 0), 0);
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function TimesheetTable({
  periodStart,
  periodEnd,
  hourlyRate,
  currency,
  onChange,
}: TimesheetTableProps) {
  const [rows, setRows] = useState<TimesheetRow[]>([]);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const startTime = periodStart?.getTime() ?? null;
  const endTime = periodEnd?.getTime() ?? null;

  useEffect(() => {
    if (!periodStart || !periodEnd) {
      setRows([]);
      return;
    }
    const newRows = generateRows(periodStart, periodEnd);
    setRows(newRows);
    onChangeRef.current(newRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime]);

  if (!periodStart || !periodEnd) {
    return (
      <Alert color="blue" variant="light">
        Select a period above to generate your timesheet
      </Alert>
    );
  }

  const totalHours = calcTotalHours(rows);
  const totalAmount = totalHours * hourlyRate;

  function updateRow(index: number, patch: Partial<TimesheetRow>) {
    const updated = rows.map((r, i) => (i === index ? { ...r, ...patch } : r));
    setRows(updated);
    onChangeRef.current(updated);
  }

  return (
    <Table withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Date</Table.Th>
          <Table.Th>Day</Table.Th>
          <Table.Th>Hours Worked</Table.Th>
          <Table.Th>Notes</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {rows.map((row, index) => {
          const isZero = !row.hoursWorked; // null or 0
          return (
          <Table.Tr
            key={row.date.toISOString()}
            style={
              row.isWeekend ? { backgroundColor: 'var(--mantine-color-gray-0)' } : undefined
            }
          >
            <Table.Td style={{ color: isZero ? 'var(--mantine-color-gray-5)' : undefined }}>
              {dayjs(row.date).format('ddd, MMM D')}
            </Table.Td>
            <Table.Td style={{ color: isZero ? 'var(--mantine-color-gray-5)' : undefined }}>
              {row.dayName}
            </Table.Td>
            <Table.Td>
              <NumberInput
                size="xs"
                min={0}
                max={24}
                step={0.5}
                decimalScale={1}
                placeholder="0"
                value={row.hoursWorked ?? ''}
                onChange={(val) =>
                  updateRow(index, { hoursWorked: typeof val === 'number' ? val : null })
                }
                data-testid={`hours-input-${index}`}
              />
            </Table.Td>
            <Table.Td>
              <TextInput
                size="xs"
                placeholder="Notes"
                value={row.notes}
                onChange={(e) => updateRow(index, { notes: e.currentTarget.value })}
                data-testid={`notes-input-${index}`}
              />
            </Table.Td>
          </Table.Tr>
          );
        })}
      </Table.Tbody>

      <Table.Tfoot>
        <Table.Tr style={{ backgroundColor: 'var(--mantine-color-gray-1)' }}>
          <Table.Td colSpan={2}>
            <Text fw={700} size="sm">
              Total
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fw={700} size="sm" data-testid="total-hours">
              {totalHours.toFixed(1)} hrs
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fw={700} size="sm" data-testid="total-amount">
              {formatCurrency(totalAmount, currency)}
            </Text>
          </Table.Td>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  );
}
