# Installation & Setup

This document expands the README setup steps with example commands, environment variables, and troubleshooting tips.

## Prerequisites
- Node.js >= 18
- npm (bundled with Node)
- MongoDB (local or hosted cluster)

## Backend setup
1. Change to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in `backend/` with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shortx
JWT_SECRET=replace_with_secure_secret
BASE_URL=http://localhost:5000
```

4. Start the server (development):

```bash
npm run dev
```

5. Start the server (production):

```bash
NODE_ENV=production node server.js
```

## Frontend setup
1. Change to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure API base URL if needed: edit `frontend/src/services/api.js` and set the correct `BASE_URL`.

4. Start dev server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Troubleshooting
- MongoDB connection errors: ensure `MONGO_URI` is reachable and credentials (if any) are correct.
- CORS errors: verify backend CORS middleware and that frontend origin is allowed.
- JWT auth errors: ensure `JWT_SECRET` is identical between environments and not empty.

## Quick test checklist
- Signup via frontend → verify user created in DB
- Create short link → verify link document in DB
- Visit short URL → verify redirect and visit record appended
