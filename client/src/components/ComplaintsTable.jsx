import { Eye, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ComplaintsTable({
  complaints = [],
  showUser = false,
  showActions = false,
  onView,
  onEdit,
  onDelete,
}) {
  const columnCount = 5 + (showUser ? 1 : 0) + (showActions ? 1 : 0);

  const getCategoryName = (complaint) =>
    complaint.category && typeof complaint.category === 'object'
      ? complaint.category.name
      : complaint.category ?? '—';

  const getUserName = (complaint) =>
    complaint.user && typeof complaint.user === 'object'
      ? complaint.user.name
      : '—';

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="table-head">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted">ID</th>
            {showUser && <th className="text-left py-3 px-4 text-sm font-medium text-muted">User</th>}
            <th className="text-left py-3 px-4 text-sm font-medium text-muted">Title</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted">Category</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted">Date</th>
            {showActions && <th className="text-left py-3 px-4 text-sm font-medium text-muted">Action</th>}
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="text-center py-8 text-muted">
                No complaints found
              </td>
            </tr>
          ) : (
            complaints.map((complaint) => (
              <tr key={complaint._id} className="table-row">
                <td className="py-3 px-4 text-sm font-medium text-primary">{complaint.complaintId}</td>
                {showUser && <td className="py-3 px-4 text-sm text-body">{getUserName(complaint)}</td>}
                <td className="py-3 px-4 text-sm text-body">{complaint.title}</td>
                <td className="py-3 px-4 text-sm text-muted">{getCategoryName(complaint)}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={complaint.status} />
                </td>
                <td className="py-3 px-4 text-sm text-muted">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
                {showActions && (
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(complaint)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(complaint)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(complaint)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
