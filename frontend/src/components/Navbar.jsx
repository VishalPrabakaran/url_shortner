import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Search, Globe, LogOut, Link2, User, ChevronDown } from 'lucide-react';

export default function Navbar({ searchTerm, setSearchTerm }) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const formatDate = (value) => {
    if (!value) return 'Unknown';
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAEAEA] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-1 sm:gap-4">

        <div className="flex items-center space-x-2 sm:space-x-6 min-w-0">
          <Link to="/" className="flex shrink-0 items-center space-x-1">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0057FF] text-white shadow-sm">
              <Link2 className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="text-sm sm:text-lg font-extrabold tracking-tight text-[#111111] hover:opacity-85 transition-opacity hidden xs:inline-block">
              SHORTX
            </span>
          </Link>

          <nav className="flex items-center space-x-2 sm:space-x-4 text-[11px] sm:text-[13px] font-bold text-[#666666]">
            {[
              { label: 'Dashboard', path: '/' },
              { label: 'Analytics', path: '/analytics' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`relative py-1 transition-colors duration-200 shrink-0 ${
                  isActive(item.path)
                    ? 'text-[#0057FF] after:w-full'
                    : 'hover:text-[#111111] after:w-0'
                } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#0057FF] hover:after:w-full after:transition-all after:duration-300`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-4 shrink-0">
          {user && (
            <div className="relative hidden sm:block w-36 md:w-48 lg:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                <Search className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-[#EAEAEA] bg-[#F9F9FA] py-1 pl-8 pr-2.5 text-[12px] text-[#111111] placeholder-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none"
              />
            </div>
          )}

          <button
            type="button"
            aria-label="Language Selector"
            className="flex items-center space-x-1 p-1 text-gray-500 hover:bg-gray-50 hover:text-[#111111] transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden lg:inline text-[12px] font-medium">EN</span>
          </button>

          <span className="h-4 w-px bg-gray-200 hidden sm:block"></span>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center space-x-2 rounded-md border border-[#EAEAEA] bg-white px-3 py-1.5 text-sm text-[#111111] hover:bg-gray-50 transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0057FF] text-white">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[#EAEAEA] bg-white shadow-lg p-4 text-sm">
                  <div className="mb-3 border-b border-[#F3F4F6] pb-3">
                    <p className="text-xs uppercase tracking-wider text-gray-400">Profile</p>
                    <p className="mt-2 text-[13px] font-semibold text-[#111111] break-all">{user.email}</p>
                    <p className="mt-1 text-[12px] text-[#666666]">Joined: {formatDate(user.createdAt)}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-md bg-[#111111] px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#333333]"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Link to="/login" className="rounded-md px-2 py-1 text-[11px] sm:text-[12px] font-bold text-[#666666] hover:text-[#111111] transition-colors">
                Login
              </Link>
              <Link to="/signup" className="rounded-md bg-[#0057FF] px-2.5 py-1 text-[11px] sm:text-[12px] font-bold text-white hover:bg-[#0046CC] transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}