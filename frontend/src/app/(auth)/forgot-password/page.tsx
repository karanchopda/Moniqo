"use client";

import { useState } from 'react';
import Link from 'next/link';
import MoniqoLogo from '@/components/ui/MoniqoLogo';
import api from '@/lib/api';

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
        setError(response.data.error || 'Failed to send reset email');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Network error. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <MoniqoLogo size="lg" variant="full" />
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-primary">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-muted px-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {message && (
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent text-xl flex-shrink-0">
                    check_circle
                  </span>
                  <p className="text-sm text-primary">{message}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-600 text-xl flex-shrink-0">
                    error
                  </span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Sending...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">email</span>
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-accent hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Login
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-accent hover:text-primary transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
