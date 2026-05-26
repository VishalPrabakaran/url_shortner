# INSTALLATION & QUICK START GUIDE

This guide explains how to install dependencies, run the development environment, configure production URLs, and compile the static bundle for the SHORTX URL Shortener.

---

## Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: Version 18.0.0 or higher.
- **npm**: Version 9.0.0 or higher.

---

## Local Setup Instructions

1. **Navigate to the frontend workspace**:
   Open your terminal and navigate to the project subdirectory:
   ```bash
   cd url_shorter/frontend
   ```

2. **Install dependencies**:
   Install all package files listed in `package.json` (including Tailwind v4 PostCSS helper `@tailwindcss/postcss`, Recharts, Lucide, and React dependencies):
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   Start Vite's ultra-fast hot module replacement dev environment:
   ```bash
   npm run dev
   ```
   *By default, the application will run at [http://localhost:5173](http://localhost:5173) (or the first available port).*

4. **Lint validation**:
   Run ESLint verification checks to ensure zero syntax or format problems:
   ```bash
   npm run lint
   ```

5. **Build the Production Bundle**:
   Compile the production bundle minifying chunks and optimizing styling:
   ```bash
   npm run build
   ```
   *The compiled production-ready assets will be written to the `dist/` directory.*

---

## Configuration Settings (Production API)

The backend endpoint is dynamically controlled using a standard environment variable.
To point the client directly to a live server:
1. Create a `.env` file in the `url_shorter/frontend/` folder.
2. Define the key matching your server's endpoint:
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```
If the environment file is absent or the variable is empty, the `ApiClient` falls back to the **High-Fidelity localStorage database**, seed-loading 3 premium demo links with detailed visitor analytics history.
