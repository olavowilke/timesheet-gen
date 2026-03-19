import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { TimesheetData, TimesheetRow } from '@/types/timesheet';
import { formatPeriodLabel } from '@/components/PeriodSelector/PeriodSelector';

interface TimesheetPDFProps {
  data: TimesheetData;
  rows: TimesheetRow[];
  totalHours: number;
  totalAmount: number;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    color: '#1a1a1a',
  },

  // ---- header ----
  appName: {
    fontSize: 8,
    color: '#9ca3af',
    marginBottom: 12,
  },
  freelancerName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  clientRow: {
    fontSize: 13,
    marginBottom: 2,
  },
  metaBlock: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 4,
  },
  metaLabel: {
    color: '#6b7280',
  },
  description: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    fontSize: 9,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 16,
  },

  // ---- table ----
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontFamily: 'Helvetica-Bold',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableRowWeekend: {
    backgroundColor: '#f3f4f6',
  },
  colDate: { width: '20%' },
  colDay: { width: '20%' },
  colHours: { width: '15%' },
  colNotes: { width: '45%' },

  // ---- summary ----
  summarySection: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  summaryLabel: {
    width: 90,
    textAlign: 'right',
    color: '#6b7280',
    marginRight: 12,
  },
  summaryValue: {
    width: 100,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
  },
});

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function TimesheetPDF({ data, rows, totalHours, totalAmount }: TimesheetPDFProps) {
  const periodLabel = formatPeriodLabel(data.mode, data.periodStart, data.periodEnd);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.appName}>TimesheetGen</Text>
        <Text style={styles.freelancerName}>{data.freelancerName}</Text>
        <Text style={styles.clientRow}>{data.clientName}</Text>
        <Text style={styles.clientRow}>{data.projectName}</Text>

        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>Period:</Text>
          <Text>{periodLabel}</Text>
        </View>
        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>Rate:</Text>
          <Text>
            {data.hourlyRate} {data.currency} / hr
          </Text>
        </View>

        {data.description ? (
          <Text style={styles.description}>{data.description}</Text>
        ) : null}

        <View style={styles.divider} />

        {/* Table */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDate}>Date</Text>
          <Text style={styles.colDay}>Day</Text>
          <Text style={styles.colHours}>Hours</Text>
          <Text style={styles.colNotes}>Notes</Text>
        </View>

        {rows.map((row, index) => {
          const rowStyle = {
            ...styles.tableRow,
            ...(row.isWeekend
              ? styles.tableRowWeekend
              : index % 2 === 1
                ? styles.tableRowAlt
                : {}),
          };

          return (
            <View key={row.date.toISOString()} style={rowStyle}>
              <Text style={styles.colDate}>
                {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(row.date)}
              </Text>
              <Text style={styles.colDay}>{row.dayName}</Text>
              <Text style={styles.colHours}>
                {row.hoursWorked != null ? row.hoursWorked.toFixed(1) : '—'}
              </Text>
              <Text style={styles.colNotes}>{row.notes}</Text>
            </View>
          );
        })}

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Hours</Text>
            <Text style={styles.summaryValue}>{totalHours.toFixed(1)} hrs</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>{formatAmount(totalAmount, data.currency)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
