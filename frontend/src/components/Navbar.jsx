import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Search, Globe, LogOut, Link2 } from 'lucide-react';

export default function Navbar({ searchTerm, setSearchTerm }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAEAEA] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-1 sm:gap-4">

        {/* LEFT SIDE: Brand & Navigation Links */}
        <div className="flex items-center space-x-2 sm:space-x-6 min-w-0">
          {/* Brand */}
          <Link to="/" className="flex shrink-0 items-center space-x-1">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0057FF] text-white shadow-sm">
              <Link2 className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="text-sm sm:text-lg font-extrabold tracking-tight text-[#111111] hover:opacity-85 transition-opacity hidden xs:inline-block">
              SHORTX
            </span>
          </Link>

          {/* Navigation - Ultra Compact & Smooth on Mobile */}
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

        {/* RIGHT SIDE: Utilities & Session Controls */}
        <div className="flex items-center space-x-1 sm:space-x-4 shrink-0">
          {/* Search Input */}
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

          {/* Language Selector */}
          <button
            type="button"
            aria-label="Language Selector"
            className="flex items-center space-x-1 p-1 text-gray-500 hover:bg-gray-50 hover:text-[#111111] transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden lg:inline text-[12px] font-medium">EN</span>
          </button>

          <span className="h-4 w-px bg-gray-200 hidden sm:block"></span>

          {/* AUTH SECTION */}
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="hidden xl:flex flex-col text-right">
                <span className="text-[11px] font-bold text-[#111111] leading-none">
                  {user?.name || 'MEMBER'}
                </span>
                <span className="text-[9px] text-[#666666] leading-none mt-0.5">
                  {user?.role || 'Enterprise'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 rounded-md border border-[#111111] bg-[#111111] px-2 py-1 text-[11px] font-semibold text-white transition-all duration-200 hover:bg-white hover:text-[#111111]"
              >
                <LogOut className="h-3 w-3" />
                <span>Sign Out</span>
              </button>
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