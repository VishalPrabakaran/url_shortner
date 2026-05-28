# SHORTX Features

This document lists and documents all features the app provides in the MVP.

## User-facing features
- Signup
  - Collects email and password
  - Returns authentication token (JWT)
- Login
  - Returns JWT on success
- Dashboard
  - Lists all links created by the logged-in user
  - Search and sort links by date or clicks
- Create short link
  - Accepts original URL and optional custom alias
  - Validates URL format and alias availability
- Delete link
  - Removes link and associated visit records (soft or hard delete depending on implementation)
- Analytics drawer
  - Shows click count and recent visit entries for a selected link

## Backend features
- JWT-based authentication middleware protecting user routes
- Link generation using `nanoid` with uniqueness guarantees
- Visit recording on redirect: timestamp, user-agent, referrer, (optional IP)
- Data models with appropriate indexes (unique shortCode, owner index)

## Admin / Developer features (not in MVP)
- Bulk import/export of links
- Rate limiting on redirect endpoint
- Link expiration and scheduled cleanup

## UX details & validations
- Enforce `http://` or `https://` protocol in URLs
- Reject custom aliases containing invalid characters or reserved paths
- Display helpful error messages from API failures

## Observability
- Provide logs for redirect events and errors
- Basic metrics: requests per minute, errors

## APIs & contracts
- JSON request and response bodies
- Use standard HTTP status codes for success and errors
- Protected endpoints require `Authorization: Bearer <token>` header
