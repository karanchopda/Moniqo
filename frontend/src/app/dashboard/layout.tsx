"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isLoggedIn, logout } from '@/lib/auth';
import NotificationDropdown from '@/components/Dashboard/NotificationDropdown';
import ProfileDropdown from '@/components/Dashboard/ProfileDropdown';
import { 
  LogOut, 
  HelpCircle, 
  Search, 
  Bell, 
  LayoutGrid, 
  Receipt, 
  Brain, 
  RefreshCw 
} from 'lucide-react';

const NavIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  switch (iconName) {
    case 'grid_view':
      return <LayoutGrid className={className} />;
    case 'receipt_long':
      return <Receipt className={className} />;
    case 'psychology':
      return <Brain className={className} />;
    case 'sync':
      return <RefreshCw className={className} />;
    default:
      return <LayoutGrid className={className} />;
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Bank Connection Synced', desc: 'HDFC Bank linked statement updated successfully.', time: '12m ago', read: false, type: 'success', icon: 'account_balance' },
    { id: 2, title: 'Duplicate Subscription Found', desc: 'Critical: Duplicate billing of ₹899 found for Airtel.', time: '1h ago', read: false, type: 'warning', icon: 'warning' },
    { id: 3, title: 'Advisor Report Ready', desc: 'AI Coach generated your weekly allocation optimization plan.', time: 'Yesterday', read: true, type: 'info', icon: 'psychology' }
  ]);

  useEffect(() => {
    setIsMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, [router]);

  if (!isMounted) return null;

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: 'grid_view' },
    { name: 'Transactions', path: '/dashboard/transactions', icon: 'receipt_long' },
    { name: 'AI Coach', path: '/dashboard/coach', icon: 'psychology' },
    { name: 'Sync Settings', path: '/dashboard/sync', icon: 'sync' },
  ];

  const formatEmailToName = (email: string) => {
    if (!email) return 'User';
    const prefix = email.split('@')[0];
    const parts = prefix.split(/[._-]/);
    return parts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const displayUserName = user?.name?.trim() || formatEmailToName(user?.email);
  const initials = getInitials(displayUserName);

  return (
    <div className="min-h-screen lg:h-screen bg-gray-50 flex flex-col lg:flex-row lg:overflow-hidden font-sans">

      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 sticky top-0 z-40 shadow-sm shrink-0">
        <div className="flex flex-col">
          <span className="text-base font-black text-[#0a5c43] tracking-tight">MONIQO</span>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest -mt-1">Financial Clarity</span>
        </div>
        <button
          onClick={logout}
          className="w-10 h-10 rounded flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:flex w-64 bg-[#00331c] border-r border-emerald-950/20 flex-col h-full shrink-0 justify-between p-6">
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="flex flex-col pl-4">
            <span className="text-xl font-black text-white tracking-tight">MONIQO</span>
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">Financial Clarity</span>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center gap-3.5 px-4 py-3 rounded transition-all duration-205 cursor-pointer ${isActive
                      ? 'bg-[#2ebd75] text-white font-bold shadow-md'
                      : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
                    }`}>
                    <NavIcon iconName={item.icon} className="w-5 h-5" />
                    <span className="text-xs font-semibold">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Upgrade to Premium Plan & Links */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 text-white p-5 rounded relative overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-colors group">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3e8cc]">Upgrade to</p>
            <p className="text-xs font-black tracking-wide mt-1">Premium Plan</p>

            <button className="w-full bg-[#2ebd75] hover:bg-[#28ad6b] text-white text-[10px] font-bold py-2 px-4 rounded mt-4 transition-colors">
              Unlock Insights
            </button>
          </div>

          {/* Help & Logout */}
          <div className="space-y-1">
            <Link href="/dashboard/help" className="flex items-center gap-3.5 px-4 py-3 rounded text-emerald-100/70 hover:bg-white/10 hover:text-white transition-all">
              <HelpCircle className="w-5 h-5" />
              <span className="text-xs font-semibold">Help</span>
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded text-red-300/80 hover:bg-red-500/10 hover:text-red-300 transition-all text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200/80 backdrop-blur-md flex justify-around items-center px-4 z-40 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.03)] shrink-0">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className="flex-1 max-w-[80px]">
              <div className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded transition-colors duration-250 ${isActive
                ? 'text-[#0a5c43]'
                : 'text-gray-400 hover:text-gray-600'
                }`}>
                <NavIcon iconName={item.icon} className="w-5 h-5" />
                <span className="text-[9px] font-bold tracking-tight truncate w-full text-center">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full pb-20 lg:pb-0 flex flex-col relative">
        {/* Desktop Top Header Bar (Search & Profile) */}
        <div className="hidden lg:flex h-16 border-b border-gray-150 px-8 items-center justify-between shrink-0 bg-white">
          {/* Search bar */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search insights..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50/80 border-none outline-none rounded text-xs font-semibold text-primary placeholder-gray-400 focus:bg-gray-100 transition-colors"
            />
          </div>

          {/* User Settings & Notifications & Profile */}
          <div className="flex items-center gap-4 relative">
            {/* Clickable Notification Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="w-8 h-8 rounded hover:bg-gray-50 flex items-center justify-center text-gray-700 relative outline-none"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded animate-pulse"></span>
                )}
              </button>

              <NotificationDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                onItemClick={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
              />
            </div>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>

            {/* Clickable Profile Trigger */}
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-3 hover:opacity-85 transition-opacity outline-none text-left"
            >
              <div className="hidden xl:flex flex-col text-right">
                <span className="text-xs font-extrabold text-primary">{displayUserName}</span>
              </div>
              <div className="w-8 h-8 rounded bg-[#0a5c43] flex items-center justify-center text-white text-[11px] font-black border border-emerald-100 shadow-sm shrink-0">
                {initials}
              </div>
            </button>

            {/* Profile Dropdown Popup Component */}
            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              displayUserName={displayUserName}
              profileImageUrl=""
              onLogout={logout}
            />
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
