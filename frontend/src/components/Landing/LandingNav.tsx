"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout, isLoggedIn } from '@/lib/auth';
import MoniqoLogo from '@/components/ui/MoniqoLogo';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
];

export default function LandingNav() {
  const [isAuth, setIsAuth] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsAuth(isLoggedIn());

    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id || 'home');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ['arboretum', 'pricing'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const hero = document.querySelector('section');
    if (hero) observer.observe(hero);

    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (href: string) => {
    if (pathname !== '/') {
      return pathname.startsWith(href) && href !== '/';
    }
    
    if (href === '/') return activeSection === 'home' || activeSection === '';
    if (href === '/#arboretum') return activeSection === 'arboretum';
    if (href === '/#pricing') return activeSection === 'pricing';
    
    return false;
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
      <nav className="glass-nav max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 rounded-2xl shadow-sm">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <MoniqoLogo size="md" variant="full" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => {
            const active = isActive(link.href);
            return (
              <Link
                key={i}
                href={link.href}
                className={`px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors duration-200 ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {isAuth ? (
              <Link href="/dashboard" className="btn btn-secondary text-xs lg:text-sm px-4 py-2">
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200"
              >
                Sign in
              </Link>
            )}
          </div>

          <Link
            href={isAuth ? "/dashboard/sync" : "/signup"}
            className="btn btn-primary text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2.5"
          >
            {isAuth ? 'New Audit' : 'Register'}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[88px] z-50 md:hidden bg-white animate-fadeIn">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-bold p-4 rounded-2xl ${
                  isActive(link.href) ? 'bg-primary text-white' : 'text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-4" />
            {isAuth ? (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold p-4 text-primary"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-2xl font-bold p-4 text-red-600 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold p-4 text-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
