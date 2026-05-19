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
    <div className="min-h-screen lg:h-screen bg-gray-50 flex flex-col lg:flex-row lg:overflow-hidden">
      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 sticky top-0 z-40 shadow-sm shrink-0">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <MoniqoLogo size="sm" variant="full" />
        </Link>
        <button 
          onClick={logout}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          title="Sign Out"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
        </button>
      </header>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-full shrink-0">
        <div className="flex-1 p-5">
          {/* Logo */}
          <Link href="/" className="flex items-center group mb-8">
            <MoniqoLogo size="md" variant="full" />
          </Link>
 
          {/* Navigation Links */}
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
 
        {/* Bottom Actions */}
        <div className="p-5 border-t border-gray-100">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200/80 backdrop-blur-md flex justify-around items-center px-4 z-40 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.03)] shrink-0">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className="flex-1 max-w-[80px]">
              <div className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors duration-250 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}>
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
 
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto p-5 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
