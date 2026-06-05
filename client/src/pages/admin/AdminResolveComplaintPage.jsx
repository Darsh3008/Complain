import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, Search, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Timeline from '../../components/Timeline';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const stepLabels = {
  registered: { label: 'Start Review', description: 'Move complaint to Under Review' },
  under_review: { label: 'Mark In Progress', description: 'Assign team and start working on it' },
  in_progress: { label: 'Mark as Resolved', description: 'Close complaint with resolution note' },
};

export default function AdminResolveComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  const fetchQueue = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/complaints/resolve-queue');
      setComplaints(data);
      setFiltered(data);
      if (selected) {
        const updated = data.find((c) => c._id === selected._id);
        setSelected(updated || null);
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  useEffect(() => {
    const paramId = searchParams.get('id');
    if (paramId && complaints.length > 0) {
      const match = complaints.find((c) => c._id === paramId || c.complaintId === paramId);
      if (match) setSelected(match);
    }
  }, [searchParams, complaints]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(complaints);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      complaints.filter(
        (c) =>
          c.complaintId.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          (c.user && typeof c.user === 'object' && c.user.name?.toLowerCase().includes(q))
      )
    );
  }, [search, complaints]);

  const handleResolve = async () => {
    if (!selected) return;
    setResolving(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.put(`/complaints/${selected._id}/resolve`, { note });
      setMessage(`Complaint ${data.complaintId} updated successfully`);
      setNote('');
      await fetchQueue();
      if (data.status === 'resolved') {
        setSelected(null);
      } else {
        setSelected(data);
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || 'Failed to update complaint');
    } finally {
      setResolving(false);
    }
  };

  const currentStep = selected ? stepLabels[selected.timeline] : null;
  const categoryName = (c) =>
    c.category && typeof c.category === 'object' ? c.category.name : c.category ?? '—';
  const userName = (c) =>
    c.user && typeof c.user === 'object' ? c.user.name : '—';

  return (
    <DashboardLayout title="Resolve Complaints" breadcrumb="Dashboard > Resolve Complaints" isAdmin>
      {error && <div className="alert-error mb-4">{error}</div>}
      {message && <div className="alert-success mb-4">{message}</div>}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Queue */}
        <div className="lg:col-span-2 surface p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-heading">Pending Queue</h2>
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
              {complaints.length} open
            </span>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
              placeholder="Search by ID, title, user..."
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-muted">No complaints to resolve</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c._id}
                  onClick={() => { setSelected(c); setNote(''); setMessage(''); }}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selected?._id === c._id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-primary">{c.complaintId}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-sm font-medium text-heading truncate">{c.title}</p>
                  <p className="text-xs text-muted mt-1">{userName(c)} · {categoryName(c)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resolve panel */}
        <div className="lg:col-span-3 surface p-6">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <Clock className="w-16 h-16 text-muted mb-4" />
              <h3 className="text-lg font-semibold text-heading mb-2">Select a Complaint</h3>
              <p className="text-muted max-w-sm">
                Choose a complaint from the queue to review and resolve it step by step.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-muted">Complaint ID</p>
                  <p className="text-lg font-bold text-primary">{selected.complaintId}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-muted">Submitted by</p>
                  <p className="text-body font-medium">{userName(selected)}</p>
                </div>
                <div>
                  <p className="text-muted">Category</p>
                  <p className="text-body font-medium">{categoryName(selected)}</p>
                </div>
                <div>
                  <p className="text-muted">Submitted on</p>
                  <p className="text-body">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted">Current stage</p>
                  <p className="text-body capitalize">{selected.timeline?.replace(/_/g, ' ') ?? '—'}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-heading mb-1">{selected.title}</h3>
                <p className="text-sm text-body">{selected.description}</p>
              </div>

              {selected.image && (
                <div className="mb-6">
                  <p className="text-sm text-muted mb-2">Attachment</p>
                  <img src={selected.image} alt="Complaint" className="rounded-lg max-h-40 object-cover" />
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-heading mb-3">Progress Timeline</h4>
                <Timeline currentTimeline={selected.timeline} statusHistory={selected.statusHistory} />
              </div>

              {currentStep && (
                <div className="border-t border-gray-100 dark:border-gray-700/50 pt-6">
                  <h4 className="text-sm font-semibold text-heading mb-1">Next Action</h4>
                  <p className="text-sm text-muted mb-4">{currentStep.description}</p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-label mb-1">
                      Resolution Note (optional)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Add a note about this action..."
                    />
                  </div>

                  <button
                    onClick={handleResolve}
                    disabled={resolving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {resolving ? 'Processing...' : currentStep.label}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
