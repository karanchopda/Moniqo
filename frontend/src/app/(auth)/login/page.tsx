"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import GoogleIcon from '@/components/ui/GoogleIcon';
import { InlineLoader } from '@/components/ui/GlobalLoader';
import api from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel';
import MoniqoLogo from '@/components/ui/MoniqoLogo';
import { getErrorMessage } from '@/lib/error';

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
      setError(getErrorMessage(err, 'Google sign in failed'));
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
      setError(getErrorMessage(err, 'Login failed'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ── Left branding panel (hidden on mobile/tablet) ── */}
      <AuthLeftPanel />

      {/* ── Right form panel ── */}
      <main className="w-full lg:w-[52%] flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-20 xl:px-28 relative">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="inline-block">
              <MoniqoLogo size="md" />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-9">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#121c2d] mb-2.5">
              Welcome Back
            </h1>
            <p className="text-sm font-semibold text-[#526176] leading-relaxed">
              Access your private portal to manage your global assets.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm text-center border border-red-100 font-semibold">
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-[#dfe6e2] rounded-lg text-sm font-bold text-[#1a2b22] hover:bg-[#fbfcfb] active:scale-[0.99] transition-all hover:border-[#cbd4d0] shadow-[0_1px_2px_rgba(15,23,42,0.02)] disabled:opacity-70 disabled:pointer-events-none mb-6 cursor-pointer"
          >
            {googleLoading ? (
              <InlineLoader label="" />
            ) : (
              <GoogleIcon size={20} />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-grow h-[1px] bg-[#edf1ef]"></div>
            <span className="px-4 text-[10px] font-mono tracking-[0.25em] text-[#8a98a4] font-black uppercase">
              OR EMAIL ACCESS
            </span>
            <div className="flex-grow h-[1px] bg-[#edf1ef]"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-mono tracking-[0.2em] font-black text-[#1a2b22] uppercase block">
                EMAIL ADDRESS
              </label>
              <div className="relative rounded-lg overflow-hidden bg-[#f1f4f2]/70 border border-transparent focus-within:border-[#3fc580]/40 focus-within:bg-[#f1f4f2]/90 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d8b87]">
                  <Mail size={18} className="stroke-[2]" />
                </div>
                <input
                  id="email"
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-sm text-[#121c2d] placeholder-[#a3adab] outline-none font-bold"
                  placeholder="julian.thorne@private.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[10px] font-mono tracking-[0.2em] font-black text-[#1a2b22] uppercase">
                  SECURITY PASSWORD
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-mono tracking-wider font-extrabold text-[#3fc580] hover:underline uppercase"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-[#f1f4f2]/70 border border-transparent focus-within:border-[#3fc580]/40 focus-within:bg-[#f1f4f2]/90 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d8b87]">
                  <Lock size={18} className="stroke-[2]" />
                </div>
                <input
                  id="password"
                  className="w-full bg-transparent py-4 pl-12 pr-12 text-sm text-[#121c2d] placeholder-[#a3adab] outline-none font-bold"
                  placeholder="••••••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7d8b87] hover:text-[#121c2d] transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} className="stroke-[2]" /> : <Eye size={18} className="stroke-[2]" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 pt-1 pb-1">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#dfe6e2] text-[#3fc580] focus:ring-[#3fc580]/20 bg-white cursor-pointer accent-[#093d27]"
              />
              <label htmlFor="rememberMe" className="text-xs text-[#52615c] font-bold cursor-pointer select-none">
                Keep me authenticated for 30 days
              </label>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-[#093d27] hover:bg-[#062c1c] active:scale-[0.99] text-white rounded-lg text-sm font-black transition-all shadow-[0_4px_12px_rgba(9,61,39,0.15)] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              type="submit"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <InlineLoader label="Entering Sanctuary…" light />
                </>
              ) : (
                <>
                  Sign In to Sanctuary
                  <ArrowRight size={16} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#edf1ef] pt-6">
            <p className="text-xs text-[#52615c] font-bold">
              New to the elite network?
              <Link href="/signup" className="text-[#3fc580] font-black hover:underline ml-1.5">
               Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
