import { useMemo } from 'react';
import { useStore } from '@/store/useStore';

export function useFilteredTransactions() {
  const transactions = useStore((s) => s.transactions);
  const filters = useStore((s) => s.filters);

  return useMemo(() => {
    let result = [...transactions];
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const key = filters.sortBy;
      const mul = filters.sortOrder === 'asc' ? 1 : -1;
      if (key === 'date') return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);
}
