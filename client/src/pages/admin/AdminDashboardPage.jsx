import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Loader, CheckCircle, ArrowRight, CheckSquare } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import ComplaintsTable from '../../components/ComplaintsTable';
import api from '../../api/axios';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          api.get('/complaints/stats'),
          api.get('/complaints'),
        ]);
        setStats(statsRes.data);
        setComplaints(complaintsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openCount = stats.pending + stats.inProgress;

  return (
    <DashboardLayout title="Admin Panel" breadcrumb="Dashboard" isAdmin>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Resolve Complaints — prominent section */}
          <div className="surface p-6 mb-8 border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-heading">Resolve Complaints</h2>
                  <p className="text-sm text-muted">
                    {openCount > 0
                      ? `${openCount} complaint${openCount > 1 ? 's' : ''} waiting to be reviewed and resolved`
                      : 'All complaints are resolved — great job!'}
                  </p>
                </div>
              </div>
              <Link
                to="/admin/resolve"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Go to Resolve Section
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Complaints" value={stats.total} icon={FileText} color="text-primary" bgColor="bg-primary/10" />
            <StatsCard title="Pending" value={stats.pending} icon={Clock} color="text-amber-600" bgColor="bg-amber-50" />
            <StatsCard title="In Progress" value={stats.inProgress} icon={Loader} color="text-blue-600" bgColor="bg-blue-50" />
            <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="text-green-600" bgColor="bg-green-50" />
          </div>

          <div className="surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-heading">Recent Complaints</h2>
              <Link to="/admin/resolve" className="text-sm text-primary font-medium hover:underline">
                Resolve Complaints →
              </Link>
            </div>
            <ComplaintsTable complaints={complaints} showUser />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
