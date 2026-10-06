const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDB } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.send('PostgreSQL Kanban API running'));

const PORT = process.env.PORT || 5000;

// Initialize Postgres tables and then start server
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running with PostgreSQL on port ${PORT}`));
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
