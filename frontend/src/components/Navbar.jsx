import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

import {
  Search,
  Globe,
  LogOut,
  Link2,
} from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
}) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  // Handle Logout + Redirect
  const handleLogout = async () => {
    try {
      await logout();

      // Redirect to login page
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAEAEA] bg-white/95 backdrop-blur-sm">
      
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LEFT SIDE */}
        <div className="flex items-center space-x-8">

          {/* Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0057FF] text-white shadow-sm">
              <Link2 className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>

            <span className="text-lg font-extrabold tracking-tight text-[#111111] hover:opacity-85 transition-opacity">
              SHORTX
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-[13px] font-medium text-[#666666]">

            {[
              {
                label: 'Dashboard',
                path: '/',
              },
              {
                label: 'Analytics',
                path: '/analytics',
              },
              {
                label: 'Pricing',
                path: '/pricing',
              },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="relative py-1 hover:text-[#111111] transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#0057FF] hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </Link>
            ))}

          </nav>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-4">

          {/* Search */}
          {user && (
            <div className="relative hidden sm:block w-48 lg:w-64">

              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-3.5 w-3.5 text-gray-400" />
              </div>

              <input
                type="text"
                placeholder="Search directory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-[#EAEAEA] bg-[#F9F9FA] py-1.5 pl-9 pr-3 text-[13px] text-[#111111] placeholder-gray-400 transition-all duration-200 focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
          )}

          {/* Language */}
          <button
            type="button"
            aria-label="Language Selector"
            className="flex items-center space-x-1.5 rounded-md p-1.5 text-gray-500 hover:bg-gray-50 hover:text-[#111111] transition-colors"
          >
            <Globe className="h-4 w-4" />

            <span className="hidden lg:inline text-[12px] font-medium">
              EN
            </span>
          </button>

          {/* Divider */}
          <span className="h-5 w-px bg-gray-200"></span>

          {/* AUTH SECTION */}
          {user ? (
            <div className="flex items-center space-x-3">

              {/* User Info */}
              <div className="hidden xl:flex flex-col text-right">

                <span className="text-[11px] font-bold text-[#111111] leading-none">
                  {user?.name || 'MEMBER'}
                </span>

                <span className="text-[9px] text-[#666666] leading-none mt-0.5">
                  {user?.role || 'Enterprise'}
                </span>

              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 rounded-md border border-[#111111] bg-[#111111] px-3.5 py-1.5 text-[12px] font-semibold text-white transition-all duration-200 hover:bg-white hover:text-[#111111]"
              >
                <LogOut className="h-3.5 w-3.5" />

                <span>Sign Out</span>
              </button>

            </div>
          ) : (
            <div className="flex items-center space-x-2">

              {/* Login */}
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 text-[12px] font-semibold text-[#666666] hover:text-[#111111] transition-colors"
              >
                Login
              </Link>

              {/* Signup */}
              <Link
                to="/signup"
                className="rounded-md bg-[#0057FF] px-3.5 py-1.5 text-[12px] font-semibold text-white hover:bg-[#0046CC] transition-colors"
              >
                Sign Up
              </Link>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}