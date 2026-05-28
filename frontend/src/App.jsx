import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardPage from './routes/DashboardPage';
import LoginPage from './routes/LoginPage';
import SignupPage from './routes/SignupPage';
import AnalyticsPage from './routes/AnalyticsPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
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