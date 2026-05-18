"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/callback`
        }
      });
      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password, rememberMe });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      {/* Container: Expands to show left panel on desktop */}
      <main className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* ── Subtle Left Panel (Desktop Only) ── */}
        <div className="hidden md:flex md:w-1/2 bg-gray-50/50 p-10 flex-col justify-between border-r border-gray-100 relative">
          <div>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-12 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
              </div>
              <span className="text-2xl font-bold text-primary">
                MONIQO
              </span>
            </Link>

            <h2 className="text-3xl font-bold text-primary leading-tight mb-4">
              Your AI-powered<br />financial sanctuary.
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-8">
              Moniqo seamlessly analyzes your statements to detect hidden leaks and optimize your wealth.
            </p>
          </div>
        </div>

        {/* ── Right Panel (Form) ── */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">

          {/* Mobile Logo */}
          <Link href="/" className="flex md:hidden items-center justify-center gap-2 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
              <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              MONIQO
            </span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome back</h1>
            <p className="text-sm text-muted">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none mb-6 shadow-sm"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin text-gray-400" size={18} />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-400 font-medium">── or ──</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus-ring"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1 pb-1">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent/20"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Don't have an account?{' '}
              <Link href="/signup" className="text-accent font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer placed fixed at bottom to keep layout clean */}
      <div className="fixed bottom-6 left-0 w-full text-center pointer-events-none">
        <p className="text-xs text-muted">
          Protected by bank-grade encryption
        </p>
      </div>
    </div>
  );
}
