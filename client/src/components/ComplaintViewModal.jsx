import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function ComplaintViewModal({ complaint, onClose, showUser = false }) {
  const navigate = useNavigate();

  const categoryName =
    complaint.category && typeof complaint.category === 'object'
      ? complaint.category.name
      : complaint.category ?? '—';
  const userName =
    complaint.user && typeof complaint.user === 'object'
      ? complaint.user.name
      : '—';

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="surface p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted">Complaint ID</p>
            <p className="font-semibold text-primary">{complaint.complaintId}</p>
          </div>
          <button onClick={onClose} className="btn-ghost" aria-label="Close">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-heading">{complaint.title}</h3>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="space-y-3 text-sm">
          {showUser && (
            <div>
              <p className="text-muted">User</p>
              <p className="text-body">{userName}</p>
            </div>
          )}
          <div>
            <p className="text-muted">Category</p>
            <p className="text-body">{categoryName}</p>
          </div>
          <div>
            <p className="text-muted">Description</p>
            <p className="text-body">{complaint.description}</p>
          </div>
          <div>
            <p className="text-muted">Submitted</p>
            <p className="text-body">{new Date(complaint.createdAt).toLocaleString()}</p>
          </div>
          {complaint.image && (
            <div>
              <p className="text-muted mb-2">Attachment</p>
              <img src={complaint.image} alt="Complaint" className="rounded-lg max-h-48 object-cover" />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              onClose();
              navigate(`/track?id=${complaint.complaintId}`);
            }}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Track Status
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-body hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
