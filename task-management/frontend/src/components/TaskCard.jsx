import React from 'react';
import './TaskCard.css';

const PRIORITY_COLORS = { Low: '#27ae60', Medium: '#f39c12', High: '#e74c3c' };

export default function TaskCard({ task, onEdit, onDelete, onDragStart }) {
  const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
    >
      <div className="task-card-header">
        <span
          className="priority-badge"
          style={{ background: PRIORITY_COLORS[task.priority] }}
        >
          {task.priority}
        </span>
        <div className="task-card-actions">
          <button className="icon-btn" onClick={() => onEdit(task)} title="Edit">✏️</button>
          <button className="icon-btn" onClick={() => onDelete(task._id)} title="Delete">🗑️</button>
        </div>
      </div>

      <h4 className="task-title">{task.title}</h4>
      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-card-footer">
        {due && (
          <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
            📅 {due}
          </span>
        )}
        {task.assignedUser && (
          <span
            className="task-avatar"
            style={{ background: task.assignedUser.color || '#6c63ff' }}
            title={task.assignedUser.name}
          >
            {task.assignedUser.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
