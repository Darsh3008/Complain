import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Loader, CheckCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import ComplaintsTable from '../components/ComplaintsTable';
import ComplaintViewModal from '../components/ComplaintViewModal';
import api from '../api/axios';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewComplaint, setViewComplaint] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          api.get('/complaints/stats'),
          api.get('/complaints/my'),
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

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Complaints" value={stats.total} icon={FileText} color="text-primary" bgColor="bg-primary/10" />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} color="text-amber-600" bgColor="bg-amber-50" />
        <StatsCard title="In Progress" value={stats.inProgress} icon={Loader} color="text-blue-600" bgColor="bg-blue-50" />
        <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="text-green-600" bgColor="bg-green-50" />
      </div>

      <div className="surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-heading">Recent Complaints</h2>
          <Link to="/my-complaints" className="text-sm text-primary font-medium hover:underline">
            View All
          </Link>
        </div>
        <ComplaintsTable
          complaints={complaints}
          showActions
          onView={setViewComplaint}
        />
      </div>

      {viewComplaint && (
        <ComplaintViewModal complaint={viewComplaint} onClose={() => setViewComplaint(null)} />
      )}
    </DashboardLayout>
  );
}
