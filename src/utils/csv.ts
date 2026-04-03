import type { Transaction } from '@/store/useStore';


export function exportTransactionsCSV(transactions: Transaction[]) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((t) => [t.date, t.description, t.category, t.type, t.amount.toString()]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
}
