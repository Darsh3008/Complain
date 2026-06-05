import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Search, Filter } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComplaintsTable from '../../components/ComplaintsTable';
import ComplaintViewModal from '../../components/ComplaintViewModal';
import api from '../../api/axios';

export default function AdminComplaintsPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewComplaint, setViewComplaint] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/complaints', { params });
      setComplaints(data);
    } catch (err) {
      const message = err?.response?.data?.message;
      setError(message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const handleDelete = async (complaint) => {
    if (!confirm(`Delete complaint ${complaint.complaintId}?`)) return;
    setError('');
    try {
      await api.delete(`/complaints/${complaint._id}`);
      fetchComplaints();
    } catch (err) {
      const message = err?.response?.data?.message;
      setError(message || 'Failed to delete complaint');
    }
  };

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

  return (
    <DashboardLayout
      title="Complaints"
      breadcrumb="Dashboard > Complaints"
      isAdmin
      action={
        <button
          onClick={exportReport}
          disabled={complaints.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      }
    >
      <div className="surface p-4 mb-4 flex flex-wrap items-center justify-between gap-3 bg-primary/5 border-primary/20">
        <p className="text-sm text-body">To review and resolve complaints step by step, use the Resolve section.</p>
        <button
          onClick={() => navigate('/admin/resolve')}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark"
        >
          Open Resolve Section →
        </button>
      </div>

      <div className="surface p-6">
        {error && <div className="alert-error mb-4">{error}</div>}

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2 min-w-[200px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
                placeholder="Search complaints..."
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark"
            >
              Search
            </button>
          </form>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ComplaintsTable
            complaints={complaints}
            showUser
            showActions
            onView={setViewComplaint}
            onEdit={(c) => navigate(`/admin/resolve?id=${c.complaintId}`)}
            onDelete={handleDelete}
          />
        )}
      </div>

      {viewComplaint && (
        <ComplaintViewModal
          complaint={viewComplaint}
          onClose={() => setViewComplaint(null)}
          showUser
        />
      )}

    </DashboardLayout>
  );
}
