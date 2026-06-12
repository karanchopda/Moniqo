"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import GoogleIcon from '@/components/ui/GoogleIcon';
import { InlineLoader } from '@/components/ui/GlobalLoader';
import api, { twoFactorApi } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import { storeAuthResponse } from '@/lib/auth';
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
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [totpCode, setTotpCode] = useState('');
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
      if (res.data.requires2FA) {
        setRequires2FA(true);
        setTempToken(res.data.tempToken);
        setLoading(false);
        return;
      }
      storeAuthResponse(res.data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Login failed'));
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await twoFactorApi.verifyLogin({ tempToken, code: totpCode });
      storeAuthResponse(res.data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Invalid verification code'));
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
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark mb-2.5">
              {requires2FA ? 'Two-Factor Authentication' : 'Welcome Back'}
            </h1>
            <p className="text-sm font-semibold text-brand-text-muted leading-relaxed">
              {requires2FA
                ? 'Enter the 6-digit code from your authenticator app.'
                : 'Sign in to your Moniqo account.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm text-center border border-red-100 font-semibold">
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          {!requires2FA && (
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-brand-border rounded-lg text-sm font-bold text-brand-text-green-dark hover:bg-brand-bg-light active:scale-[0.99] transition-all hover:border-brand-border-hover shadow-[0_1px_2px_rgba(15,23,42,0.02)] disabled:opacity-70 disabled:pointer-events-none mb-6 cursor-pointer"
          >
            {googleLoading ? (
              <InlineLoader label="" />
            ) : (
              <GoogleIcon size={20} />
            )}
            Continue with Google
          </button>
          )}

          {/* Divider */}
          {!requires2FA && (
          <div className="flex items-center mb-6">
            <div className="grow h-px bg-brand-border-ultra-light"></div>
            <span className="px-4 text-[10px] font-mono tracking-[0.25em] text-brand-muted font-black uppercase">
              OR EMAIL ACCESS
            </span>
            <div className="grow h-px bg-brand-border-ultra-light"></div>
          </div>
          )}

          {requires2FA ? (
            <form onSubmit={handleVerify2FA} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="totpCode" className="text-[10px] font-mono tracking-[0.2em] font-black text-brand-text-green-dark uppercase block">
                  AUTHENTICATOR CODE
                </label>
                <input
                  id="totpCode"
                  className="w-full rounded-lg border border-brand-border bg-brand-bg-input/70 py-4 px-4 text-center text-2xl font-black tracking-[0.3em] text-brand-dark outline-none focus:border-accent/40"
                  placeholder="000000"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                />
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-brand-emerald hover:bg-brand-emerald-hover active:scale-[0.99] text-white rounded-lg text-sm font-black transition-all shadow-[0_4px_12px_rgba(9,61,39,0.15)] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                type="submit"
                disabled={loading || totpCode.length < 6}
              >
                {loading ? <InlineLoader label="Verifying…" light /> : 'Verify & Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setRequires2FA(false); setTempToken(''); setTotpCode(''); setError(''); }}
                className="w-full text-xs font-bold text-brand-text-muted hover:text-brand-dark"
              >
                ← Back to login
              </button>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-mono tracking-[0.2em] font-black text-brand-text-green-dark uppercase block">
                EMAIL ADDRESS
              </label>
              <div className="relative rounded-lg overflow-hidden bg-brand-bg-input/70 border border-transparent focus-within:border-accent/40 focus-within:bg-brand-bg-input/90 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-icon-gray-green">
                  <Mail size={18} className="stroke-2" />
                </div>
                <input
                  id="email"
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-sm text-brand-dark placeholder-brand-placeholder-gray-green outline-none font-bold"
                  placeholder="you@example.com"
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
                <label htmlFor="password" className="text-[10px] font-mono tracking-[0.2em] font-black text-brand-text-green-dark uppercase">
                  PASSWORD
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-mono tracking-wider font-extrabold text-accent hover:underline uppercase"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-brand-bg-input/70 border border-transparent focus-within:border-accent/40 focus-within:bg-brand-bg-input/90 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-icon-gray-green">
                  <Lock size={18} className="stroke-2" />
                </div>
                <input
                  id="password"
                  className="w-full bg-transparent py-4 pl-12 pr-12 text-sm text-brand-dark placeholder-brand-placeholder-gray-green outline-none font-bold"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-icon-gray-green hover:text-brand-dark transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} className="stroke-2" /> : <Eye size={18} className="stroke-2" />}
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
                className="w-4 h-4 rounded border-brand-border text-accent focus:ring-accent/20 bg-white cursor-pointer accent-brand-emerald"
              />
              <label htmlFor="rememberMe" className="text-xs text-brand-text-gray-green font-bold cursor-pointer select-none">
                Keep me signed in for 30 days
              </label>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-brand-emerald hover:bg-brand-emerald-hover active:scale-[0.99] text-white rounded-lg text-sm font-black transition-all shadow-[0_4px_12px_rgba(9,61,39,0.15)] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              type="submit"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <InlineLoader label="Signing In…" light />
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
          )}

          <div className="mt-8 text-center border-t border-brand-border-ultra-light pt-6">
            <p className="text-xs text-brand-text-gray-green font-bold">
              Don&apos;t have an account?
              <Link href="/signup" className="text-accent font-black hover:underline ml-1.5">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
