import React, { useState, useEffect } from 'react';


const EMPTY_FORM = {
  title: '',
  category: '',
  priority: 'High',
  status: 'Pending',
  assignedTo: '',
  dueDate: '',
  description: '',
};

const Model = ({ isOpen, onClose, onSave, editTask }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErr('');

      if (editTask) {
        const normalizeValue = (value, fallback) => {
          if (!value) return fallback;
          const normalized = String(value).trim().toLowerCase();
          if (normalized === 'todo' || normalized === 'pending') return 'Pending';
          if (normalized === 'in progress') return 'In Progress';
          if (normalized === 'completed') return 'Completed';
          if (normalized === 'overdue') return 'Overdue';
          if (normalized === 'high') return 'High';
          if (normalized === 'medium') return 'Medium';
          if (normalized === 'low') return 'Low';
          return fallback;
        };

        setForm({
          title: editTask.title || '',
          assignedTo: editTask.assignedTo || '',
          priority: normalizeValue(editTask.priority, 'High'),
          dueDate: editTask.dueDate || '',
          status: normalizeValue(editTask.status, 'Pending'),
          category: editTask.category || '',
          description: editTask.description || '',
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [isOpen, editTask]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setErr('');

    if (!form.title.trim()) {
      setErr('Task title is required.');
      return;
    }

    if (form.dueDate && new Date(form.dueDate) < new Date()) {
      setErr('Due date cannot be in the past.');
      return;
    }

    setLoading(true);
    try {
      await onSave(form);
      setForm(EMPTY_FORM); // reset after save
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="overlay open" onClick={handleOverlayClick}>
      <div className="modal">
        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-title">
            {editTask ? '✏️ Edit Task' : 'Task Detalis'}
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          {err && <div className="error-box">{err}</div>}

          <div className="form-row">
            <div className="form-group full">
              <label className="form-label">Task Title *</label>
              <input
                className="form-input"
                placeholder="Enter task title..."
                value={form.title}
                onChange={handleChange('title')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assignee</label>
              <input
                className="form-input"
                placeholder="Person name..."
                value={form.assignedTo}
                onChange={handleChange('assignedTo')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={form.priority}
                onChange={handleChange('priority')}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={handleChange('status')}
              >
                <option value="Pending">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                className="form-input"
                type="date"
                value={form.dueDate}
                onChange={handleChange('dueDate')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                className="form-input"
                placeholder="Design, Dev..."
                value={form.category}
                onChange={handleChange('category')} // ✅ fixed typo
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Task details..."
                value={form.description}
                onChange={handleChange('description')}
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={loading || !form.title.trim()}
          >
            {loading ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Model;