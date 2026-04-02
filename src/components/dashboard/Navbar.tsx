import { useStore } from '@/store/useStore';
import { HiOutlineMoon, HiOutlineSun, HiOutlineUser } from 'react-icons/hi';

export default function Navbar() {
  const { role, setRole, darkMode, toggleDarkMode } = useStore();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-card/50 backdrop-blur-xl border-b border-border">
      <div className="lg:hidden w-10" /> {/* spacer for mobile hamburger */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        {/* Role switcher */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'viewer')}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {darkMode ? (
            <HiOutlineSun className="w-5 h-5 text-foreground" />
          ) : (
            <HiOutlineMoon className="w-5 h-5 text-foreground" />
          )}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
          <HiOutlineUser className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
    </header>
  );
}
