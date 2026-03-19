'use client';

import { AppShell, Group, Text, Container, Badge } from '@mantine/core';
import type { ReactNode } from 'react';

export default function TimesheetAppShell({ children }: { children: ReactNode }) {
  return (
    <AppShell header={{ height: 60 }} footer={{ height: 52 }} padding="xl">
      <AppShell.Header>
        <Group h="100%" px="md" gap="sm">
          <Text fw={700} size="xl">
            TimesheetGen
          </Text>
          <Text c="dimmed" size="sm">
            Professional timesheets for freelancers
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">{children}</Container>
      </AppShell.Main>

      <AppShell.Footer p="md">
        <Group justify="center">
          <Badge variant="outline" color="gray">
            Open Source
          </Badge>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}
