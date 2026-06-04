"use client";

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { PageLoader } from '@/components/ui/GlobalLoader';
import api from '@/lib/api';
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel';
import MoniqoLogo from '@/components/ui/MoniqoLogo';
import { getErrorMessage } from '@/lib/error';

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
        if (response.data.token && response.data.user) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError(getErrorMessage(response.data, 'Failed to verify email'));
      }
    } catch (err: any) {
      setError(getErrorMessage(err, 'Network error. Please try again.'));
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center text-center">
          {/* Branded pulse ring */}
          <div className="relative flex items-center justify-center w-20 h-20 mb-8">
            <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping" style={{ animationDuration: '1.6s' }} />
            <span className="absolute inset-[8px] rounded-full bg-accent/10" />
            <span className="relative w-8 h-8 rounded-full bg-accent" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark mb-3">
            Verifying Your Access
          </h1>
          <p className="text-sm font-semibold text-brand-text-muted leading-relaxed max-w-sm">
            Please wait while we securely verify your email address and establish your private portal.
          </p>
        </div>
      );
    }

    if (success) {
      return (
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mb-8">
            <CheckCircle className="h-10 w-10 text-accent stroke-[2]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark mb-3">
            Access Granted
          </h1>
          <p className="text-sm font-semibold text-brand-text-muted leading-relaxed max-w-sm mb-10">
            Your email has been verified. Welcome to Moniqo. Your private portal is being prepared — redirecting to your sanctuary dashboard now.
          </p>
          <Link
            href="/dashboard"
            className="w-full max-w-xs flex items-center justify-center gap-2 py-4 px-4 bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-lg text-sm font-black transition-all shadow-[0_4px_12px_rgba(9,61,39,0.15)]"
          >
            Enter Your Dashboard
            <ArrowRight size={16} className="stroke-[2.5]" />
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-8">
          <AlertTriangle className="h-10 w-10 text-red-500 stroke-[2]" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark mb-3">
          Verification Failed
        </h1>
        <p className="text-sm font-semibold text-brand-text-muted leading-relaxed max-w-sm mb-10">
          {error}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-brand-emerald hover:bg-brand-emerald-hover text-white rounded-lg text-sm font-black transition-all shadow-[0_4px_12px_rgba(9,61,39,0.15)]"
          >
            Return to Sign In
            <ArrowRight size={16} className="stroke-[2.5]" />
          </Link>
          <Link
            href="/signup"
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-white border border-brand-border hover:bg-brand-bg-light text-brand-text-green-dark rounded-lg text-sm font-bold transition-all"
          >
            <ArrowLeft size={16} className="stroke-[2.5]" />
            Create New Account
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ── Left branding panel ── */}
      <AuthLeftPanel />

      {/* ── Right content panel ── */}
      <main className="w-full lg:w-[52%] flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-20 xl:px-28 relative">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="inline-block">
              <MoniqoLogo size="md" />
            </Link>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading verification…" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
