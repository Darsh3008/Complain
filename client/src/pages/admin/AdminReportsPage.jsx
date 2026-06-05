import { useEffect, useState } from 'react';
import { Download, FileText, Clock, Loader, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import api from '../../api/axios';

export default function AdminReportsPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/complaints/stats'),
      api.get('/complaints'),
    ])
      .then(([statsRes, complaintsRes]) => {
        setStats(statsRes.data);
        setComplaints(complaintsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const exportReport = () => {
    const csv = [
      ['ID', 'User', 'Title', 'Category', 'Status', 'Date'].join(','),
      ...complaints.map((c) =>
        [
          c.complaintId,
          c.user && typeof c.user === 'object' ? c.user.name : '',
          `"${c.title}"`,
          typeof c.category === 'object' ? c.category.name : '',
          c.status,
          new Date(c.createdAt).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complaints-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <DashboardLayout title="Reports" breadcrumb="Dashboard > Reports" isAdmin>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Reports"
      breadcrumb="Dashboard > Reports"
      isAdmin
      action={
        <button
          onClick={exportReport}
          disabled={complaints.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      }
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Complaints" value={stats.total} icon={FileText} color="text-primary" bgColor="bg-primary/10" />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} color="text-amber-600" bgColor="bg-amber-50" />
        <StatsCard title="In Progress" value={stats.inProgress} icon={Loader} color="text-blue-600" bgColor="bg-blue-50" />
        <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="text-green-600" bgColor="bg-green-50" />
      </div>

      <div className="surface p-8 text-center">
        <p className="text-muted mb-4">
          Download a full CSV report or manage complaints in detail.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={exportReport}
            disabled={complaints.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <Link
            to="/admin/complaints"
            className="px-6 py-2.5 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10"
          >
            View All Complaints
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
