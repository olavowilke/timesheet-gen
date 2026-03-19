export interface TimesheetRow {
  date: Date;
  dayName: string;
  hoursWorked: number | null;
  notes: string;
  isWeekend: boolean;
}

export interface TimesheetData {
  freelancerName: string;
  clientName: string;
  projectName: string;
  hourlyRate: number;
  currency: string;
  description: string;
  periodStart: Date | null;
  periodEnd: Date | null;
  mode: 'weekly' | 'monthly';
}

export const initialTimesheetData: TimesheetData = {
  freelancerName: '',
  clientName: '',
  projectName: '',
  hourlyRate: 0,
  currency: 'USD',
  description: '',
  periodStart: null,
  periodEnd: null,
  mode: 'weekly',
};
