"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isLoggedIn, logout } from '@/lib/auth';
import MoniqoLogo from '@/components/ui/MoniqoLogo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
    }
  }, [router]);

  if (!isMounted) return null;

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: 'dashboard' },
    { name: 'Transactions', path: '/dashboard/transactions', icon: 'receipt_long' },
    { name: 'Sync', path: '/dashboard/sync', icon: 'sync' },
    { name: 'AI Coach', path: '/dashboard/coach', icon: 'psychology' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
        <div className="flex-1 p-3 sm:p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group mb-6 sm:mb-8">
            <MoniqoLogo size="md" variant="full" />
          </Link>

          {/* Navigation Links */}
          <div className="flex lg:flex-col gap-2 lg:space-y-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-colors duration-200 whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-lg sm:text-xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                      {item.icon}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center lg:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">logout</span>
            <span className="text-xs sm:text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-5 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
