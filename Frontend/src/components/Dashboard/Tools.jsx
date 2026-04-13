import React from 'react';

const Tools = ({
  search,
  onSearch,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
}) => {
  return (
    <div className="toolbar">
      {/* 🔍 Search */}
      <input
        className="search-input"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      {/* 📊 Status Filter */}
      <select
        className="filter-select"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Pending">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Overdue">Overdue</option>
      </select>

      {/* ⚡ Priority Filter */}
      <select
        className="filter-select"
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
      >
        <option value="">All Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

    </div>
  );
};

export default Tools;