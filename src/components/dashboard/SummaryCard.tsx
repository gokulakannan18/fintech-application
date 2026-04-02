import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  icon: IconType;
  gradient: string;
  delay?: number;
}

export default function SummaryCard({ title, value, change, icon: Icon, gradient, delay = 0 }: SummaryCardProps) {
  const positive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="glass-card p-5 sm:p-6 cursor-default"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold mt-2 text-foreground">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}
            >
              {positive ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${gradient}`}>
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
