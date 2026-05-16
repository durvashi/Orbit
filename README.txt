 Orbit - Team Task Manager (Full-Stack)

A production-grade team task management application. Teams create projects, invite
members, assign tasks, track status on a Kanban board, and monitor progress and
overdue work from a dashboard - all with role-based access control (Admin / Member).

Built as a full-stack MERN application, deployable to Railway with MongoDB Atlas.

---

  Features

Authentication
- Signup & login with hashed passwords (bcrypt) and JWT sessions
- Choose Admin or Member role at signup

Projects & Teams
- Admins create, edit, archive, and delete projects
- Add/remove team members per project
- Project owner is always a member and cannot be removed

Tasks
- Create, edit, delete tasks within a project
- Status (To Do / In Progress / Done), priority (Low / Medium / High), assignee, due date
- Kanban-style board grouped by status
- Automatic overdue detection and highlighting

Dashboard
- Live counts: projects, total tasks, in-progress, overdue
- Completion percentage with progress bar
- Recent activity feed
- "My Tasks" view filtered to the logged-in user

Role-Based Access Control
 Action  Admin  Member 
---------
 View own projects/tasks  [yes]  [yes] 
 View all projects  [yes]  [no] 
 Create / delete projects  [yes]  [no] 
 Edit project (if owner)  [yes]  [yes] (owner only) 
 Create / update tasks  [yes]  [yes] 
 Delete a task  [yes]  Creator/owner only 
 Manage project members  [yes]  Owner only 

---

  Tech Stack

 Layer  Technology 
------
 Frontend  React 18, Vite, Material UI v5, React Router, Axios, Day.js 
 Backend  Node.js, Express 4 
 Database  MongoDB with Mongoose (schema validation + relationships) 
 Auth  JSON Web Tokens, bcryptjs 
 Deployment  Railway (single service - API serves the built React app) 

---

  Project Structure


task-manager/
├── server/                  Express + MongoDB REST API
│   └── src/
│       ├── config/db.js
│       ├── models/          User, Project, Task (validations + relationships)
│       ├── controllers/     auth, project, task, user logic
│       ├── routes/          API route definitions
│       ├── middleware/      JWT auth + RBAC + error handling
│       ├── utils/           token generator + seed script
│       └── server.js        entry point (also serves client build)
├── client/                  React + Vite + Material UI SPA
│   └── src/
│       ├── api/             axios instance with auth interceptor
│       ├── context/         AuthContext
│       ├── components/      Layout, dialogs, cards, shared UI
│       └── pages/           Login, Signup, Dashboard, Projects, etc.
├── package.json             root scripts orchestrating build/start
├── railway.json             Railway deploy config
└── nixpacks.toml            build/start phases for Railway


---

  Running Locally

 Prerequisites
- Node.js 18+
- A MongoDB database (local mongod, or a free MongoDB Atlas cluster)

 1. Configure environment
bash
cd server
cp .env.example .env

Edit server/.env and set at minimum:

MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=any-long-random-string


 2. Install dependencies
bash
 from the project root
npm run install:all


 3. (Optional) Seed demo data
bash
npm run seed

This creates:
- Admin - admin@demo.com / password123
- Member - alice@demo.com / password123
- Member - bob@demo.com / password123

 4. Run in development (two terminals)
bash
npm run dev:server    API on http://localhost:5000
npm run dev:client    Vite UI on http://localhost:5173

The Vite dev server proxies /api to the backend automatically.

 5. Or run as production locally
bash
npm run build         builds the React app
npm start             serves API + UI on http://localhost:5000


---

  Deploying to Railway (with MongoDB Atlas)

> The app is configured so a single Railway service runs everything: the
> Express server serves the API and the built React frontend.

 Step 1 - Create a MongoDB Atlas database (free)
1. Go to https://www.mongodb.com/cloud/atlas and create a free M0 cluster.
2. Under Database Access, create a database user (username + password).
3. Under Network Access, add IP 0.0.0.0/0 (allow from anywhere).
4. Click Connect → Drivers and copy the connection string. It looks like:
   
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority
   
   Replace USERNAME, PASSWORD, and add /task-manager before the ?.

 Step 2 - Push this code to GitHub
bash
cd task-manager
git init
git add .
git commit -m "Team Task Manager - full stack"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main


 Step 3 - Deploy on Railway
1. Go to https://railway.app and sign in with GitHub.
2. New Project → Deploy from GitHub repo → select your repo.
3. Railway auto-detects the build via nixpacks.toml / railway.json.
4. Open the service → Variables tab → add:
    Variable  Value 
   ------
    MONGO_URI  your Atlas connection string from Step 1 
    JWT_SECRET  a long random string 
    JWT_EXPIRE  7d 
    NODE_ENV  production 
   > Do not set PORT - Railway provides it automatically.
5. Under Settings → Networking, click Generate Domain.
6. Wait for the deploy to finish - your live URL is the generated domain.

 Step 4 - (Optional) Seed the live database
Locally, point server/.env's MONGO_URI at your Atlas string and run:
bash
npm run seed


 Step 5 - Verify
Visit your Railway URL, sign up (or use seeded demo accounts), create a
project, add tasks, and confirm everything works end to end.

---

  API Reference

All /api/projects, /api/tasks, /api/users routes require a
Authorization: Bearer <token> header.

 Auth
 Method  Endpoint  Description 
---------
 POST  /api/auth/signup  Register (name, email, password, role?) 
 POST  /api/auth/login  Login (email, password) → token 
 GET  /api/auth/me  Current user 

 Projects
 Method  Endpoint  Access 
---------
 GET  /api/projects  Any authenticated user 
 GET  /api/projects/:id  Project member / admin 
 POST  /api/projects  Admin only 
 PUT  /api/projects/:id  Owner / admin 
 DELETE  /api/projects/:id  Admin only (cascades tasks) 
 POST  /api/projects/:id/members  Owner / admin 
 DELETE  /api/projects/:id/members/:userId  Owner / admin 

 Tasks
 Method  Endpoint  Notes 
---------
 GET  /api/tasks  Filters: ?project=, ?status=, ?assignee=, ?mine=true 
 POST  /api/tasks  Project members 
 PUT  /api/tasks/:id  Project members 
 DELETE  /api/tasks/:id  Admin / owner / creator 
 GET  /api/tasks/stats/overview  Dashboard stats 

 Users / Health
 Method  Endpoint 
------
 GET  /api/users 
 GET  /api/health 

---

  Validation & Data Integrity

- Mongoose schema validation on every model (lengths, enums, email format, required fields)
- Unique email constraint with friendly duplicate-key error messages
- Passwords hashed with bcrypt, never returned in responses (select: false)
- JWT verified on every protected route; expired/invalid tokens rejected
- Deleting a project cascades to its tasks
- Project owner auto-added to members and protected from removal
- Centralized error handler with consistent JSON error shape
- Rate limiting on the API (300 requests / 15 min)

---

  Notes

- The frontend is bundled into client/dist at build time and served by the
  Express server in production, so only one Railway service is needed.
- For a stable demo, seed the database so reviewers can log in immediately with
  the demo accounts listed above.
