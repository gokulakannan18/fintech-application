import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { HiOutlineX } from 'react-icons/hi';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ open, onClose }: Props) {
  const addTransaction = useStore((s) => s.addTransaction);
  const [form, setForm] = useState({
    amount: '',
    category: '',
    description: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.description) return;
    addTransaction({
      amount: parseFloat(form.amount),
      category: form.category,
      description: form.description,
      type: form.type,
      date: form.date,
    });
    setForm({ amount: '', category: '', description: '', type: 'expense', date: new Date().toISOString().split('T')[0] });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground">Add Transaction</h3>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <HiOutlineX className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <input
                    type="text"
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. Grocery shopping"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <input
                      type="text"
                      required
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-1 w-full px-3 py-2 text-sm rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Food"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as 'income' | 'expense' })}
                      className="mt-1 w-full px-3 py-2 text-sm rounded-lg bg-muted text-foreground border border-border focus:outline-none"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-sm font-semibold gradient-bg text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Add Transaction
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
