import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import Navbar from '@/components/dashboard/Navbar';
import SummaryCard from '@/components/dashboard/SummaryCard';
import { BalanceChart, SpendingPieChart } from '@/components/dashboard/Charts';
import TransactionsSection from '@/components/dashboard/TransactionsSection';
import InsightsSection from '@/components/dashboard/InsightsSection';
import { HiOutlineCurrencyDollar, HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';
import { useMemo } from 'react';

export default function Index() {
  const [section, setSection] = useState('overview');
  const transactions = useStore((s) => s.transactions);
  const darkMode = useStore((s) => s.darkMode);

  // Apply dark mode on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const stats = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { balance: income - expense + 10000, income, expense };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar activeSection={section} onNavigate={setSection} />

      <div className="lg:ml-[240px] flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {(section === 'overview' || section === 'analytics') && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <SummaryCard
                    title="Total Balance"
                    value={`$${stats.balance.toLocaleString()}`}
                    change={12.5}
                    icon={HiOutlineCurrencyDollar}
                    gradient="gradient-bg"
                    delay={0}
                  />
                  <SummaryCard
                    title="Income"
                    value={`$${stats.income.toLocaleString()}`}
                    change={8.2}
                    icon={HiOutlineTrendingUp}
                    gradient="bg-success"
                    delay={0.1}
                  />
                  <SummaryCard
                    title="Expenses"
                    value={`$${stats.expense.toLocaleString()}`}
                    change={-3.1}
                    icon={HiOutlineTrendingDown}
                    gradient="bg-destructive"
                    delay={0.2}
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  <BalanceChart />
                  <SpendingPieChart />
                </div>
              </>
            )}

            {section === 'overview' && <TransactionsSection />}
            {section === 'transactions' && <TransactionsSection />}
            {(section === 'insights' || section === 'overview') && (
              <div className={section === 'overview' ? 'mt-6' : ''}>
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {section === 'insights' ? 'Financial Insights' : 'Quick Insights'}
                </h2>
                <InsightsSection />
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
