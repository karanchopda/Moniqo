"use client";

import { useEffect, useState } from 'react';
import { logout } from '@/lib/auth';
import { userApi } from '@/lib/api';
import { Bell, CheckCircle, CreditCard, Lock, LogOut, Save, Shield, Sparkles, User } from 'lucide-react';

type Tab = 'profile' | 'notifications' | 'security' | 'billing';
interface NotifPrefs { emailAlerts: boolean; weeklyDigest: boolean; aiPrompts: boolean; }

export default function SettingsPage() {
  const [user, setUser]             = useState<{ name?: string; email?: string; isGoogleUser?: boolean } | null>(null);
  const [fullName, setFullName]     = useState('');
  const [email, setEmail]           = useState('');
  const [activeTab, setActiveTab]   = useState<Tab>('profile');
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({ emailAlerts: true, weeklyDigest: false, aiPrompts: true });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving]           = useState(false);
  const [saveStatus, setSaveStatus]   = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    userApi.getProfile()
      .then((res) => {
        const u = res.data;
        setUser(u); setFullName(u.name || ''); setEmail(u.email || ''); setIsGoogleUser(!!u.isGoogleUser);
        if (u.notificationPrefs) setNotifPrefs(u.notificationPrefs as NotifPrefs);
        const stored = localStorage.getItem('user');
        localStorage.setItem('user', JSON.stringify({ ...(stored ? JSON.parse(stored) : {}), ...u }));
      })
      .catch(() => {
        const stored = localStorage.getItem('user');
        if (stored) { try { const p = JSON.parse(stored); setUser(p); setFullName(p.name||''); setEmail(p.email||''); setIsGoogleUser(!!p.isGoogleUser); } catch {} }
      });

    if (typeof window !== 'undefined') {
      const tab = new URLSearchParams(window.location.search).get('tab') as Tab | null;
      if (tab && ['profile','notifications','security','billing'].includes(tab)) setActiveTab(tab);
    }
  }, []);

  const flash = (msg: string, isError = false) => {
    if (isError) { setErrorStatus(msg); setSaveStatus(null); } else { setSaveStatus(msg); setErrorStatus(null); }
    setTimeout(() => { setSaveStatus(null); setErrorStatus(null); }, 4000);
  };

  const getInitials = (name?: string | null) => {
    if (!name?.trim()) return 'U';
    const p = name.trim().split(' ');
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await userApi.updateProfile({ name: fullName.trim()||undefined, email: email.trim()||undefined });
      const u = res.data; setUser(u);
      const stored = localStorage.getItem('user');
      localStorage.setItem('user', JSON.stringify({ ...(stored ? JSON.parse(stored) : {}), ...u }));
      flash('Profile updated successfully!');
    } catch (err: any) { flash(err.response?.data?.error||'Failed to update profile.', true); }
    finally { setSaving(false); }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try { await userApi.updateNotificationPrefs(notifPrefs); flash('Notification preferences saved!'); }
    catch { flash('Failed to save preferences.', true); }
    finally { setSaving(false); }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) return flash('Current password is required.', true);
    if (newPassword !== confirmPassword) return flash('New passwords do not match.', true);
    if (newPassword.length < 8) return flash('New password must be at least 8 characters.', true);
    setSaving(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      flash('Password changed successfully!');
    } catch (err: any) { flash(err.response?.data?.error||'Failed to change password.', true); }
    finally { setSaving(false); }
  };

  const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: 'profile',       label: 'My Profile',        Icon: User       },
    { id: 'notifications', label: 'Notifications',      Icon: Bell       },
    { id: 'security',      label: 'Security & Privacy', Icon: Lock       },
    { id: 'billing',       label: 'Billing & Plan',     Icon: CreditCard },
  ];

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      <div className="mb-7">
        <h1 className="text-[28px] font-black tracking-[-0.01em] text-brand-dark">Account Settings</h1>
        <p className="mt-1 text-sm font-medium text-brand-text-muted">Manage your profile, notifications, security, and subscription.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-1">
          {tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => { setActiveTab(id); setSaveStatus(null); setErrorStatus(null); }}
                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-bold transition-all ${active ? 'bg-brand-light text-primary shadow-sm' : 'text-brand-text-muted hover:bg-brand-bg-light hover:text-brand-dark'}`}>
                <Icon className={`h-5 w-5 ${active ? 'text-brand-green-text-alt' : ''}`} />
                <span>{label}</span>
              </button>
            );
          })}
          <div className="my-5 border-t border-brand-border-ultra-light" />
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-bold text-brand-red hover:bg-rose-50">
            <LogOut className="h-5 w-5" /><span>Logout</span>
          </button>
        </aside>

        <main className="space-y-6">
          {saveStatus && (
            <div className="flex items-center gap-2 rounded-md border border-brand-green-border bg-brand-bg-green p-4 text-sm font-bold text-brand-green-bright shadow-sm animate-fadeIn">
              <CheckCircle className="h-5 w-5 shrink-0" /><span>{saveStatus}</span>
            </div>
          )}
          {errorStatus && (
            <div className="flex items-center gap-2 rounded-md border border-brand-red-border bg-brand-bg-red p-4 text-sm font-bold text-brand-red shadow-sm animate-fadeIn">
              <Shield className="h-5 w-5 shrink-0" /><span>{errorStatus}</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="rounded-md border border-brand-border-gray bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
              <h2 className="text-lg font-black text-brand-dark">Profile Information</h2>
              <p className="mt-1 text-sm font-medium text-brand-text-muted">Update your personal account details.</p>
              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-primary text-[24px] font-black text-white shadow-md">
                  {getInitials(user?.name)}
                </div>
                <div>
                  <h3 className="text-base font-black text-brand-dark">{user?.name || 'Moniqo User'}</h3>
                  <p className="text-xs font-semibold text-brand-green-inactive mt-0.5">{isGoogleUser ? 'Google Account' : 'Personal Account'}</p>
                  <p className="text-xs font-medium text-brand-green-inactive mt-1">{user?.email}</p>
                </div>
              </div>
              <form onSubmit={handleSaveProfile} className="mt-8 max-w-xl space-y-5">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-bold text-brand-text-dark-blue">Full Name</label>
                  <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name"
                    className="w-full rounded-md border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-dark shadow-sm outline-none focus:border-brand-green-text-alt focus:ring-2 focus:ring-brand-green-text-alt/10" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-brand-text-dark-blue">Email Address</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address"
                    className="w-full rounded-md border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-dark shadow-sm outline-none focus:border-brand-green-text-alt focus:ring-2 focus:ring-brand-green-text-alt/10" />
                </div>
                <button type="submit" disabled={saving}
                  className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-black text-white shadow-sm hover:bg-primary-light transition-all disabled:opacity-60">
                  <Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="rounded-md border border-brand-border-gray bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
              <h2 className="text-lg font-black text-brand-dark">Notification Preferences</h2>
              <p className="mt-1 text-sm font-medium text-brand-text-muted">Control how and when you receive alerts.</p>
              <div className="mt-8 space-y-6 max-w-2xl">
                {([
                  { key: 'emailAlerts'  as const, title: 'Spending Leak Alerts',   desc: 'Alerts when the AI detects double-charges or sudden spending spikes.' },
                  { key: 'weeklyDigest' as const, title: 'Weekly Report Summary',  desc: 'A weekly digest of your transaction highlights and savings progress.'  },
                  { key: 'aiPrompts'    as const, title: 'AI Coach Smart Prompts', desc: 'Periodic smart advice based on your saving milestones.'                },
                ]).map((item) => (
                  <div key={item.key} className="flex items-start justify-between gap-6 py-4 border-b border-brand-border-ultra-light last:border-0">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-brand-dark">{item.title}</h4>
                      <p className="text-xs font-semibold text-brand-text-muted-blue leading-relaxed">{item.desc}</p>
                    </div>
                    <button type="button" role="switch" aria-checked={notifPrefs[item.key]}
                      onClick={() => setNotifPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${notifPrefs[item.key] ? 'bg-brand-green-text-alt' : 'bg-brand-bg-gray-green'}`}>
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${notifPrefs[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
                <div className="pt-2">
                  <button onClick={handleSaveNotifications} disabled={saving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-black text-white shadow-sm hover:bg-primary-light transition-all disabled:opacity-60">
                    <Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="rounded-md border border-brand-border-gray bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
              <h2 className="text-lg font-black text-brand-dark">Security &amp; Password</h2>
              <p className="mt-1 text-sm font-medium text-brand-text-muted">Update your account password.</p>
              {isGoogleUser ? (
                <div className="mt-8 max-w-xl rounded-md border border-brand-border-gray bg-brand-bg-light p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white border border-brand-border">
                      <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-black text-brand-dark">Google Sign-In Account</p>
                      <p className="mt-1 text-xs font-semibold text-brand-text-muted leading-relaxed">
                        Your account uses Google to sign in. Password management is handled by Google — you can&apos;t set a password here.
                      </p>
                      <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-black text-brand-green-text-alt hover:underline">
                        Manage Google Account Security →
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveSecurity} className="mt-8 max-w-xl space-y-5">
                  {[
                    { id: 'currPass', label: 'Current Password',     value: currentPassword, setter: setCurrentPassword, ph: 'Enter current password'    },
                    { id: 'newPass',  label: 'New Password',         value: newPassword,     setter: setNewPassword,     ph: 'New password (min 8 chars)' },
                    { id: 'confPass', label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword, ph: 'Confirm new password'       },
                  ].map(({ id, label, value, setter, ph }) => (
                    <div key={id} className="space-y-2">
                      <label htmlFor={id} className="text-sm font-bold text-brand-text-dark-blue">{label}</label>
                      <input id={id} type="password" value={value} onChange={(e) => setter(e.target.value)} placeholder={ph}
                        className="w-full rounded-md border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-dark shadow-sm outline-none focus:border-brand-green-text-alt focus:ring-2 focus:ring-brand-green-text-alt/10" />
                    </div>
                  ))}
                  <button type="submit" disabled={saving}
                    className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-black text-white shadow-sm hover:bg-primary-light transition-all disabled:opacity-60">
                    {saving ? 'Updating…' : 'Update Password'}
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="rounded-md border border-brand-border-gray bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
              <h2 className="text-lg font-black text-brand-dark">Billing &amp; Subscription</h2>
              <p className="mt-1 text-sm font-medium text-brand-text-muted">View your current plan details.</p>
              <div className="mt-8 max-w-2xl">
                <div className="rounded-md border border-brand-green-border bg-brand-bg-green p-6">
                  <span className="inline-flex items-center gap-1 rounded bg-brand-green-bg-light px-2.5 py-1 text-xs font-black text-brand-green-medium">
                    <Sparkles className="h-3.5 w-3.5" />FREE PLAN
                  </span>
                  <h3 className="mt-3 text-xl font-black text-brand-dark">₹0 / month</h3>
                  <p className="mt-2 text-xs font-semibold text-brand-text-muted-blue max-w-md leading-relaxed">
                    Upgrade to Pro for unlimited statement uploads, AI Coach queries, and advanced leak detection.
                  </p>
                </div>
                <div className="mt-6">
                  <button onClick={() => { window.location.href = '/pricing'; }}
                    className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-black text-white shadow-sm hover:bg-primary-light transition-all">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md border border-rose-100 bg-rose-50/20 p-6 lg:p-8">
            <h2 className="text-lg font-black text-brand-red">Sign Out</h2>
            <p className="mt-1 text-sm font-medium text-brand-text-muted">Safely disconnect and clear your session.</p>
            <button onClick={logout}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-red px-6 text-sm font-black text-white shadow-sm hover:bg-brand-red-hover transition-all">
              <LogOut className="h-4 w-4" />Sign Out of Account
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
