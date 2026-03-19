# TimesheetGen

A front-end only app for generating and exporting professional timesheets as PDF. Built for freelancers and service providers.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **UI:** Mantine v7
- **PDF Export:** `@react-pdf/renderer` *(Stage 4)*
- **Testing:** Vitest + React Testing Library

## Prerequisites

- Node.js 18.17 or later
- npm 9 or later

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

Run the full test suite once:

```bash
npm run test:run
```

Run tests in watch mode (re-runs on file changes):

```bash
npm run test
```

## Building for Production

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## Project Structure

```
timesheetgen/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Mantine providers, app shell)
│   ├── page.tsx                # Homepage — timesheet type selector
│   ├── weekly/
│   │   └── page.tsx            # Weekly timesheet page
│   └── monthly/
│       └── page.tsx            # Monthly timesheet page
├── components/
│   └── AppShell/
│       └── TimesheetAppShell.tsx  # Navigation bar, layout, footer
├── __tests__/
│   └── homepage.test.tsx       # Homepage unit tests
├── test-utils.tsx              # Custom render wrapper with MantineProvider
├── vitest.config.ts            # Vitest configuration
├── vitest.setup.ts             # Test setup (jest-dom matchers, jsdom mocks)
├── postcss.config.cjs          # PostCSS config for Mantine styles
└── next.config.js              # Next.js configuration
```

## Development Roadmap

| Stage | Feature | Status |
|-------|---------|--------|
| 1 | Project scaffold & design system | Done |
| 2 | Header form & period selector | Pending |
| 3 | Timesheet table with live totals | Pending |
| 4 | PDF export | Pending |
| 5 | Integration, polish & Vercel deploy | Pending |
