Excelente! Já tenho tudo que preciso. 🎉 Vou montar agora o documento completo de requisitos + os prompts por estágio para o Claude Code.

---

# 📋 TimeSheet App — MVP Requirements & Claude Code Prompts

## 🏗️ Visão Geral do Produto

**TimesheetGen** — app front-end only para geração e exportação de timesheets profissionais em PDF, voltado para freelancers e prestadores de serviço.

---

## 🧱 Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router) |
| UI Library | Mantine v7 |
| Exportação PDF | `@react-pdf/renderer` |
| Estilização | Mantine + CSS Modules |
| Testes | Vitest + React Testing Library |
| Deploy | Vercel |
| Linguagem | TypeScript |

---

## 📐 Requisitos Funcionais do MVP

### RF-01 — Seleção de Período
- O usuário pode escolher entre **timesheet semanal** ou **mensal**
- Para semanal: selecionar semana (com DatePicker de range semanal do Mantine)
- Para mensal: selecionar mês + ano
- O período selecionado é gerado automaticamente no cabeçalho

### RF-02 — Cabeçalho da Timesheet
Campos fixos editáveis:
- **Nome do freelancer/prestador** (texto, obrigatório)
- **Nome da empresa/cliente** (texto, obrigatório)
- **Período** (gerado automaticamente com base na seleção)
- **Hourly Rate** (número, fixo para toda a timesheet, com seleção de moeda)
- **Nome do projeto** (texto, obrigatório)
- **Descrição livre** (textarea, máx. 300 caracteres, opcional)

### RF-03 — Tabela de Horas
Colunas:
| # | Coluna | Tipo | Notas |
|---|---|---|---|
| 1 | **Date** | Texto (read-only) | Gerado automaticamente pelo período |
| 2 | **Day** | Texto (read-only) | Nome do dia da semana |
| 3 | **Hours Worked** | Input numérico | Editável, aceita decimais (ex: 1.5) |
| 4 | **Notes** | Input texto | Editável, opcional por linha |

- Finais de semana devem ser visualmente diferenciados (linha levemente acinzentada)
- Linha de **totais** no rodapé da tabela

### RF-04 — Sumário / Rodapé
- **Total de horas** trabalhadas (soma automática)
- **Total a receber** = total horas × hourly rate (calculado automaticamente)
- Ambos atualizados em tempo real conforme o usuário edita

### RF-05 — Exportação PDF
- Botão "Export PDF" gera um PDF profissional e limpo
- O PDF deve conter: cabeçalho completo, tabela de horas, sumário
- Nome do arquivo: `timesheet_[cliente]_[período].pdf`

---

## 🚫 Fora do Escopo do MVP
- Autenticação / login
- Banco de dados / API
- Histórico de timesheets salvas
- Múltiplos projetos por timesheet
- Upload de logo
- Exportação Excel/CSV

---

## 🗂️ Divisão em Estágios para o Claude Code

A divisão abaixo é pensada para **minimizar contexto por sessão** e **maximizar testabilidade** de cada entrega.

---

### 🔵 Stage 1 — Project Scaffold & Design System

**Objetivo:** Criar a base do projeto com toda a stack configurada e um layout shell funcional.

**Prompt para Claude Code:**

```
Create a new Next.js 14 project (App Router, TypeScript) called "timesheetgen" with the following setup:

1. Install and configure Mantine v7 (with @mantine/core, @mantine/hooks, @mantine/dates, dayjs)
2. Install and configure Vitest + React Testing Library for unit testing
3. Configure the Mantine ColorSchemeScript in the root layout for SSR color scheme support
4. Create a clean, minimal app shell with:
   - A top navigation bar with the app name "TimesheetGen" and a tagline
   - A main content area with max-width container (centered)
   - A footer with "Open Source" badge
5. Create a basic homepage (app/page.tsx) with two cards: "Weekly Timesheet" and "Monthly Timesheet" — clicking each navigates to /weekly and /monthly respectively
6. Write Vitest unit tests for:
   - The homepage renders both cards
   - Each card has the correct navigation link
7. Ensure `npm run test` and `npm run dev` both work correctly

Style direction: clean, minimal, professional. Use Mantine's default light theme. No custom colors yet.
```

