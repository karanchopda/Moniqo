"use client";

import { useState } from 'react';

interface EmailVerificationBannerProps {
  email: string;
}

export default function EmailVerificationBanner({ email }: EmailVerificationBannerProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleResend = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setMessage(data.error || 'Failed to send verification email');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
      console.error('Resend verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-lg">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-amber-600 text-xl flex-shrink-0 mt-0.5">
          warning
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-amber-900 mb-1">
            Email Not Verified
          </h3>
          <p className="text-sm text-amber-800 mb-3">
            Please verify your email address to access all features. Check your inbox for the verification link.
          </p>
          
          {message && (
            <p className={`text-xs mb-3 ${message.includes('sent') ? 'text-green-700' : 'text-red-700'}`}>
              {message}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-sm font-semibold text-amber-900 hover:text-amber-700 transition-colors inline-flex items-center gap-1"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                  Sending...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">email</span>
                  Resend Verification Email
                </>
              )}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-sm text-amber-700 hover:text-amber-900 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-600 hover:text-amber-900 transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
    </div>
  );
}
