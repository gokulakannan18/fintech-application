import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMoon, HiOutlineSun, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';

export default function Navbar() {
  const { user, darkMode, toggleDarkMode, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-card/50 backdrop-blur-xl border-b border-border">
      <div className="lg:hidden w-10" />
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        {user && (
          <span className="text-xs font-medium text-muted-foreground hidden sm:block">
            {user.email}
          </span>
        )}

        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-muted text-muted-foreground capitalize">
          {user?.role ?? 'viewer'}
        </span>

        <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-muted transition-colors">
          {darkMode ? <HiOutlineSun className="w-5 h-5 text-foreground" /> : <HiOutlineMoon className="w-5 h-5 text-foreground" />}
        </button>

        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
          <HiOutlineUser className="w-4 h-4 text-primary-foreground" />
        </div>

        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Logout">
          <HiOutlineLogout className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
