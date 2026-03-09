// src/pages/Login.tsx
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: boolean; password?: boolean }>({});

  // Already logged in — redirect
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-400 text-lg">Loading…</div>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic checks
    const errors: { email?: boolean; password?: boolean } = {};
    if (!email.trim()) errors.email = true;
    if (!password) errors.password = true;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message?.toLowerCase().includes('invalid')) {
          toast.error('Incorrect email or password.');
          setFieldErrors({ email: true, password: true });
        } else if (error.message?.toLowerCase().includes('email not confirmed')) {
          toast.error('Please verify your email first.');
        } else {
          toast.error('Something went wrong. Please try again.');
        }
        console.error('Login error:', error);
      }
      // On success, onAuthStateChange in useAuth will update session → Navigate triggers
    } catch (err) {
      toast.error('No connection. Please check your internet.');
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-700 text-white p-3 rounded-xl mb-3">
            <Dumbbell size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SpeedyFit</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome back</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: false }));
              }}
              className={`w-full min-h-12 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                fieldErrors.email ? 'border-red-400' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: false }));
                }}
                className={`w-full min-h-12 px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.password ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-12 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
