# AI Planning Document

This file documents how AI (assistant) guided the project planning and what automated steps were taken.

## AI-driven workflow used here
1. Explore repository structure and existing README
2. Generate a comprehensive project README
3. Create `docs/` with structured artifacts: planning, features, architecture, installation, and AI planning
4. Provide actionable next steps: run servers, add .env, implement tests

## Decisions made by the assistant
- Prefer MongoDB and JWT because they are lightweight and straightforward for this stack.
- Use `nanoid` for short code generation due to its simplicity and low collision probability.
- Store minimal visit metadata to balance analytics value against privacy concerns.

## How to replicate or extend
- Use the `planning.md` as a checklist during development sprints.
- Add more detailed API docs (OpenAPI/Swagger) into `docs/` when endpoints stabilize.
- Add automated tests and CI steps (GitHub Actions) to validate builds and endpoints.

## Next recommended AI-assisted tasks
- Generate unit tests for backend controllers.
- Create end-to-end (Cypress) tests for signup → create → redirect flow.
- Auto-generate API documentation from route annotations.
