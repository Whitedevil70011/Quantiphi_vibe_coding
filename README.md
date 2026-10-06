# 📋 Kanban Board - Task Management Application

A full-stack Task Management Kanban web application built with **React**, **Node.js/Express**, and **PostgreSQL (Neon Cloud)** with custom CSS styling and real-time workload burnout indicators.

---

## 🚀 Features

- **3-Stage Kanban Workflow**: 
  - 🟣 `To Do`
  - 🟠 `In Progress`
  - 🟢 `Done`
- **Drag-and-Drop Interaction**: Move tasks effortlessly between columns using native HTML5 drag-and-drop.
- **Full Task CRUD**:
  - Title, description, priority (`Low`, `Medium`, `High`), due date (with overdue highlights), and assigned team member.
- **Priority Filter**: Instant filtering by priority (`All`, `Low`, `Medium`, `High`).
- **Team Workload Balancing ("Burnout Warning")**:
  - Displays team members and their active *In Progress* tasks count.
  - **Pulsing Red Avatar**: If any team member has **more than 5 tasks in "In Progress"**, their avatar pulses red to signal overload and potential burnout.
- **Relational PostgreSQL Backend**: Foreign key relationship linking tasks to assigned team users with automated table schema initialization.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Vanilla CSS (clean, responsive, glassmorphism UI)
- **Backend**: Node.js, Express.js, `pg` (PostgreSQL client), CORS, dotenv
- **Database**: PostgreSQL / [Neon Serverless Postgres](https://neon.tech/)

---

## 📁 Project Structure

```
├── backend/
│   ├── db.js                 # PostgreSQL Pool connection & auto-table init
│   ├── routes/
│   │   ├── tasks.js          # Task CRUD endpoints with SQL JOINs
│   │   └── users.js          # User management endpoints
│   ├── server.js             # Express app entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
├── task-management/
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Column.jsx & Column.css       # Column with drag/drop handlers
│       │   │   ├── TaskCard.jsx & TaskCard.css   # Draggable card & priority badge
│       │   │   ├── TaskModal.jsx & TaskModal.css # Create/edit task modal
│       │   │   ├── TeamPanel.jsx & TeamPanel.css # Team list & red pulse overload
│       │   │   └── FilterBar.jsx & FilterBar.css # Priority filter buttons
│       │   ├── api.js        # Central API service
│       │   ├── App.jsx       # State management & board layout
│       │   └── App.css       # Global styles & responsive layout
│       ├── vite.config.js    # Vite proxy configuration
│       └── package.json
├── neon.ts                   # Neon Infrastructure-as-Code config
├── .gitignore                # Git ignore rules for clean commits
└── README.md
```

---

## 🏃 How to Run Locally

### Prerequisites
- **Node.js** (v18 or newer)
- A **PostgreSQL database URL** (e.g. from [Neon.tech](https://neon.tech/), Supabase, or local Postgres)

---

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd quantiphi
```

---

### Step 2: Configure & Start the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file inside `backend/`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@ep-host.region.aws.neon.tech/neondb?sslmode=require
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000` and automatically initialize the `users` and `tasks` relational tables.*

---

### Step 3: Start the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd task-management/frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🔌 API Endpoints

### Tasks (`/api/tasks`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks (supports `?priority=High`) |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id` | Update task fields / status |
| `DELETE` | `/api/tasks/:id` | Delete task by ID |

### Users (`/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Fetch all team members |
| `POST` | `/api/users` | Add a new team member |
| `DELETE` | `/api/users/:id` | Remove a team member |