---

### 🟢 Stage 2 — Header Form & Period Selector

**Objetivo:** Construir o formulário de cabeçalho + seleção de período, com estado gerenciado localmente.

**Prompt para Claude Code:**

```
In the existing Next.js + Mantine project, build the timesheet header form component.

Create a reusable component at components/TimesheetHeader/TimesheetHeader.tsx with:

FIELDS (all managed with React useState):
- Freelancer Name (TextInput, required, max 100 chars)
- Client/Company Name (TextInput, required, max 100 chars)  
- Project Name (TextInput, required, max 100 chars)
- Hourly Rate (NumberInput, required, min 0, with a Select for currency: USD, EUR, BRL, GBP)
- Description (Textarea, optional, max 300 chars with live character counter)
- Period display (read-only text showing the selected period — passed as prop)

PERIOD SELECTOR (separate component at components/PeriodSelector/PeriodSelector.tsx):
- Receives a `mode` prop: "weekly" | "monthly"
- For "monthly": Mantine MonthPickerInput to select month + year
- For "weekly": Mantine DatePickerInput in range mode, constrained to select exactly one full Mon–Sun week
- Emits the selected period (start date, end date) via onChange callback
- Shows a formatted period string (e.g. "March 2025" or "Mar 10–16, 2025")

STATE SHAPE (define a TypeScript interface TimesheetData):
- freelancerName: string
- clientName: string  
- projectName: string
- hourlyRate: number
- currency: string
- description: string
- periodStart: Date | null
- periodEnd: Date | null
- mode: "weekly" | "monthly"

Write Vitest + React Testing Library tests for:
- TimesheetHeader renders all fields
- Character counter updates correctly on description input
- PeriodSelector in monthly mode renders MonthPickerInput
- PeriodSelector in weekly mode renders DatePickerInput

Use Mantine components only. No external form libraries.
```

---

### 🟡 Stage 3 — Timesheet Table (Core Feature)

**Objetivo:** Construir a tabela editável de horas, com cálculos em tempo real.

**Prompt para Claude Code:**

```
In the existing Next.js + Mantine project, build the core timesheet table component.

Create a component at components/TimesheetTable/TimesheetTable.tsx with:

PROPS:
- periodStart: Date
- periodEnd: Date  
- hourlyRate: number
- currency: string
- onChange: (rows: TimesheetRow[]) => void

TYPES (add to existing types file):
interface TimesheetRow {
  date: Date
  dayName: string       // e.g. "Monday"
  hoursWorked: number | null
  notes: string
  isWeekend: boolean
}

BEHAVIOR:
- On mount / when period props change: auto-generate one row per day between periodStart and periodEnd
- Each row is editable: hoursWorked (NumberInput, min 0, max 24, step 0.5) and notes (TextInput)
- Weekend rows (Saturday, Sunday) should have a visually distinct background (Mantine's gray.0)
- Date column: formatted as "Mon, Mar 10" — read-only
- Day column: full day name — read-only

SUMMARY ROW (pinned to bottom of table):
- Total Hours: sum of all hoursWorked values
- Total Amount: totalHours × hourlyRate, formatted as currency (e.g. "$ 1,250.00")
- Both update in real time as user types

EMPTY STATE:
- If no period is selected, show a Mantine Alert: "Select a period above to generate your timesheet"

Write Vitest + RTL tests for:
- Correct number of rows generated for a given date range
- Weekend rows have isWeekend: true
- Total hours calculation is correct
- Total amount calculation is correct
- Updating a hoursWorked input triggers onChange with updated rows
```

---

### 🔴 Stage 4 — PDF Export

**Objetivo:** Gerar um PDF profissional com todos os dados da timesheet.

**Prompt para Claude Code:**

