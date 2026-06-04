"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, ArrowRight } from 'lucide-react';
import GoogleIcon from '@/components/ui/GoogleIcon';
import { InlineLoader } from '@/components/ui/GlobalLoader';
import api from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel';
import MoniqoLogo from '@/components/ui/MoniqoLogo';
import { getErrorMessage } from '@/lib/error';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  // Calculate password strength (0-4)
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length === 0) return 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(password);
  
  const getStrengthColor = () => {
    if (strength === 0) return 'bg-gray-200';
    if (strength === 1) return 'bg-red-400';
    if (strength === 2) return 'bg-orange-400';
    if (strength === 3) return 'bg-yellow-400';
    return 'bg-accent';
  };

  const getStrengthText = () => {
    if (password.length === 0) return 'Enter a password';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const handleGoogleSignup = async () => {
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
      setError(getErrorMessage(err, 'Google signup failed'));
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }
    
    try {
      const res = await api.post('/auth/signup', { name: fullName, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Signup failed'));
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
              Create Account
            </h1>
            <p className="text-sm font-semibold text-brand-text-muted leading-relaxed">
              Establish your private portal to manage your global assets.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm text-center border border-red-100 font-semibold">
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignup}
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

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-grow h-[1px] bg-brand-border-ultra-light"></div>
            <span className="px-4 text-[10px] font-mono tracking-[0.25em] text-brand-muted font-black uppercase">
              OR EMAIL REGISTRATION
            </span>
            <div className="flex-grow h-[1px] bg-brand-border-ultra-light"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-[10px] font-mono tracking-[0.2em] font-black text-brand-text-green-dark uppercase block">
                FULL NAME
              </label>
              <div className="relative rounded-lg overflow-hidden bg-brand-bg-input/70 border border-transparent focus-within:border-accent/40 focus-within:bg-brand-bg-input/90 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-icon-gray-green">
                  <UserIcon size={18} className="stroke-[2]" />
                </div>
                <input
                  id="name"
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-sm text-brand-dark placeholder-brand-placeholder-gray-green outline-none font-bold"
                  placeholder="Julian Thorne"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

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

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-mono tracking-[0.2em] font-black text-brand-text-green-dark uppercase block">
                SECURITY PASSWORD
              </label>
              <div className="relative rounded-lg overflow-hidden bg-brand-bg-input/70 border border-transparent focus-within:border-accent/40 focus-within:bg-brand-bg-input/90 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-icon-gray-green">
                  <Lock size={18} className="stroke-[2]" />
                </div>
                <input
                  id="password"
                  className="w-full bg-transparent py-4 pl-12 pr-12 text-sm text-brand-dark placeholder-brand-placeholder-gray-green outline-none font-bold"
                  placeholder="••••••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-icon-gray-green hover:text-brand-dark transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} className="stroke-[2]" /> : <Eye size={18} className="stroke-[2]" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="pt-2">
                  <div className="flex gap-1 h-1 mb-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className={`flex-1 rounded transition-colors duration-300 ${strength >= level ? getStrengthColor() : 'bg-gray-100'}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-brand-text-gray-green">
                    <span>Password complexity:</span>
                    <span className={strength >= 3 ? 'text-accent font-black' : ''}>{getStrengthText()}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-brand-emerald hover:bg-brand-emerald-hover active:scale-[0.99] text-white rounded-lg text-sm font-black transition-all shadow-[0_4px_12px_rgba(9,61,39,0.15)] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              type="submit"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <InlineLoader label="Initiating Membership…" light />
                </>
              ) : (
                <>
               Create Account
                  <ArrowRight size={16} className="stroke-[2.5]" />
                </>
              )}
            </button>

            <p className="text-[10px] text-center font-semibold text-brand-muted leading-relaxed">
              By submitting, you agree to our{' '}
              <Link href="/terms" className="text-accent font-bold hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-accent font-bold hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          <div className="mt-8 text-center border-t border-brand-border-ultra-light pt-6">
            <p className="text-xs text-brand-text-gray-green font-bold">
              Already a member?
              <Link href="/login" className="text-accent font-black hover:underline ml-1.5">
                Sign In to Sanctuary
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
