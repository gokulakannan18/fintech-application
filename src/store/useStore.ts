import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
}

interface Filters {
  search: string;
  type: 'all' | 'income' | 'expense';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

export interface AuthUser {
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

interface StoredUser extends AuthUser {
  password: string;
}

const ADMIN_EMAIL = 'admin@findash.com';

interface AppState {
  transactions: Transaction[];
  filters: Filters;
  role: 'admin' | 'viewer';
  darkMode: boolean;
  user: AuthUser | null;
  users: StoredUser[];
  isAuthenticated: boolean;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: Partial<Filters>) => void;
  toggleDarkMode: () => void;
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 5200, category: 'Salary', type: 'income', description: 'Monthly salary' },
  { id: '2', date: '2026-03-28', amount: 120, category: 'Food', type: 'expense', description: 'Groceries' },
  { id: '3', date: '2026-03-25', amount: 2500, category: 'Freelance', type: 'income', description: 'Client project' },
  { id: '4', date: '2026-03-22', amount: 850, category: 'Rent', type: 'expense', description: 'Monthly rent' },
  { id: '5', date: '2026-03-20', amount: 65, category: 'Transport', type: 'expense', description: 'Uber rides' },
  { id: '6', date: '2026-03-18', amount: 200, category: 'Shopping', type: 'expense', description: 'New headphones' },
  { id: '7', date: '2026-03-15', amount: 1800, category: 'Investment', type: 'income', description: 'Dividends' },
  { id: '8', date: '2026-03-12', amount: 45, category: 'Entertainment', type: 'expense', description: 'Netflix + Spotify' },
  { id: '9', date: '2026-03-10', amount: 300, category: 'Utilities', type: 'expense', description: 'Electricity bill' },
  { id: '10', date: '2026-03-08', amount: 150, category: 'Food', type: 'expense', description: 'Restaurant dinner' },
  { id: '11', date: '2026-03-05', amount: 3200, category: 'Freelance', type: 'income', description: 'Web design project' },
  { id: '12', date: '2026-03-02', amount: 90, category: 'Health', type: 'expense', description: 'Gym membership' },
];

const defaultAdmin: StoredUser = {
  name: 'Admin',
  email: ADMIN_EMAIL,
  password: 'admin123',
  role: 'admin',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      filters: { search: '', type: 'all', sortBy: 'date', sortOrder: 'desc' },
      role: 'viewer',
      darkMode: false,
      user: null,
      users: [defaultAdmin],
      isAuthenticated: false,
      addTransaction: (t) =>
        set((state) => ({
          transactions: [{ ...t, id: crypto.randomUUID() }, ...state.transactions],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.darkMode;
          document.documentElement.classList.toggle('dark', next);
          return { darkMode: next };
        }),
      signup: (name, email, password) => {
        const { users } = get();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, error: 'An account with this email already exists.' };
        }
        const role: 'admin' | 'viewer' = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'viewer';
        const newUser: StoredUser = { name, email, password, role };
        const authUser: AuthUser = { name, email, role };
        set({ users: [...users, newUser], user: authUser, isAuthenticated: true, role });
        return { success: true };
      },
      login: (email, password) => {
        const { users } = get();
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) return false;
        set({ user: { name: found.name, email: found.email, role: found.role }, isAuthenticated: true, role: found.role });
        return true;
      },
      logout: () => set({ user: null, isAuthenticated: false, role: 'viewer' }),
    }),
    { name: 'finance-dashboard' }
  )
);