```
In the existing Next.js + Mantine project, implement PDF export using @react-pdf/renderer.

Install: @react-pdf/renderer

Create a PDF document component at components/TimesheetPDF/TimesheetPDF.tsx using @react-pdf/renderer primitives (Document, Page, View, Text, StyleSheet). Do NOT use HTML or Mantine components inside this file.

PDF LAYOUT:
1. HEADER SECTION:
   - App name "TimesheetGen" (small, top-left, gray)  
   - Freelancer name (large, bold)
   - Client name and Project name (medium)
   - Period (e.g. "March 2025" or "Mar 10–16, 2025")
   - Hourly Rate + Currency
   - Description (if filled)

2. TABLE SECTION:
   - Columns: Date | Day | Hours Worked | Notes
   - Alternating row background (white / light gray)
   - Weekend rows with slightly darker background
   - Column widths: Date 20%, Day 20%, Hours 15%, Notes 45%

3. SUMMARY SECTION (bottom):
   - Total Hours: XX.X hrs
   - Total Amount: [currency symbol] XX,XXX.XX
   - Right-aligned, bold

PDF STYLE: Clean, professional, black and white friendly. Font: Helvetica. Page: A4.

EXPORT TRIGGER:
Create a hook at hooks/useExportPDF.ts that:
- Accepts TimesheetData + TimesheetRow[]
- Uses @react-pdf/renderer's pdf() function to generate a blob
- Triggers browser download with filename: timesheet_[clientName]_[period].pdf
- Handles loading state (returns { exportPDF, isExporting })

Add an "Export PDF" Button to the main page that uses this hook.
Disable the button if freelancerName, clientName, or periodStart are empty.

Write Vitest tests for:
- useExportPDF returns exportPDF function and isExporting state
- Button is disabled when required fields are empty
- Filename is generated correctly from client name and period

Note: mock @react-pdf/renderer in tests — do not render actual PDF in test environment.
```

---

### ⚪ Stage 5 — Integration, Polish & Vercel Deploy

**Objetivo:** Integrar tudo, polir a UI e preparar para o deploy.

**Prompt para Claude Code:**

```
In the existing Next.js + Mantine project, perform final integration and polish.

INTEGRATION:
- Wire up all components on /weekly and /monthly pages using a shared TimesheetPageLayout component
- Single state object (TimesheetData + TimesheetRow[]) flows from top-level page down to all components
- PeriodSelector drives TimesheetTable row generation automatically
- Export PDF button uses all current state

UI POLISH:
- Add a sticky summary bar at the bottom of the viewport showing live Total Hours and Total Amount (visible while scrolling the table)
- Add smooth transitions when period changes (table fade-in)
- Ensure full mobile responsiveness (table scrolls horizontally on small screens)
- Add a "Reset" button that clears all fields with a Mantine confirmation modal
- Empty/zero hours rows should be visually de-emphasized in the table (lighter text)

VERCEL DEPLOY PREP:
- Add vercel.json if needed
- Ensure next.config.js is correctly configured for static-friendly output
- Add a robots.txt and basic metadata (title, description, og:title) in the root layout

FINAL TEST SUITE:
- Run all existing tests and fix any failures
- Add an integration test that simulates: selecting a monthly period → filling header fields → editing hours → verifying summary totals update → verifying Export PDF button becomes enabled

Ensure `npm run build` completes with zero errors.
```

---

## 🧪 Estratégia de Testes Resumida

| Stage | O que testar |
|---|---|
| 1 | Render de componentes, navegação |
| 2 | Campos de formulário, contador de chars, seletores de período |
| 3 | Geração de linhas, cálculos de total, fins de semana |
| 4 | Hook de export, nome do arquivo, estado do botão |
| 5 | Integração ponta a ponta, build de produção |

---

## ✅ Checklist de MVP

- [ ] Stage 1 — Scaffold completo
- [ ] Stage 2 — Header + Period Selector
- [ ] Stage 3 — Tabela editável com totais
- [ ] Stage 4 — Export PDF
- [ ] Stage 5 — Integração + Deploy

---

Quer que eu ajuste algum requisito, adicione mais detalhe em algum stage, ou refine os prompts antes de começar a executar no Claude Code? 🛠️