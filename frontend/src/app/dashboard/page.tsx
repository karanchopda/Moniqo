"use client";

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import EmailVerificationBanner from '@/components/ui/EmailVerificationBanner';
import { transactionApi } from '@/lib/api';
import Link from 'next/link';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  balance?: number;
}

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionApi.getAll();
      setTransactions(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch transactions:', err);
      setError(err.response?.data?.error || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = transactions.length > 0 && transactions[0].balance ? transactions[0].balance : 0;
  const totalIncome = transactions.filter(t => t.type === 'credit' && t.category !== 'Transfer').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'debit' && t.category !== 'Transfer').reduce((sum, t) => sum + t.amount, 0);
  const netFlow = totalIncome - totalExpenses;

  const categoryBreakdown: { [key: string]: number } = {};
  transactions.filter(t => t.type === 'debit').forEach(t => {
    categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
  });

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, value]) => ({ name, value }));

  const last7Days = transactions
    .filter(t => t.type === 'debit')
    .slice(0, 7)
    .reverse()
    .map(t => ({
      date: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      amount: t.amount
    }));

  const recentActivity = transactions.slice(0, 4).map(t => ({
    time: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    action: t.description,
    amount: t.amount,
    type: t.type
  }));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white border border-primary/5 rounded-2xl shadow-3xl overflow-hidden p-8">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary/50">Loading financial overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white border border-primary/5 rounded-2xl shadow-3xl overflow-hidden p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-600 border border-red-100">
          <span className="material-symbols-outlined text-3xl">cloud_off</span>
        </div>
        <h2 className="text-2xl font-headline font-bold text-primary mb-3 tracking-tight">Failed to load dashboard</h2>
        <p className="text-muted max-w-md mb-8 font-medium text-sm">{error}</p>
        <button onClick={fetchTransactions} className="btn btn-primary px-8 py-4 shadow-xl">
          <span className="material-symbols-outlined">refresh</span>
          Retry
        </button>
      </div>
    );
  }

  const hasData = transactions.length > 0;

  return (
    <div className="space-y-10 pb-16">
      {user && !user.emailVerified && <EmailVerificationBanner email={user.email} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight leading-tight">
            Welcome back, <br/>
            <span className="text-accent italic">{user?.name || 'User'}</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className={`flex h-2.5 w-2.5 rounded-full ${hasData ? 'bg-accent animate-pulse' : 'bg-gray-300'}`}></span>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary/50">
              {hasData ? `${transactions.length} Transactions Analyzed` : 'No transactions'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/dashboard/sync" className="flex-1 md:flex-none btn btn-secondary px-6 py-4 border-primary/10 hover:bg-primary/5 rounded-xl">
            <span className="material-symbols-outlined text-lg">sync</span>
            Upload Statement
          </Link>
          <Link href="/dashboard/coach" className="flex-1 md:flex-none btn btn-primary px-6 py-4 shadow-xl rounded-xl">
            <span className="material-symbols-outlined text-lg text-primary font-bold">psychology</span>
            AI Money Coach
          </Link>
        </div>
      </div>

      {!hasData ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center bg-white border border-primary/5 rounded-2xl shadow-3xl overflow-hidden p-8 relative">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="w-16 h-16 bg-primary/5 rounded-xl flex items-center justify-center mb-6 border border-primary/10 shadow-sm relative group hover:rotate-12 transition-transform duration-500">
            <span className="material-symbols-outlined text-3xl text-primary/30 group-hover:text-accent transition-colors">cloud_upload</span>
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary mb-3 tracking-tight">Initiate Your <span className="text-accent italic">First Audit</span></h2>
          <p className="text-muted max-w-md mb-8 leading-relaxed font-medium text-center text-sm">
            Get a complete picture of your finances. Upload your bank statement to identify spending leaks, analyze categories, and get tailored AI wealth advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link href="/dashboard/sync" className="flex-1 btn btn-primary py-4 text-sm shadow-xl rounded-xl">
              Upload Statement
            </Link>
            <Link href="/features" className="flex-1 btn btn-secondary py-4 text-sm border-primary/10 hover:bg-primary/5 rounded-xl">
              View Features
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-primary/5 rounded-2xl shadow-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-accent/[0.03] to-transparent pointer-events-none"></div>
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <span className="material-symbols-outlined text-xs">account_balance_wallet</span>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary/50">Consolidated Balance</span>
                  </div>
                  <h2 className="text-5xl font-headline font-bold text-primary tracking-tight">₹{totalBalance.toLocaleString()}</h2>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${netFlow >= 0 ? 'bg-accent/10 text-accent' : 'bg-red-50 text-red-500'}`}>
                      {netFlow >= 0 ? 'Net Savings' : 'Net Deficit'}
                    </span>
                    <span className="text-xs font-medium text-muted">{netFlow >= 0 ? '+' : ''}₹{netFlow.toLocaleString()} this period</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/[0.02] rounded-xl p-4 border border-primary/5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary/50 mb-1">Inflow</p>
                    <p className="text-lg font-headline font-bold text-accent">₹{totalIncome.toLocaleString()}</p>
                  </div>
                  <div className="bg-primary/[0.02] rounded-xl p-4 border border-primary/5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary/50 mb-1">Outflow</p>
                    <p className="text-lg font-headline font-bold text-primary">₹{totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 h-64 bg-primary/[0.02] rounded-xl p-4 border border-primary/5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={last7Days}>
                    <defs>
                      <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3fc580" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3fc580" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                    <XAxis dataKey="date" fontSize={9} fontWeight={700} tickLine={false} axisLine={false} tick={{ fill: 'rgba(0,0,0,0.3)' }} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ background: '#fff', border: 'none', borderRadius: '1rem', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '0.75rem 1rem' }}
                      itemStyle={{ fontWeight: 700, color: '#00331c', fontSize: '12px' }}
                      labelStyle={{ fontSize: '9px', fontWeight: 700, color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', marginBottom: '0.2rem' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#3fc580" strokeWidth={3} fillOpacity={1} fill="url(#spendingGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-primary border border-primary/5 rounded-2xl shadow-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-accent">
                <span className="material-symbols-outlined text-xs">pie_chart</span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Category Breakdown</span>
            </div>
            <div className="space-y-6">
              {topCategories.map((cat, i) => (
                <div key={i} className="group cursor-default">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold tracking-tight group-hover:text-accent transition-colors">{cat.name}</span>
                    <span className="text-xs font-bold text-white/50">₹{cat.value.toLocaleString()}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(63,197,128,0.5)]" style={{ width: `${(cat.value / totalExpenses) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/transactions" className="mt-8 block w-full py-3 text-center border border-white/10 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors">
              View All Transactions
            </Link>
          </div>

          <div className="bg-white border border-primary/5 rounded-2xl shadow-3xl p-8 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary/30">
                  <span className="material-symbols-outlined text-xs">history</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary/50">Recent Activity</span>
              </div>
              <Link href="/dashboard/transactions" className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline">View All</Link>
            </div>
            <div className="space-y-6">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex gap-4 group/item">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1.5 transition-transform duration-300 group-hover/item:scale-150 ${item.type === 'credit' ? 'bg-accent shadow-[0_0_10px_rgba(63,197,128,0.5)]' : 'bg-primary'}`}></div>
                    {idx !== recentActivity.length - 1 && <div className="w-px h-full bg-primary/5 mt-2"></div>}
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-xs font-bold text-primary truncate tracking-tight">{item.action}</p>
                    <div className="flex justify-between items-center mt-1.5">
                      <p className="text-xs font-semibold text-primary/40">{item.time}</p>
                      <p className={`text-xs font-bold ${item.type === 'credit' ? 'text-accent' : 'text-primary'}`}>
                        {item.type === 'credit' ? '+' : '-'}₹{item.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-primary/5 rounded-2xl shadow-3xl p-8 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary/30">
                <span className="material-symbols-outlined text-xs">bolt</span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary/50">Quick Actions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: 'Upload Statement', icon: 'cloud_upload', href: '/dashboard/sync', desc: 'Sync and audit statement.' },
                { label: 'AI Money Coach', icon: 'psychology', href: '/dashboard/coach', desc: 'Consult AI wealth advisor.' },
                { label: 'Transactions', icon: 'account_balance', href: '/dashboard/transactions', desc: 'Review transaction logs.' }
              ].map((action, i) => (
                <Link key={i} href={action.href} className="p-6 bg-primary/[0.02] rounded-xl border border-primary/5 hover:border-accent hover:bg-accent/[0.02] transition-all duration-500 group">
                  <div className="w-10 h-10 bg-white border border-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-[15deg] transition-transform shadow-sm">
                    <span className="material-symbols-outlined text-xl text-primary/30 group-hover:text-accent">{action.icon}</span>
                  </div>
                  <p className="font-headline font-bold text-primary text-lg mb-1 tracking-tight">{action.label}</p>
                  <p className="text-xs text-muted font-medium">{action.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
