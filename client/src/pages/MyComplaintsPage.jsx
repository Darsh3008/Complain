import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import ComplaintsTable from '../components/ComplaintsTable';
import ComplaintViewModal from '../components/ComplaintViewModal';
import api from '../api/axios';

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewComplaint, setViewComplaint] = useState(null);

  useEffect(() => {
    api.get('/complaints/my')
      .then((res) => setComplaints(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Complaints" breadcrumb="Dashboard > My Complaints">
      <div className="surface p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ComplaintsTable
            complaints={complaints}
            showActions
            onView={setViewComplaint}
          />
        )}
      </div>

      {viewComplaint && (
        <ComplaintViewModal complaint={viewComplaint} onClose={() => setViewComplaint(null)} />
      )}
    </DashboardLayout>
  );
}
