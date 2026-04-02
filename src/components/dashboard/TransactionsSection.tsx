import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import { exportTransactionsCSV } from '@/utils/csv';
import { HiOutlineSearch, HiOutlineTrash, HiOutlineDownload, HiOutlinePlus } from 'react-icons/hi';
import AddTransactionModal from './AddTransactionModal';

export default function TransactionsSection() {
  const { filters, setFilters, role, deleteTransaction } = useStore();
  const filtered = useFilteredTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setFilters({ search: searchInput }), 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-bold text-foreground">Transactions</h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 w-[180px]"
            />
          </div>
          {/* Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value as 'all' | 'income' | 'expense' })}
            className="text-sm px-3 py-2 rounded-lg bg-muted text-foreground border border-border focus:outline-none"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {/* Sort */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as ['date' | 'amount', 'asc' | 'desc'];
              setFilters({ sortBy, sortOrder });
            }}
            className="text-sm px-3 py-2 rounded-lg bg-muted text-foreground border border-border focus:outline-none"
          >
            <option value="date-desc">Date ↓</option>
            <option value="date-asc">Date ↑</option>
            <option value="amount-desc">Amount ↓</option>
            <option value="amount-asc">Amount ↑</option>
          </select>
          {/* Export CSV */}
          <button
            onClick={() => exportTransactionsCSV(filtered)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Export CSV"
          >
            <HiOutlineDownload className="w-4 h-4" />
          </button>
          {/* Add (admin) */}
          {role === 'admin' && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium gradient-bg text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-muted-foreground text-sm">No transactions found</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                  <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                  {role === 'admin' && <th className="p-4 w-10" />}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((t) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 text-muted-foreground">{t.date}</td>
                      <td className="p-4 font-medium text-foreground">{t.description}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">{t.category}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold ${t.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                          {t.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className={`p-4 text-right font-semibold ${t.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                      {role === 'admin' && (
                        <td className="p-4">
                          <button
                            onClick={() => deleteTransaction(t.id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">{t.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.date} · {t.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${t.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </p>
                    {role === 'admin' && (
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="mt-1 text-muted-foreground hover:text-destructive"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.div>
  );
}
