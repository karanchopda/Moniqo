"use client";

import { useEffect, useState } from 'react';
import { logout } from '@/lib/auth';
import {
  User,
  Bell,
  Lock,
  LogOut,
  Save,
  CheckCircle,
  Shield,
  CreditCard,
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing'>('profile');
  
  // Toggles state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [aiPrompts, setAiPrompts] = useState(true);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setFullName(parsed.name || '');
        setEmail(parsed.email || '');
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'billing' || tab === 'profile' || tab === 'notifications' || tab === 'security') {
        setActiveTab(tab as any);
      }
    }
  }, []);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      const first = parts[0]?.[0] || '';
      const second = parts[1]?.[0] || '';
      return (first + second).toUpperCase() || 'U';
    }
    return name.slice(0, 2).toUpperCase() || 'U';
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(null);
    setErrorStatus(null);

    if (!fullName || !email) {
      setErrorStatus('Please fill out all fields.');
      return;
    }

    // Save back to localStorage
    const updatedUser = { ...user, name: fullName, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser as any);
    
    setSaveStatus('Profile updated successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(null);
    setErrorStatus(null);

    if (!currentPassword) {
      setErrorStatus('Current password is required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorStatus('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorStatus('Password must be at least 8 characters long.');
      return;
    }

    setSaveStatus('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[28px] font-black tracking-[-0.01em] text-[#121c2d]">Account Settings</h1>
        <p className="mt-1 text-sm font-medium text-[#526176]">Manage your profile details, notifications, security, and subscription.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        
        {/* Navigation Sidebar */}
        <aside className="space-y-1">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Privacy', icon: Lock },
            { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSaveStatus(null);
                  setErrorStatus(null);
                }}
                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#e5f7ee] text-[#004d25] shadow-sm'
                    : 'text-[#526176] hover:bg-[#fbfcfb] hover:text-[#121c2d]'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-[#159957]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="my-5 border-t border-[#edf1ef]"></div>

          {/* Quick Logout Button in settings menu */}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-bold text-[#e40012] transition-all hover:bg-rose-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </aside>

        {/* Dynamic Content Pane */}
        <main className="space-y-6">
          {/* Status Messages */}
          {saveStatus && (
            <div className="flex items-center gap-2 rounded-md border border-[#9ed9ba] bg-[#f2fff8] p-4 text-sm font-bold text-[#078649] shadow-sm animate-fadeIn">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>{saveStatus}</span>
            </div>
          )}

          {errorStatus && (
            <div className="flex items-center gap-2 rounded-md border border-[#ffc6c3] bg-[#fff0ef] p-4 text-sm font-bold text-[#e40012] shadow-sm animate-fadeIn">
              <Shield className="h-5 w-5 shrink-0 text-[#e21f27]" />
              <span>{errorStatus}</span>
            </div>
          )}

          {/* Tab Content: Profile */}
          {activeTab === 'profile' && (
            <div className="rounded-md border border-[#dce4e0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
              <h2 className="text-lg font-black text-[#121c2d]">Profile Information</h2>
              <p className="mt-1 text-sm font-medium text-[#526176]">Update your personal account details.</p>
              
              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-[#00331c] text-[24px] font-black text-white shadow-md">
                  {user ? getInitials(user.name) : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#121c2d]">{user?.name || 'Moniqo User'}</h3>
                  <p className="text-xs font-semibold text-[#83918b]">Personal Account</p>
                  <p className="text-xs font-medium text-[#83918b] mt-1">{user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="mt-8 max-w-xl space-y-5">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-bold text-[#2b384c]">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-md border border-[#dfe6e2] bg-white px-4 py-3 text-sm font-semibold text-[#121c2d] shadow-sm outline-none focus:border-[#159957] focus:ring-2 focus:ring-[#159957]/10"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-[#2b384c]">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-[#dfe6e2] bg-white px-4 py-3 text-sm font-semibold text-[#121c2d] shadow-sm outline-none focus:border-[#159957] focus:ring-2 focus:ring-[#159957]/10"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#00331c] px-6 text-sm font-black text-white shadow-sm hover:bg-[#004c2b] transition-all"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Tab Content: Notifications */}
          {activeTab === 'notifications' && (
            <div className="rounded-md border border-[#dce4e0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
              <h2 className="text-lg font-black text-[#121c2d]">Notification Preferences</h2>
              <p className="mt-1 text-sm font-medium text-[#526176]">Control how and when you want to receive alerts.</p>

              <div className="mt-8 space-y-6 max-w-2xl">
                {[
                  {
                    id: 'anomalies',
                    title: 'Spending Leak Alerts',
                    desc: 'Instant notifications when the AI detects subscription double-charges or sudden spending spikes.',
                    state: emailAlerts,
                    setter: setEmailAlerts,
                  },
                  {
                    id: 'weekly',
                    title: 'Weekly Report Summary',
                    desc: 'A comprehensive visual digest of your transaction highlights and savings progress delivered to your inbox.',
                    state: weeklyDigest,
                    setter: setWeeklyDigest,
                  },
                  {
                    id: 'coach',
                    title: 'AI Coach Smart Prompts',
                    desc: 'Periodic smart advice and reminders based on your saving milestones.',
                    state: aiPrompts,
                    setter: setAiPrompts,
                  },
                ].map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-6 py-4 border-b border-[#edf1ef] last:border-0">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-[#121c2d]">{item.title}</h4>
                      <p className="text-xs font-semibold text-[#68788c] leading-relaxed">{item.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => item.setter(!item.state)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.state ? 'bg-[#159957]' : 'bg-[#e5ebe8]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          item.state ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSaveStatus('Preferences saved successfully!');
                      setTimeout(() => setSaveStatus(null), 3000);
                    }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#00331c] px-6 text-sm font-black text-white shadow-sm hover:bg-[#004c2b] transition-all"
                  >
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Security */}
          {activeTab === 'security' && (
            <div className="rounded-md border border-[#dce4e0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
              <h2 className="text-lg font-black text-[#121c2d]">Security & Password</h2>
              <p className="mt-1 text-sm font-medium text-[#526176]">Manage password settings and privacy credentials.</p>

              <form onSubmit={handleSaveSecurity} className="mt-8 max-w-xl space-y-5">
                <div className="space-y-2">
                  <label htmlFor="currPass" className="text-sm font-bold text-[#2b384c]">Current Password</label>
                  <input
                    id="currPass"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-md border border-[#dfe6e2] bg-white px-4 py-3 text-sm font-semibold text-[#121c2d] shadow-sm outline-none focus:border-[#159957] focus:ring-2 focus:ring-[#159957]/10"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPass" className="text-sm font-bold text-[#2b384c]">New Password</label>
                  <input
                    id="newPass"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-md border border-[#dfe6e2] bg-white px-4 py-3 text-sm font-semibold text-[#121c2d] shadow-sm outline-none focus:border-[#159957] focus:ring-2 focus:ring-[#159957]/10"
                    placeholder="New password (min 8 chars)"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confPass" className="text-sm font-bold text-[#2b384c]">Confirm New Password</label>
                  <input
                    id="confPass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-[#dfe6e2] bg-white px-4 py-3 text-sm font-semibold text-[#121c2d] shadow-sm outline-none focus:border-[#159957] focus:ring-2 focus:ring-[#159957]/10"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#00331c] px-6 text-sm font-black text-white shadow-sm hover:bg-[#004c2b] transition-all"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Tab Content: Billing */}
          {activeTab === 'billing' && (
            <div className="rounded-md border border-[#dce4e0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
              <h2 className="text-lg font-black text-[#121c2d]">Billing & Subscription Plan</h2>
              <p className="mt-1 text-sm font-medium text-[#526176]">View details about your current subscription tier.</p>

              <div className="mt-8 max-w-2xl">
                <div className="rounded-md border border-[#9ed9ba] bg-[#f2fff8] p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded bg-[#d9f5e8] px-2.5 py-1 text-xs font-black text-[#007b43]">
                        <Sparkles className="h-3.5 w-3.5 fill-[#007b43]/15" />
                        MONIQO PRO
                      </span>
                      <h3 className="mt-3 text-xl font-black text-[#121c2d]">₹499 / month</h3>
                      <p className="mt-2 text-xs font-semibold text-[#68788c] max-w-md leading-relaxed">
                        Enjoy full unlimited monthly PDF & CSV account statement processing, unrestricted AI Coach chats, advanced leak detection alerts, and automatic export options.
                      </p>
                    </div>

                    <div className="rounded border border-[#cbe9d8] bg-white px-5 py-4 text-center shadow-sm min-w-[150px]">
                      <p className="text-[10px] font-black text-[#83918b] uppercase tracking-wider">Next Payment</p>
                      <p className="mt-1 text-sm font-black text-[#121c2d]">03 July 2026</p>
                      <p className="mt-1 text-[11px] font-bold text-[#159957]">Auto-renews</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <button className="inline-flex h-11 items-center justify-center rounded-md bg-[#00331c] px-6 text-sm font-black text-white shadow-sm hover:bg-[#004c2b] transition-all">
                    Manage Payment Methods
                  </button>
                  <button className="inline-flex h-11 items-center justify-center rounded-md border border-[#dfe6e2] bg-white px-6 text-sm font-black text-[#526176] hover:bg-[#fbfcfb] transition-all">
                    View Billing History
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Premium Logout Panel */}
          <div className="rounded-md border border-rose-100 bg-rose-50/20 p-6 lg:p-8">
            <h2 className="text-lg font-black text-[#e40012]">Sign Out</h2>
            <p className="mt-1 text-sm font-medium text-[#526176]">Safely disconnect from Moniqo and clear current session credentials.</p>
            <button
              onClick={logout}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#e40012] px-6 text-sm font-black text-white shadow-sm hover:bg-[#c40010] transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign Out of Account
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
