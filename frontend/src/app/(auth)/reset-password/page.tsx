"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { InlineLoader, PageLoader } from '@/components/ui/GlobalLoader';
import api from '@/lib/api';
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel';
import MoniqoLogo from '@/components/ui/MoniqoLogo';
import { getErrorMessage } from '@/lib/error';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Network error. Please try again.'));
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex bg-white font-sans">
        {/* ── Left branding panel ── */}
        <AuthLeftPanel />

        {/* ── Right form panel ── */}
        <main className="w-full lg:w-[52%] flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-20 xl:px-28 relative">
          <div className="w-full max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-accent stroke-[2]" />
            </div>
            <h2 className="text-2xl font-black text-brand-dark mb-3">Password Reset Successful!</h2>
            <p className="text-sm font-semibold text-brand-text-muted mb-8 leading-relaxed">
              Your password has been reset successfully. Welcome back to the network. Redirecting to login...
            </p>
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-lg text-sm font-black transition-all shadow-[0_4px_12px_rgba(9,61,39,0.15)]"
            >
              Go to Login
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ── Left branding panel ── */}
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
              Create New Password
            </h1>
            <p className="text-sm font-semibold text-brand-text-muted leading-relaxed">
              Enter your new private key password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm text-center border border-red-100 font-semibold">
                {error}
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-mono tracking-[0.2em] font-black text-brand-text-green-dark uppercase block">
                NEW SECURITY PASSWORD
              </label>
              <div className="relative rounded-lg overflow-hidden bg-brand-bg-input/70 border border-transparent focus-within:border-accent/40 focus-within:bg-brand-bg-input/90 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-icon-gray-green">
                  <Lock size={18} className="stroke-[2]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-4 pl-12 pr-12 text-sm text-brand-dark placeholder-brand-placeholder-gray-green outline-none font-bold"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-icon-gray-green hover:text-brand-dark transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} className="stroke-[2]" /> : <Eye size={18} className="stroke-[2]" />}
                </button>
              </div>
              <p className="text-[10px] font-bold text-brand-muted">
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-[10px] font-mono tracking-[0.2em] font-black text-brand-text-green-dark uppercase block">
                CONFIRM NEW PASSWORD
              </label>
              <div className="relative rounded-lg overflow-hidden bg-brand-bg-input/70 border border-transparent focus-within:border-accent/40 focus-within:bg-brand-bg-input/90 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-icon-gray-green">
                  <Lock size={18} className="stroke-[2]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent py-4 pl-12 pr-12 text-sm text-brand-dark placeholder-brand-placeholder-gray-green outline-none font-bold"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-brand-emerald hover:bg-brand-emerald-hover active:scale-[0.99] text-white rounded-lg text-sm font-black transition-all shadow-[0_4px_12px_rgba(9,61,39,0.15)] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              type="submit"
              disabled={loading || !token}
            >
              {loading ? (
                <>
                  <InlineLoader label="Resetting Password…" light />
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={16} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center border-t border-brand-border-ultra-light pt-6">
            <Link
              href="/login"
              className="text-xs font-bold text-brand-text-gray-green hover:text-brand-emerald transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              Return to Sanctuary Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader label="Preparing reset form…" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
