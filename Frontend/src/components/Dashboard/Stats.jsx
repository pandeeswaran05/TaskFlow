import React from 'react';
import { calcTaskProgress } from '../../utils/Helper';

const Stats = ({ tasks }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const total = safeTasks.length;

  const inProgress = safeTasks.filter(
    (t) => t && t.status && t.status.toLowerCase() === 'in progress'
  ).length;

  const completed = safeTasks.filter(
    (t) => t?.status?.toLowerCase() === 'completed'
  ).length;

  const overdue = safeTasks.filter((t) => {
    if (!t) return false;
    // Check status is 'Overdue' OR dueDate has passed and status is not 'Completed'
    const statusOverdue = t.status && t.status.toLowerCase() === 'overdue';
    const datePassed = t.dueDate && new Date(t.dueDate) < new Date();
    const notCompleted = t.status && t.status.toLowerCase() !== 'completed';
    return statusOverdue || (datePassed && notCompleted);
  }).length;

  const avgGrade = calcTaskProgress(safeTasks);

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Total Tasks</div>
        <div className="stat-value" style={{ color: '#4d1672' }}>
          {total}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">In Progress</div>
        <div className="stat-value" style={{ color: '#4a1d9e' }}>
          {inProgress}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">COMPLETED</div>
        <div className="stat-value" style={{ color: '#185FA5' }}>
          {completed}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">OVERDUE</div>
        <div className="stat-value" style={{ color: '#D85A30' }}>
          {overdue}
        </div>
      </div>
    </div>
  );
};

export default Stats;