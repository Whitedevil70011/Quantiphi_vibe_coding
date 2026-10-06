const BASE = '/api';

// Tasks
export const fetchTasks = (priority = '') =>
  fetch(`${BASE}/tasks${priority ? `?priority=${priority}` : ''}`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.json();
    })
    .catch(err => {
      console.error('fetchTasks error:', err);
      return [];
    });

export const createTask = (data) =>
  fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateTask = (id, data) =>
  fetch(`${BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteTask = (id) =>
  fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' }).then(r => r.json());

// Users
export const fetchUsers = () =>
  fetch(`${BASE}/users`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.json();
    })
    .catch(err => {
      console.error('fetchUsers error:', err);
      return [];
    });

export const createUser = (data) =>
  fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteUser = (id) =>
  fetch(`${BASE}/users/${id}`, { method: 'DELETE' }).then(r => r.json());
