import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  Bell,
  LogOut,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  Cloud,
  Search,
  CheckSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Sidebar({ isAdmin = false }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [resolveCount, setResolveCount] = useState(0);

  useEffect(() => {
    if (isAdmin) {
      api.get('/complaints/stats')
        .then((res) => setResolveCount(res.data.pending + res.data.inProgress))
        .catch(() => setResolveCount(0));
      return;
    }
    api.get('/complaints/stats')
      .then((res) => setNotificationCount(res.data.pending + res.data.inProgress))
      .catch(() => setNotificationCount(0));
  }, [isAdmin]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/my-complaints', label: 'My Complaints', icon: FileText },
    { to: '/register-complaint', label: 'Register Complaint', icon: PlusCircle },
    { to: '/track', label: 'Track Complaint', icon: Search },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: notificationCount || undefined },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/resolve', label: '✦ Resolve Complaints', icon: CheckSquare, badge: resolveCount || undefined },
    { to: '/admin/complaints', label: 'All Complaints', icon: FileText },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-2">
        <Cloud className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold">
          {isAdmin ? 'Complaint Panel' : 'ComplaintHub'}
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="flex-1">{link.label}</span>
            {link.badge ? (
              <span className="bg-red-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {link.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-sidebar-hover hover:text-white w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
