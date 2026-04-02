import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineCash } from 'react-icons/hi';

export default function InsightsSection() {
  const transactions = useStore((s) => s.transactions);

  const insights = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savings = totalIncome - totalExpense;

    const categoryMap: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });
    const highestCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

    return {
      totalExpense,
      savings,
      highestCategory: highestCategory ? { name: highestCategory[0], amount: highestCategory[1] } : null,
      savingsRate: totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0,
    };
  }, [transactions]);

  const cards = [
    {
      title: 'Highest Spending',
      value: insights.highestCategory ? `$${insights.highestCategory.amount.toLocaleString()}` : '—',
      subtitle: insights.highestCategory?.name || 'No data',
      icon: HiOutlineTrendingUp,
      progress: insights.highestCategory ? Math.min((insights.highestCategory.amount / insights.totalExpense) * 100, 100) : 0,
      color: 'bg-accent',
    },
    {
      title: 'Monthly Expenses',
      value: `$${insights.totalExpense.toLocaleString()}`,
      subtitle: 'Total this period',
      icon: HiOutlineTrendingDown,
      progress: Math.min((insights.totalExpense / 5000) * 100, 100),
      color: 'bg-destructive',
    },
    {
      title: 'Net Savings',
      value: `$${insights.savings.toLocaleString()}`,
      subtitle: `${insights.savingsRate}% savings rate`,
      icon: HiOutlineCash,
      progress: Math.max(0, Math.min(insights.savingsRate, 100)),
      color: 'bg-success',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${card.color}/10`}>
              <card.icon className={`w-4 h-4 ${card.color === 'bg-success' ? 'text-success' : card.color === 'bg-destructive' ? 'text-destructive' : 'text-accent'}`} />
            </div>
            <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
          </div>
          <p className="text-xl font-bold text-foreground">{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${card.progress}%` }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${card.color}`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
