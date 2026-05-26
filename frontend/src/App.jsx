import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardPage from './routes/DashboardPage';
import LoginPage from './routes/LoginPage';
import SignupPage from './routes/SignupPage';

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<DashboardPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}