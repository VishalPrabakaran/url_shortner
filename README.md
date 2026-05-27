# SHORTX URL Shortener Project Root

This project is a React single-page application built using Vite, Tailwind CSS, Recharts, and Lucide Icons. The visual design conforms to the premium Wix Studio enterprise layouts.

## Directory Structure
- **[`frontend/`](file:///c:/Users/Lenovo/Desktop/url_shorter/frontend)**: Vite + React SPA source code.
- **[`docs/`](file:///c:/Users/Lenovo/Desktop/url_shorter/docs)**: Documentation written for both developers and higher officials.

## Documentation Index
1. **[Executive Summary](file:///c:/Users/Lenovo/Desktop/url_shorter/docs/executive_summary.md)**: Product overview, Wix design system patterns, and value metrics.
2. **[Architecture Guide](file:///c:/Users/Lenovo/Desktop/url_shorter/docs/architecture.md)**: Details on structure, component hierarchy, state flow, and local fallback database.
3. **[Setup & Deployment Guide](file:///c:/Users/Lenovo/Desktop/url_shorter/docs/installation.md)**: Environment setup, dependency installation, dev running, and production building.

## Development Startup
To run the server:
```bash
cd frontend
npm install
npm run dev
```
To build for production:
```bash
cd frontend
npm run build
```
To run linting checks:
```bash
cd frontend
npm run lint
```
BACKEND:

The Auth Middleware (authMiddleware.js): A protective shield. Before a user can see their dashboard or shorten a link, this component inspects their incoming digital key (JWT Token) to verify exactly who they are.

The Link Controller (linkController.js): The dashboard brain. It handles creating random codes (using nanoid), checking if a requested custom alias is already taken, retrieving only the logged-in user's custom links, and deleting links.

The Redirect Controller (redirectController.js): The public engine. When someone hits a shortened link (like http://localhost:5000/xyz), this script looks up the code in the database, registers user details (like browser or timestamp) into the visits array, bumps the clicks counter, and automatically hands off a server-side redirect (302) straight to the original website destination.

[ React Frontend ]              [ Express Router ]             [ Controller Logic ]          [ Database Blueprint ]
  SignupPage.jsx    ───────>      authRoutes.js     ───────>    authController.js   ───────>       User.js
  LoginPage.jsx                   (/api/auth/login)               (Validates & Tokens)          (Saves encrypted data)