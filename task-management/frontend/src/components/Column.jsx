import React, { useState } from 'react';
import TaskCard from './TaskCard';
import './Column.css';

const COLUMN_META = {
  todo:       { label: 'To Do',       color: '#6c63ff' },
  inprogress: { label: 'In Progress', color: '#f39c12' },
  done:       { label: 'Done',        color: '#27ae60' },
};

export default function Column({ status, tasks, onEdit, onDelete, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const meta = COLUMN_META[status];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) onDrop(taskId, status);
  };

  return (
    <div
      className={`column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title-row">
          <span className="column-dot" style={{ background: meta.color }} />
          <h3 className="column-title">{meta.label}</h3>
        </div>
        <span className="column-count" style={{ background: meta.color }}>
          {tasks.length}
        </span>
      </div>

      <div className="column-body">
        {tasks.length === 0 && (
          <p className="column-empty">No tasks here</p>
        )}
        {tasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
}
