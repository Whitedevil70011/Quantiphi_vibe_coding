import React from 'react';
import './FilterBar.css';

const PRIORITIES = ['All', 'Low', 'Medium', 'High'];

export default function FilterBar({ priority, onChange }) {
  return (
    <div className="filter-bar">
      <span className="filter-label">Filter by Priority:</span>
      <div className="filter-buttons">
        {PRIORITIES.map(p => (
          <button
            key={p}
            className={`filter-btn ${priority === (p === 'All' ? '' : p) ? 'active' : ''} priority-${p.toLowerCase()}`}
            onClick={() => onChange(p === 'All' ? '' : p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
