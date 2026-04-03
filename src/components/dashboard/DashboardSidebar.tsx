import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import {
  HiOutlineHome,
  HiOutlineCreditCard,
  HiOutlineChartBar,
  HiOutlineLightBulb,
  HiOutlineX,
  HiOutlineMenu,
} from 'react-icons/hi';


const navItems = [
  { id: 'overview', label: 'Overview', icon: HiOutlineHome },
  { id: 'transactions', label: 'Transactions', icon: HiOutlineCreditCard },
  { id: 'insights', label: 'Insights', icon: HiOutlineLightBulb },
  { id: 'analytics', label: 'Analytics', icon: HiOutlineChartBar },
];

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function DashboardSidebar({ activeSection, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const darkMode = useStore((s) => s.darkMode);

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const active = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              setMobileOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass-card"
      >
        <HiOutlineMenu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] z-50 bg-card border-r border-border lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-bold gradient-text">FinDash</span>
                <button onClick={() => setMobileOpen(false)} className="p-1">
                  <HiOutlineX className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              {nav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[240px] lg:fixed lg:inset-y-0 bg-card/50 backdrop-blur-xl border-r border-border">
        <div className="p-6">
          <h1 className="text-xl font-bold gradient-text">FinDash</h1>
          <p className="text-xs text-muted-foreground mt-1">Finance Dashboard</p>
        </div>
        {nav}
      </aside>
    </>
  );
}
