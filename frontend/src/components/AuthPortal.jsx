import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

import {
  Mail,
  Lock,
  Link2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AuthPortal() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all email and password fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-wix-grid relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F9F9FA] px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative Background */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-400 via-teal-300 to-blue-500 opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 opacity-15 blur-3xl" />

      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-[#0057FF] text-white shadow-sm">
            <Link2 className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#111111]">
            SHORTX
          </h2>
          <p className="mt-1.5 text-[13px] text-[#666666]">
            SHORTX Framework Custom Link Manager
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-lg border border-[#EAEAEA] bg-white p-8 shadow-sm">
          {/* Tabs */}
          <div className="mb-6 flex border-b border-[#EAEAEA]">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setShowPassword(false);
              }}
              className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isLogin
                  ? 'border-b-2 border-[#0057FF] text-[#0057FF]'
                  : 'text-gray-400 hover:text-[#111111]'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setShowPassword(false);
              }}
              className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                !isLogin
                  ? 'border-b-2 border-[#0057FF] text-[#0057FF]'
                  : 'text-gray-400 hover:text-[#111111]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-start space-x-2.5 rounded-md border border-red-200 bg-red-50 p-3.5 text-red-800">
              <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-600" />
              <div className="text-[12px] font-medium leading-relaxed">
                {error}
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-md border border-[#EAEAEA] bg-[#F9F9FA] py-2 pl-9 pr-3 text-[13px] text-[#111111] placeholder-gray-400 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field with Hide/Show Eye Icon Toggle */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[#EAEAEA] bg-[#F9F9FA] py-2 pl-9 pr-10 text-[13px] text-[#111111] placeholder-gray-400 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#111111] transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-[#666666]">
                Must be at least 6 characters.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-md bg-[#0057FF] py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#0046CC] disabled:opacity-70 focus:outline-none"
            >
              {loading ? 'Processing...' : (isLogin ? 'Access Workspace' : 'Initialize Account')}
            </button>
          </form>
        </div>

        {/* Footer Minimal Branding */}
        <div className="text-center text-[10px] text-gray-400 tracking-wide font-medium">
          SHORTX Framework © 2026
        </div>
      </div>
    </div>
  );
}