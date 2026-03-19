'use client';

import { TextInput, NumberInput, Textarea, Select, Group, Stack, Text, SimpleGrid } from '@mantine/core';
import type { TimesheetData } from '@/types/timesheet';
import { formatPeriodLabel } from '@/components/PeriodSelector/PeriodSelector';

const DESCRIPTION_MAX = 300;

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'BRL', label: 'BRL' },
  { value: 'GBP', label: 'GBP' },
];

interface TimesheetHeaderProps {
  data: TimesheetData;
  onChange: (data: TimesheetData) => void;
}

export default function TimesheetHeader({ data, onChange }: TimesheetHeaderProps) {
  const periodLabel = formatPeriodLabel(data.mode, data.periodStart, data.periodEnd);

  function update(patch: Partial<TimesheetData>) {
    onChange({ ...data, ...patch });
  }

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <TextInput
          label="Freelancer Name"
          placeholder="Your full name"
          required
          maxLength={100}
          value={data.freelancerName}
          onChange={(e) => update({ freelancerName: e.currentTarget.value })}
        />
        <TextInput
          label="Client / Company Name"
          placeholder="Client or company name"
          required
          maxLength={100}
          value={data.clientName}
          onChange={(e) => update({ clientName: e.currentTarget.value })}
        />
        <TextInput
          label="Project Name"
          placeholder="Project name"
          required
          maxLength={100}
          value={data.projectName}
          onChange={(e) => update({ projectName: e.currentTarget.value })}
        />
        <Group align="flex-end" gap="xs" wrap="nowrap">
          <NumberInput
            label="Hourly Rate"
            placeholder="0.00"
            required
            min={0}
            decimalScale={2}
            style={{ flex: 1 }}
            value={data.hourlyRate}
            onChange={(val) => update({ hourlyRate: typeof val === 'number' ? val : 0 })}
          />
          <Select
            label="Currency"
            data={CURRENCY_OPTIONS}
            value={data.currency}
            onChange={(val) => update({ currency: val ?? 'USD' })}
            w={90}
          />
        </Group>
      </SimpleGrid>

      <Textarea
        label="Description"
        placeholder="Optional notes or description"
        maxLength={DESCRIPTION_MAX}
        autosize
        minRows={2}
        value={data.description}
        onChange={(e) => update({ description: e.currentTarget.value })}
        description={`${data.description.length} / ${DESCRIPTION_MAX}`}
      />

      {periodLabel && (
        <Text size="sm" c="dimmed">
          Period: <strong>{periodLabel}</strong>
        </Text>
      )}
    </Stack>
  );
}
