import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Timeline from '../components/Timeline';
import StatusBadge from '../components/StatusBadge';
import ThemeToggle from '../components/ThemeToggle';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function TrackComplaintPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [complaintId, setComplaintId] = useState(searchParams.get('id') || '');
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const trackComplaint = async (id) => {
    if (!id.trim()) return;
    setError('');
    setComplaint(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/complaints/track/${id.trim()}`);
      setComplaint(data);
    } catch {
      setError('Complaint not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) trackComplaint(id);
  }, [searchParams]);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!complaintId.trim()) return;

    trackComplaint(complaintId);
  };

  const content = (
    <div className="max-w-2xl mx-auto">
      <div className="surface p-8 mb-6">
        <h2 className="text-lg font-semibold text-heading mb-4">Track Your Complaint</h2>
        <form onSubmit={handleTrack} className="flex gap-3">
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            className="input-field flex-1"
            placeholder="Enter Complaint ID (e.g. CMP-2026-1001)"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {complaint && (
        <div className="surface p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted">Complaint ID</p>
              <p className="font-semibold text-primary">{complaint.complaintId}</p>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
          <h3 className="font-semibold text-heading mb-1">{complaint.title}</h3>
          <p className="text-sm text-muted mb-6">{complaint.description}</p>
          <Timeline
            currentTimeline={complaint.timeline}
            statusHistory={complaint.statusHistory}
          />
        </div>
      )}
    </div>
  );

  if (user) {
    return (
      <DashboardLayout title="Track Complaint" breadcrumb="Dashboard > Track Complaint">
        {content}
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen page-bg py-12 px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-heading">Track Your Complaint</h1>
        <p className="text-muted mt-1">Enter your complaint ID to check status</p>
      </div>
      {content}
    </div>
  );
}
