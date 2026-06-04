"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { InlineLoader } from '@/components/ui/GlobalLoader';
import api from '@/lib/api';
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel';
import MoniqoLogo from '@/components/ui/MoniqoLogo';
import { getErrorMessage } from '@/lib/error';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.status === 200) {
        setMessage(response.data.message || 'Password reset email sent! Please check your inbox.');
        setEmail('');
      } else {
        setError(getErrorMessage(response.data, 'Failed to send reset email'));
      }
    } catch (err: any) {
      setError(getErrorMessage(err, 'Network error. Please try again.'));
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

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
              Reset Your Password
            </h1>
            <p className="text-sm font-semibold text-brand-text-muted leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {message && (
              <div className="bg-brand-light border border-brand-border-blue-gray/40 text-primary p-4 rounded-lg text-sm font-semibold">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center border border-red-100 font-semibold">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-mono tracking-[0.2em] font-black text-brand-text-green-dark uppercase block">
                EMAIL ADDRESS
              </label>
              <div className="relative rounded-lg overflow-hidden bg-brand-bg-input/70 border border-transparent focus-within:border-accent/40 focus-within:bg-brand-bg-input/90 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-icon-gray-green">
                  <Mail size={18} className="stroke-[2]" />
                </div>
                <input
                  id="email"
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-sm text-brand-dark placeholder-brand-placeholder-gray-green outline-none font-bold"
                  placeholder="julian.thorne@private.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-brand-emerald hover:bg-brand-emerald-hover active:scale-[0.99] text-white rounded-lg text-sm font-black transition-all shadow-[0_4px_12px_rgba(9,61,39,0.15)] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <InlineLoader label="Sending Link…" light />
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={16} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center border-t border-brand-border-ultra-light pt-6 flex flex-col items-center justify-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold text-brand-text-gray-green hover:text-brand-emerald transition-all flex items-center gap-1.5"
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              Return to Sanctuary Sign In
            </Link>
            <p className="text-xs text-brand-muted font-semibold">
              New to the elite network?
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
