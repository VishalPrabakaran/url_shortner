import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F9F9FA] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-400 via-teal-300 to-blue-500 opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 opacity-15 blur-3xl" />

      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0057FF] text-white shadow-sm">
            <Link2 className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#111111]">SHORTX</h2>
          <p className="mt-1.5 text-[13px] text-[#666666]">SHORTX Framework Custom Link Manager</p>
        </div>

        <Card className="p-8">
          <div className="mb-6 flex rounded-3xl border border-[#EAEAEA] bg-[#F9F9FA] p-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setShowPassword(false);
              }}
              className={`flex-1 rounded-3xl py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isLogin ? 'bg-white text-[#0057FF]' : 'text-gray-400 hover:text-[#111111]'
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
              className={`flex-1 rounded-3xl py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                !isLogin ? 'bg-white text-[#0057FF]' : 'text-gray-400 hover:text-[#111111]'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-start space-x-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-red-800">
              <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-600" />
              <div className="text-[12px] font-medium leading-relaxed">{error}</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={<Lock className="h-4 w-4" />}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-400 hover:text-[#111111] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Processing…' : isLogin ? 'Access Workspace' : 'Initialize Account'}
            </Button>
          </form>
        </Card>

        <div className="text-center text-[10px] text-gray-400 tracking-wide font-medium">
          SHORTX Framework © 2026
        </div>
      </div>
    </div>
  );
}