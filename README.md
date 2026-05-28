# SHORTX — AI Powered URL Shortener

SHORTX is a modern full-stack URL shortening platform that allows users to create, manage, and track shortened URLs with authentication and analytics support.

The application is built using React, Node.js, Express, and MongoDB with a responsive and modern dashboard interface.

---

# Features

* User Authentication (JWT)
* URL Shortening
* Custom Alias Support
* Expiry Date Support
* Copy to Clipboard
* Redirect Handling
* Click Analytics
* Recent Visit Tracking
* Responsive Dashboard
* Secure REST APIs

---

# Tech Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Frontend       | React.js, Vite, Tailwind CSS |
| Backend        | Node.js, Express.js          |
| Database       | MongoDB                      |
| Authentication | JWT                          |
| Deployment     | Vercel / Render              |

---

# Project Structure

```txt
```txt
URL_SHORTENER/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── linkController.js
│   │   └── redirectController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── link.js
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── linkRoutes.js
│   │   └── redirectRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── AnalyticsDrawer.jsx
│   │   │   ├── AuthPortal.jsx
│   │   │   ├── DeleteModal.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── LinkCard.jsx
│   │   │   ├── LinkGrid.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ShortenerForm.jsx
│   │   ├── context/
│   │   ├── routes/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── docs/
│   ├── AI_PLANNING.md
│   └── ARCHITECTURE.md
│   
├── screenshots/
│   ├── dashboard.png
│   ├── login.png
│   └── analytics.png
│
├── README.md
└── architecture.png
```
--

# Setup Instructions

## Prerequisites

* Node.js 18+
* MongoDB Atlas or Local MongoDB
* npm

---

# Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
BASE_URL=http://localhost:5000
```

Run backend server:

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Assumptions Made

* Users must authenticate before managing links.
* MongoDB is used for persistent storage.
* Analytics are limited to click counts and visit tracking.
* Expired links become inaccessible automatically.
* JWT is used for secure authentication.

---

# AI Planning Document

The application was developed using an AI-assisted workflow.

## Planning Steps

1. Defined project scope and core requirements.
2. Planned frontend and backend architecture.
3. Designed MongoDB schemas for users and links.
4. Created secure REST APIs.
5. Built responsive dashboard UI.
6. Added analytics tracking system.
7. Implemented JWT authentication.
8. Optimized frontend state management.
9. Tested redirect and analytics workflows.
10. Prepared deployment-ready structure.

## AI Tools Used

* ChatGPT
* Gemini
* GitHub Copilot
* Cursor AI

---

# Features Documentation

## Authentication

* User signup
* User login
* JWT token authorization
* Password hashing using bcrypt

## URL Management

* Create short URLs
* Custom aliases
* Delete links
* Copy short URLs

## Analytics

* Click tracking
* Recent visit records
* Creation date tracking

---

# Architecture Diagram

(Add architecture image here)

Example:

```txt
Frontend (React)
       ↓
Backend API (Express)
       ↓
MongoDB Database
```

---

# Screenshots

## Login Page

(Add screenshot)

## Dashboard

(Add screenshot)

## Analytics Section

(Add screenshot)

## Mobile Responsive UI

(Add screenshot)

---

# Sample Outputs

## Backend Logs

```bash
MongoDB Connected
Server running on port 5000
POST /api/auth/login 200
POST /api/links 201
GET /abc123 302 Redirect
```

## Database Entry

```json
{
  "originalUrl": "https://google.com",
  "shortCode": "abc123",
  "clicks": 15
}
```

---

# Demo Video

Loom / YouTube Link:

https://your-video-link.com

The video demonstrates:

* Authentication
* URL creation
* Custom aliases
* Expiry dates
* Redirect functionality
* Analytics tracking
* Responsive design

---

# Deployment Plam

## Frontend

Deploy using Vercel.

## Backend

Deploy using Render.

## Database

MongoDB Atlas Cloud Database.

---

# Future Enhancements

* QR code generation
* Advanced analytics dashboard
* Password reset
* Redis caching
* Rate limiting
* Team collaboration

---

# Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Open pull request

---

# Hackathon

This project is a part of a hackathon conducted by https://katomaran.com
