import React from 'react';
import { av, ini, priorityBadge, statusBadge } from '../../utils/Helper';
import { useToast } from '../../Context/ToastContext';

const Table = ({ tasks, onEdit, onDelete, loading }) => {
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="table-wrap">
        <div className="empty">
          <div className="empty-icon">⏳</div>
          <div>Loading Tasks...</div>
        </div>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Task Title</th>
              <th>Task ID</th>
              <th>Category</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7">
                <div className="empty">
                  <div className="empty-icon">📋</div>
                  <div>
                    No tasks added. Click "+ ADD TASK" to create one!
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
          <thead>
            <tr>
              <th>#</th>
              <th>TASK TITLE</th>
              <th>ASSIGNEE</th>
              <th>PRIORITY</th>
              <th>DUE DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
        <tbody>
          {Array.isArray(tasks) && tasks.map((t, i) => {
            const [bg, col] = av(i);
            return (
              <tr key={t.id || t._id}>
                <td style={{ color: 'var(--muted)', fontWeight: 600 }}>
                  {i + 1}
                </td>

                <td>
                  <span
                    className="av"
                    style={{ background: bg, color: col }}
                  >
                    {ini(t.title)}
                  </span>
                  <strong>{t.title}</strong> <small>({t.category || 'General'})</small>
                </td>

                <td style={{ color: 'var(--muted)' }}>
                  {t.assignedTo?.name || t.assignedTo || '—'}
                </td>

                <td>
                  <span className={`badge ${priorityBadge(t.priority)}`}>
                    {t.priority || '—'}
                  </span>
                </td>

                <td style={{ color: 'var(--muted)' }}>
                  {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}
                </td>

                <td>
                  <span className={`badge ${statusBadge(t.status)}`}>
                    {t.status || 'Pending'}
                  </span>
                </td>

                <td>
                  <div className="actions">
                    <button
                      className="ab ab-v"
                      onClick={() =>
                        toast(`${t.title} | ${t.description || 'No description'}`)
                      }
                    >
                      View
                    </button>

                    <button
                      className="ab ab-e"
                      onClick={() => onEdit(t)}
                    >
                      Edit
                    </button>

                    <button
                      className="ab ab-d"
                      onClick={() => onDelete(t)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            );
          }
        )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;