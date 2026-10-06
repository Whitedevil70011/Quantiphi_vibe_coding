import React from 'react';
import './TeamPanel.css';

export default function TeamPanel({ users, tasks, onAddUser, onDeleteUser }) {
  // Count in-progress tasks per user
  const inProgressCount = {};
  tasks.forEach(t => {
    if (t.status === 'inprogress' && t.assignedUser) {
      const uid = String(t.assignedUser._id || t.assignedUser);
      inProgressCount[uid] = (inProgressCount[uid] || 0) + 1;
    }
  });

  return (
    <div className="team-panel">
      <h3 className="team-title">👥 Team</h3>

      <div className="team-list">
        {users.map(user => {
          const count = inProgressCount[String(user._id)] || 0;
          const overloaded = count > 5;
          return (
            <div key={user._id} className="team-member">
              <span
                className={`team-avatar ${overloaded ? 'pulse-red' : ''}`}
                style={{ background: user.color }}
                title={overloaded ? `${user.name} has ${count} in-progress tasks!` : user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="team-info">
                <span className="team-name">{user.name}</span>
                <span className="team-tasks">
                  {count} in progress
                  {overloaded && <span className="overload-tag">⚠️ Overloaded</span>}
                </span>
              </div>
              <button
                className="team-delete"
                onClick={() => onDeleteUser(user._id)}
                title="Remove user"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <form
        className="add-user-form"
        onSubmit={e => {
          e.preventDefault();
          const name = e.target.name.value.trim();
          if (!name) return;
          const colors = ['#6c63ff', '#e74c3c', '#27ae60', '#f39c12', '#3498db', '#9b59b6'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          onAddUser({ name, color });
          e.target.reset();
        }}
      >
        <input name="name" placeholder="Add team member..." maxLength={30} />
        <button type="submit">+</button>
      </form>
    </div>
  );
}
