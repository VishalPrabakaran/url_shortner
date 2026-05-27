import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardPage from './routes/DashboardPage';
import LoginPage from './routes/LoginPage';
import SignupPage from './routes/SignupPage';
// 1. IMPORT THE NEW ANALYTICS PAGE (Assumes it's in the same folder)
import AnalyticsPage from './routes/AnalyticsPage'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<DashboardPage />}
        />

        {/* 2. REGISTER THE ROUTE TO KILL THE "NO ROUTES MATCHED" WARNING */}
        <Route
          path="/analytics"
          element={<AnalyticsPage />}
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