"use client";

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MoniqoLogo from '@/components/ui/MoniqoLogo';
import api from '@/lib/api';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const verifyEmail = useCallback(async () => {
    try {
      const response = await api.post('/auth/verify-email', { token });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError(response.data.error || 'Failed to verify email');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Network error. Please try again.');
      console.error('Verify email error:', err);
    } finally {
      setLoading(false);
    }
  }, [router, token]);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing verification token');
      setLoading(false);
      return;
    }

    verifyEmail();
  }, [token, verifyEmail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-accent text-4xl animate-spin">
              refresh
            </span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Verifying Your Email</h2>
          <p className="text-muted">Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-accent text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Email Verified Successfully!</h2>
            <p className="text-muted mb-6">
              Your email has been verified. Welcome to Moniqo! Redirecting to dashboard...
            </p>
            <Link href="/dashboard" className="btn btn-primary inline-flex">
              <span className="material-symbols-outlined">dashboard</span>
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <MoniqoLogo size="lg" variant="full" />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-600 text-4xl">
              error
            </span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Verification Failed</h2>
          <p className="text-muted mb-6">{error}</p>
          
          <div className="space-y-3">
            <Link href="/login" className="btn btn-primary w-full justify-center">
              <span className="material-symbols-outlined">login</span>
              Go to Login
            </Link>
            <Link href="/signup" className="btn btn-secondary w-full justify-center">
              <span className="material-symbols-outlined">person_add</span>
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-accent animate-spin">refresh</span>
          <p className="mt-2 text-muted">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
