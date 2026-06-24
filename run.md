# Run Instructions for AR‑ART‑GALLERY

## Prerequisites
- **Node.js** (v18 or later) – includes npm.
- **MongoDB** instance (local or remote). If you don't have MongoDB installed, you can use the free tier on MongoDB Atlas.
- **Git** (optional, for cloning the repository).

## 1️⃣ Clone / Open the Project
```bash
# If you already have the folder, skip this step.
git clone <repository‑url>
cd "AR‑ART‑GALLERY"
```

## 2️⃣ Backend Setup
```bash
cd backend
# Install dependencies
npm install
```
### Environment Variables
Create a `.env` file in the `backend` folder with the following keys (adjust values as needed):
```dotenv
JWT_SECRET=your‑secret‑key
MONGO_URI=mongodb://localhost:27017/ar‑art‑gallery   # or your Atlas connection string
PORT=5000   # optional, defaults to 5000
```
### Run the Backend
```bash
# Development (auto‑restart on changes)
npm run dev   # if a dev script is defined, otherwise use:
node server.js
```
The API will be available at `http://localhost:5000` and includes a health‑check endpoint:
```
GET /api/health
```
If MongoDB is unreachable, the server falls back to an in‑memory store (useful for quick UI testing).

## 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```
### Run the Frontend Development Server
```bash
npm run dev
```
The React/Vite app will start on `http://localhost:5173` (default Vite port). It expects the backend API at `http://localhost:5000`; you can adjust the base URL in `src/config.js` if needed.

## 4️⃣ Building for Production
### Backend
```bash
# No build step required – just ensure `npm install` was run.
node server.js   # or use a process manager like pm2 in production
```
### Frontend
```bash
npm run build
# The static files are emitted to the `dist/` folder.
# You can serve them with any static server (e.g., `serve -s dist` or via the backend's Express static middleware).
```

## 5️⃣ Common Issues
- **Port conflicts** – change `PORT` in `.env` or the Vite config.
- **MongoDB connection** – verify the URI and that the service is running.
- **CORS errors** – the backend already enables CORS; ensure the frontend URL matches the allowed origins.
- **Missing environment variables** – the server will log a warning and fallback to defaults.

---
*All commands should be executed from the project root unless otherwise noted.*
