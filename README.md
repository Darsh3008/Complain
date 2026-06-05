# ComplaintHub

Cloud-Based Complaint Management System built with the **MERN Stack** (MongoDB, Express, React, Node.js).

## Features

- **Landing Page** — Hero section, how-it-works guide
- **User Auth** — Register & login with JWT
- **User Dashboard** — Stats cards, recent complaints table
- **Register Complaint** — Form with category, description, image upload
- **Track Complaint** — Public tracking by complaint ID with timeline
- **Admin Panel** — Manage all complaints, users, categories, export reports

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React, TypeScript, Vite, Tailwind   |
| Backend  | Node.js, Express                    |
| Database | MongoDB, Mongoose                   |
| Auth     | JWT, bcryptjs                       |

## Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

## Setup

### 1. Install dependencies

```bash
npm run install-all
```

### 2. Configure environment

Copy `server/.env.example` to `server/.env` and update if needed:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/complainthub
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Seed the database (optional)

```bash
cd server
node seed.js
```

This creates demo accounts:
- **Admin:** admin@complainthub.com / admin123
- **User:** john@example.com / user123

### 4. Run the app

From the root directory:

```bash
npm install
npm run dev
```

Or run separately:

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | /api/auth/register              | Register user            |
| POST   | /api/auth/login                 | Login                    |
| GET    | /api/auth/me                    | Get current user         |
| POST   | /api/complaints                 | Submit complaint         |
| GET    | /api/complaints/my              | User's complaints        |
| GET    | /api/complaints/track/:id       | Track by complaint ID    |
| GET    | /api/complaints/stats           | Dashboard stats          |
| GET    | /api/complaints                 | All complaints (admin)   |
| PUT    | /api/complaints/:id             | Update complaint (admin) |
| DELETE | /api/complaints/:id             | Delete complaint (admin) |
| GET    | /api/categories                 | List categories          |
| GET    | /api/users                      | List users (admin)       |

## Project Structure

```
complainthub/
├── client/          # React frontend
│   └── src/
│       ├── pages/       # All page components
│       ├── components/  # Reusable UI components
│       ├── layouts/     # Dashboard layout
│       ├── context/     # Auth context
│       └── api/         # Axios instance
├── server/          # Express backend
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── middleware/  # Auth middleware
│   └── uploads/     # Uploaded images
└── package.json     # Root scripts
```
