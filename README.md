# CareFlow

A production-structured MERN stack task and case management system for small healthcare practices. Staff members can create and manage tasks, while admins can oversee activity and manage users.

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | React, TypeScript, Vite             |
| Backend   | Node.js, Express, TypeScript        |
| Database  | MongoDB, Mongoose                   |
| Auth      | JWT, bcrypt                         |
| Validation| Zod                                 |
| DevOps    | Docker, docker-compose, Nginx       |

## Architecture

```
careflow/
├── backend/
│   └── src/
│       ├── config/          # Environment and database config
│       ├── controllers/     # Thin request handlers
│       ├── middleware/       # Auth, authorization, validation, error handling
│       ├── models/           # Mongoose schemas (User, Task)
│       ├── routes/           # Express route definitions
│       ├── services/         # Business logic layer
│       ├── types/            # Shared TypeScript interfaces
│       ├── utils/            # AppError, asyncHandler, logger
│       ├── app.ts            # Express app setup
│       └── server.ts         # Entry point
├── frontend/
│   └── src/
│       ├── components/       # Button, Input, Modal, Badge, Layout, ProtectedRoute
│       ├── context/          # AuthContext (login, register, logout)
│       ├── pages/            # Login, Register, Dashboard, TaskDetails, TaskForm, AdminUsers
│       ├── services/         # Axios API client + service modules
│       ├── styles/           # Global CSS with design tokens
│       └── types/            # Frontend TypeScript types
├── docker-compose.yml
└── README.md
```

### Backend Layering

**Controllers → Services → Models**

Controllers are thin HTTP handlers that delegate business logic to services. Services contain all domain rules (role-based access, filtering, pagination). Models define Mongoose schemas. This separation keeps each layer testable and focused.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Docker)
- npm

### Local Development

**1. Backend**

```bash
cd backend
cp .env.example .env    # Edit with your settings
npm install
npm run dev             # Starts on http://localhost:5000
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev             # Starts on http://localhost:5173
```

### Docker

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## API Endpoints

### Auth

| Method | Endpoint            | Description          | Auth     |
| ------ | ------------------- | -------------------- | -------- |
| POST   | `/api/auth/register`| Register new user    | Public   |
| POST   | `/api/auth/login`   | Login                | Public   |
| GET    | `/api/auth/me`      | Get current user     | Required |

### Tasks

| Method | Endpoint            | Description          | Auth     |
| ------ | ------------------- | -------------------- | -------- |
| GET    | `/api/tasks`        | List tasks (paginated)| Required |
| GET    | `/api/tasks/:id`    | Get task by ID       | Required |
| POST   | `/api/tasks`        | Create task          | Required |
| PUT    | `/api/tasks/:id`    | Update task          | Required |
| DELETE | `/api/tasks/:id`    | Delete task          | Admin    |

**Query Parameters** for `GET /api/tasks`:
- `page` – Page number (default: 1)
- `limit` – Items per page (default: 10)
- `status` – Filter by status: `open`, `in_progress`, `done`
- `priority` – Filter by priority: `low`, `medium`, `high`
- `search` – Search by title

### Users (Admin Only)

| Method | Endpoint                | Description       | Auth  |
| ------ | ----------------------- | ----------------- | ----- |
| GET    | `/api/users`            | List all users    | Admin |
| GET    | `/api/users/:id`        | Get user by ID    | Admin |
| PUT    | `/api/users/:id/role`   | Update user role  | Admin |
| DELETE | `/api/users/:id`        | Delete user       | Admin |

### Health Check

```
GET /api/health
```

## Access Rules

- **Admin**: Can see all tasks, delete tasks, manage users
- **Staff**: Can only see tasks assigned to them or created by them

## Environment Variables

### Backend (`backend/.env`)

| Variable              | Description                 | Default                       |
| --------------------- | --------------------------- | ----------------------------- |
| `PORT`                | Server port                 | `5000`                        |
| `NODE_ENV`            | Environment                 | `development`                 |
| `MONGO_URI`           | MongoDB connection string   | `mongodb://localhost:27017/careflow` |
| `JWT_SECRET`          | JWT signing secret          | –                             |
| `JWT_EXPIRE`          | Token expiration            | `7d`                          |
| `CORS_ORIGIN`         | Allowed CORS origin         | `http://localhost:5173`       |
| `RATE_LIMIT_WINDOW_MS`| Rate limit window (ms)     | `900000`                      |
| `RATE_LIMIT_MAX`      | Max requests per window     | `20`                          |

### Frontend (`frontend/.env`)

| Variable         | Description     | Default                          |
| ---------------- | --------------- | -------------------------------- |
| `VITE_API_URL`   | Backend API URL | `http://localhost:5000/api`      |

## License

MIT
