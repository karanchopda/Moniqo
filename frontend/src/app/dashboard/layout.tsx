"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bot,
  ChevronRight,
  Home,
  LifeBuoy,
  MessageCircle,
  Repeat,
  Settings,
  Sparkles,
  Upload,
  WalletCards,
} from 'lucide-react';
import { isLoggedIn } from '@/lib/auth';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: Home },
  { name: 'Transactions', path: '/dashboard/transactions', icon: WalletCards },
  { name: 'Recurring', path: '/dashboard/recurring', icon: Repeat },
  { name: 'Upload Statement', path: '/dashboard/sync', icon: Upload },
  { name: 'AI Coach', path: '/dashboard/coach', icon: Bot },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  { name: 'Help', path: '/dashboard/help', icon: LifeBuoy },
];

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

  return (
    <div className="min-h-screen bg-brand-bg-muted p-0 lg:p-4 font-sans text-brand-layout-text">
      <div className="min-h-screen lg:min-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-2rem)] bg-white lg:rounded-[22px] lg:shadow-[0_18px_50px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col lg:flex-row">
        <aside className="hidden lg:flex w-73 shrink-0 flex-col justify-between bg-[radial-gradient(circle_at_70%_10%,rgba(20,151,91,0.34),transparent_30%),linear-gradient(155deg,var(--color-brand-gradient-start)_0%,var(--color-brand-gradient-mid)_45%,var(--color-brand-gradient-end)_100%)] px-9 py-14 text-white">
          <nav className="space-y-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/dashboard'
                ? pathname === '/dashboard' && item.name === 'Overview'
                : pathname === item.path;

              return (
                <Link
                  href={item.path}
                  key={item.name}
                  className={`flex h-14 items-center gap-4 rounded-md px-4 text-[15px] font-extrabold transition-all ${
                    isActive
                      ? 'bg-brand-emerald-active text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)]'
                      : 'text-white/92 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-6 w-6 shrink-0 stroke-[2.2]" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/dashboard/help"
            className="group rounded-md border border-white/10 bg-white/6 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:bg-white/10"
          >
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[17px] font-black leading-tight">Need Help?</p>
                <p className="mt-3 max-w-28 text-[14px] font-bold leading-relaxed text-white/95">
                  Visit Help Center
                </p>
              </div>
              <span className="flex h-13 w-13 items-center justify-center rounded-md bg-brand-emerald-light text-white shadow-lg">
                <MessageCircle className="h-6 w-6 fill-white/15" />
              </span>
            </div>
            <div className="mt-3 flex justify-end text-brand-emerald-bright">
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </aside>

        <header className="lg:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b border-brand-border-light bg-white px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-forest text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-primary">Audit Summary</p>
              <p className="text-[11px] font-bold text-brand-gray-muted">Moniqo Dashboard</p>
            </div>
          </div>
          <Link
            href="/dashboard/help"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-brand-border-muted text-primary"
            aria-label="Help Center"
          >
            <MessageCircle className="h-5 w-5" />
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto bg-white pb-24 lg:pb-0">
          {children}
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 grid h-17 grid-cols-7 border-t border-brand-border-tab bg-white px-1 shadow-[0_-12px_30px_rgba(15,23,42,0.08)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/dashboard'
              ? pathname === '/dashboard' && item.name === 'Overview'
              : pathname === item.path;

            return (
              <Link
                href={item.path}
                key={item.name}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-black ${
                  isActive ? 'text-brand-green-active' : 'text-brand-green-inactive'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="max-w-full truncate">{item.name.replace('Upload Statement', 'Upload').replace('Recurring', 'Recurring')}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
