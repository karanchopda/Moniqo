"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout, isLoggedIn } from '@/lib/auth';
import MoniqoLogo from '@/components/ui/MoniqoLogo';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/#arboretum' },
  { name: 'Pricing', href: '/#pricing' },
];

export default function LandingNav() {
  const [isAuth, setIsAuth] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();

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
      <nav className="glass-nav max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 rounded-full shadow-sm">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <MoniqoLogo size="md" variant="full" />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => {
            const active = isActive(link.href);
            return (
              <Link
                key={i}
                href={link.href}
                className={`px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-semibold transition-colors duration-200 ${
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
          {isAuth ? (
            <button
              onClick={logout}
              className="btn btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block px-3 lg:px-4 py-2 text-xs lg:text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="btn btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
