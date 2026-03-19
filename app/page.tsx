import { SimpleGrid, Card, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Title order={2} mb="xl">
        Create a Timesheet
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Link href="/weekly" style={{ textDecoration: 'none' }}>
          <Card shadow="sm" padding="xl" radius="md" withBorder style={{ cursor: 'pointer', height: '100%' }}>
            <Text fw={600} size="lg" mb="sm">
              Weekly Timesheet
            </Text>
            <Text c="dimmed" size="sm">
              Track hours for a specific week (Mon–Sun)
            </Text>
          </Card>
        </Link>
        <Link href="/monthly" style={{ textDecoration: 'none' }}>
          <Card shadow="sm" padding="xl" radius="md" withBorder style={{ cursor: 'pointer', height: '100%' }}>
            <Text fw={600} size="lg" mb="sm">
              Monthly Timesheet
            </Text>
            <Text c="dimmed" size="sm">
              Track hours for a full calendar month
            </Text>
          </Card>
        </Link>
      </SimpleGrid>
    </>
  );
}
