# Planning the SHORTX App

## Purpose
Build a production-ready MVP for a URL shortener with authentication, link management, and lightweight analytics. Prioritize developer-friendly setup and clear documentation for hackathon delivery.

## Goals
- User registration and JWT authentication
- Link creation with optional custom alias
- Public redirect endpoint with visit tracking
- User dashboard with link management and analytics
- Simple, testable architecture and deployable artifacts

## Scope & Milestones
1. Project scaffolding (backend + frontend) and README
2. Authentication (signup/login with JWT)
3. Link model, creation, and redirect endpoint
4. Dashboard UI and link management (create, delete)
5. Visit tracking and analytics UI
6. Testing, documentation, and deployment notes

## Data Models (high-level)
- User
  - id
  - email
  - passwordHash
  - createdAt
- Link
  - id
  - originalUrl
  - shortCode
  - ownerId
  - title
  - clicks
  - visits[] { timestamp, ua, referrer, ip }
  - createdAt

## API Endpoints (summary)
- POST /api/auth/signup — create account
- POST /api/auth/login — authenticate, return JWT
- GET /api/links — list current user's links (protected)
- POST /api/links — create a new short link (protected)
- DELETE /api/links/:id — delete a user's link (protected)
- GET /:shortCode — public redirect endpoint

## Non-functional Requirements
- Use MongoDB for persistence
- Use bcrypt for password hashing
- Use nanoid for short code generation
- JWT secrets and DB URI provided via environment variables
- CORS enabled for local development

## Risks & Mitigations
- Short code collisions: retry generation and enforce unique index.
- Open redirect abuse: validate destination URLs; optionally warn users.
- Data privacy: avoid storing sensitive headers; store only needed visit metadata.

## Next actions
- Implement auth and link models in `backend/`
- Wire API routes and controllers
- Connect frontend services to API endpoints
