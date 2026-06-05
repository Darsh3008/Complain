import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import ProfileMenu from '../components/ProfileMenu';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({
  children,
  title,
  breadcrumb,
  isAdmin = false,
  action,
}) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen page-bg">
      <Sidebar isAdmin={isAdmin} />
      <div className="ml-64">
        <header className="header-bar px-8 py-4 flex items-center justify-between relative z-30">
          <div>
            {breadcrumb && <p className="text-sm text-muted mb-1">{breadcrumb}</p>}
            <h1 className="text-xl font-bold text-heading">{title}</h1>
            {!isAdmin && user && (
              <p className="text-sm text-muted mt-1">
                Welcome back, {user.name} 👋
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {action}
            <ThemeToggle />
            <Link to="/notifications" className="btn-ghost relative" title="Notifications">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
            <ProfileMenu />
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
