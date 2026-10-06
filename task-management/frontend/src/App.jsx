import React, { useState, useEffect } from 'react';
import Column from './components/Column';
import TaskModal from './components/TaskModal';
import TeamPanel from './components/TeamPanel';
import FilterBar from './components/FilterBar';
import { fetchTasks, createTask, updateTask, deleteTask, fetchUsers, createUser, deleteUser } from './api';
import './App.css';

const COLUMNS = ['todo', 'inprogress', 'done'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [priority, setPriority] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    Promise.all([fetchTasks(), fetchUsers()])
      .then(([t, u]) => { setTasks(t); setUsers(u); })
      .finally(() => setLoading(false));
  }, []);

  // Reload tasks when priority filter changes
  useEffect(() => {
    fetchTasks(priority).then(setTasks);
  }, [priority]);

  // ── Task handlers ──────────────────────────────────────
  const handleSaveTask = async (data) => {
    if (editingTask) {
      const updated = await updateTask(editingTask._id, data);
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
    } else {
      const created = await createTask(data);
      setTasks(prev => [...prev, created]);
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // Drop → update task status
  const handleDrop = async (taskId, newStatus) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task || task.status === newStatus) return;
    const updated = await updateTask(taskId, { status: newStatus });
    setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
  };

  // ── User handlers ──────────────────────────────────────
  const handleAddUser = async (data) => {
    const user = await createUser(data);
    setUsers(prev => [...prev, user]);
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">📋</span>
          <h1 className="header-title">Kanban Board</h1>
        </div>
        <button className="btn-new-task" onClick={() => { setEditingTask(null); setModalOpen(true); }}>
          + New Task
        </button>
      </header>

      {/* ── Filter bar ── */}
      <div className="app-filters">
        <FilterBar priority={priority} onChange={setPriority} />
      </div>

      {/* ── Main layout ── */}
      <div className="app-body">
        {/* Board */}
        <div className="board">
          {loading ? (
            <p className="loading-text">Loading tasks...</p>
          ) : (
            COLUMNS.map(status => (
              <Column
                key={status}
                status={status}
                tasks={tasks.filter(t => t.status === status)}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
                onDrop={handleDrop}
              />
            ))
          )}
        </div>

        {/* Team Panel */}
        <TeamPanel
          users={users}
          tasks={tasks}
          onAddUser={handleAddUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          users={users}
          onSave={handleSaveTask}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}
