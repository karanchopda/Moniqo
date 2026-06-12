import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportTransaction {
  date: string;
  description: string;
  category: string;
  type: string;
  amount: number;
}

const fmtCurrency = (v: number) =>
  `Rs ${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export function exportTransactionsPdf(transactions: ExportTransaction[], filename?: string) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header
  doc.setFillColor(0, 51, 28);
  doc.rect(0, 0, 297, 22, 'F');
  doc.setTextColor(127, 229, 184);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MONIQO', 14, 14);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Transaction Export', 14, 19);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 220, 14);
  doc.text(`${transactions.length} records`, 220, 19);

  const totalExpense = transactions
    .filter((t) => t.type === 'debit' && t.category !== 'Transfer')
    .reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'credit')
    .reduce((s, t) => s + t.amount, 0);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Expenses: ${fmtCurrency(totalExpense)}`, 14, 30);
  doc.text(`Total Income: ${fmtCurrency(totalIncome)}`, 100, 30);

  autoTable(doc, {
    startY: 36,
    head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
    body: transactions.map((tx) => [
      fmtDate(tx.date),
      tx.description.slice(0, 60),
      tx.category,
      tx.type === 'credit' ? 'Income' : 'Expense',
      (tx.type === 'credit' ? '+' : '-') + fmtCurrency(tx.amount),
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 51, 28], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 90 },
      4: { halign: 'right', cellWidth: 30 },
    },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 6);
    doc.text('moniqo.com', 260, doc.internal.pageSize.height - 6);
  }

  doc.save(filename || `moniqo_transactions_${new Date().toISOString().split('T')[0]}.pdf`);
}

export interface RecurringExportItem {
  vendor: string;
  category: string;
  amount: number;
  frequency: string;
  monthlyCost: number;
  impact: string;
}

export function exportRecurringPdf(items: RecurringExportItem[], totalMonthly: number, filename?: string) {
  const doc = new jsPDF();

  doc.setFillColor(0, 51, 28);
  doc.rect(0, 0, 210, 22, 'F');
  doc.setTextColor(127, 229, 184);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MONIQO', 14, 14);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Recurring & Subscription Report', 14, 19);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Estimated monthly recurring cost: ${fmtCurrency(totalMonthly)}`, 14, 32);
  doc.text(`Annual projection: ${fmtCurrency(totalMonthly * 12)}`, 14, 38);

  autoTable(doc, {
    startY: 44,
    head: [['Vendor', 'Category', 'Amount', 'Frequency', 'Monthly', 'Impact']],
    body: items.map((i) => [
      i.vendor.slice(0, 30),
      i.category,
      fmtCurrency(i.amount),
      i.frequency,
      fmtCurrency(i.monthlyCost),
      i.impact,
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 51, 28], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(filename || `moniqo_recurring_${new Date().toISOString().split('T')[0]}.pdf`);
}
