import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9FA] px-4 text-center">
        <div className="rounded-3xl border border-[#EAEAEA] bg-white px-8 py-10 shadow-sm">
          <p className="text-sm font-semibold text-[#111111]">Loading your session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
