import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../api/axios';

const statusMessages = {
  pending: 'is pending review',
  in_progress: 'is now in progress',
  resolved: 'has been resolved',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/complaints/my')
      .then((res) => {
        const notifs = res.data.map((c) => ({
          id: c._id,
          complaintId: c.complaintId,
          message: `Your complaint ${c.complaintId} (${c.title}) ${statusMessages[c.status] || 'was updated'}`,
          time: new Date(c.updatedAt).toLocaleString(),
        }));
        setNotifications(notifs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Notifications" breadcrumb="Dashboard > Notifications">
      <div className="surface">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-muted py-12">No notifications yet</p>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => navigate(`/track?id=${notif.complaintId}`)}
              className="flex items-start gap-4 p-5 border-b border-gray-50 dark:border-gray-700/30 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 w-full text-left"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-body">{notif.message}</p>
                <p className="text-xs text-muted mt-1">{notif.time}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
