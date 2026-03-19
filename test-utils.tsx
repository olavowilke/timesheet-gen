import { render, type RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import type { ReactElement, ReactNode } from 'react';

function Providers({ children }: { children: ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
