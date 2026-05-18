"use client";

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import EmailVerificationBanner from '@/components/ui/EmailVerificationBanner';
import { transactionApi, reportApi } from '@/lib/api';
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

interface Report {
  id: string;
  totalSpent: number;
  aiInsights: string;
  leaks: { title: string; amount: number; impact: 'high' | 'medium' | 'low' }[];
  dailyAverage: number;
}

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [txRes, reportRes] = await Promise.all([
        transactionApi.getAll().catch(() => ({ data: [] })),
        reportApi.getLatest().catch(() => ({ data: null }))
      ]);
      
      setTransactions(txRes.data || []);
      setReport(reportRes.data || null);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard');
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

  // Fallback mock leaks if no report exists but we have transactions
  const defaultLeaks = [
    { title: "Unused Subscriptions (Netflix, Prime)", amount: 1499, impact: 'high' },
    { title: "High Dining Frequency", amount: 4200, impact: 'medium' }
  ];
  
  const displayLeaks = report?.leaks && report.leaks.length > 0 ? report.leaks : (transactions.length > 0 ? defaultLeaks : []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white border border-primary/5 rounded-3xl shadow-sm overflow-hidden p-8">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary/50">Analyzing financial matrix...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white border border-primary/5 rounded-3xl shadow-sm overflow-hidden p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-600 border border-red-100">
          <span className="material-symbols-outlined text-3xl">cloud_off</span>
        </div>
        <h2 className="text-2xl font-headline font-bold text-primary mb-3 tracking-tight">Failed to load dashboard</h2>
        <p className="text-muted max-w-md mb-8 font-medium text-sm">{error}</p>
        <button onClick={fetchDashboardData} className="btn btn-primary px-8 py-4 shadow-sm">
          <span className="material-symbols-outlined">refresh</span>
          Retry
        </button>
      </div>
    );
  }

  const hasData = transactions.length > 0;

  return (
    <div className="space-y-8 pb-16">
      {user && !user.emailVerified && <EmailVerificationBanner email={user.email} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary tracking-tight leading-tight mb-2">
            Welcome back, <span className="text-accent italic">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full ${hasData ? 'bg-accent animate-pulse' : 'bg-gray-300'}`}></span>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary/50">
              {hasData ? `${transactions.length} Transactions Analyzed` : 'Awaiting first statement'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href="/dashboard/sync" className="flex-1 md:flex-none btn bg-white text-primary border border-gray-200 hover:border-accent hover:text-accent shadow-sm px-5 py-3 rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            Upload
          </Link>
          <Link href="/dashboard/coach" className="flex-1 md:flex-none btn btn-primary px-5 py-3 shadow-sm rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            AI Coach
          </Link>
        </div>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="min-h-[50vh] flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden p-10 relative">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 shadow-sm relative group hover:scale-105 transition-transform duration-500">
            <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-accent transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>document_scanner</span>
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary mb-3 tracking-tight">Initiate Your <span className="text-accent italic">First Audit</span></h2>
          <p className="text-muted max-w-md mb-8 leading-relaxed font-medium text-center text-sm">
            Moniqo needs data to work its magic. Upload your first bank or credit card statement to instantly identify spending leaks and get tailored wealth advice.
          </p>
          <Link href="/dashboard/sync" className="btn btn-primary py-4 px-10 text-sm shadow-sm rounded-xl flex items-center gap-2 group">
            <span className="material-symbols-outlined transition-transform group-hover:-translate-y-1">upload</span>
            Upload Statement
          </Link>
        </div>
      ) : (
        /* Populated Dashboard Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Chart Card */}
          <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] p-7 relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Net Balance</span>
                </div>
                <h2 className="text-4xl font-headline font-bold text-primary tracking-tight">₹{totalBalance.toLocaleString()}</h2>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${netFlow >= 0 ? 'bg-accent/10 text-accent' : 'bg-red-50 text-red-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">{netFlow >= 0 ? 'trending_up' : 'trending_down'}</span>
                  {netFlow >= 0 ? 'Surplus' : 'Deficit'}
                </div>
                <p className="text-xs font-medium text-muted mt-2">{netFlow >= 0 ? '+' : ''}₹{netFlow.toLocaleString()} this period</p>
              </div>
            </div>

            <div className="flex-1 min-h-[220px] w-full bg-gray-50/50 rounded-2xl p-4 border border-gray-100 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7Days}>
                  <defs>
                    <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                  <XAxis dataKey="date" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF' }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #F3F4F6', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '8px 12px' }}
                    itemStyle={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '13px' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#spendingGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Total Inflow</p>
                  <p className="text-xl font-headline font-bold text-primary">₹{totalIncome.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined text-[20px]">south_west</span>
                </div>
              </div>
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Total Outflow</p>
                  <p className="text-xl font-headline font-bold text-primary">₹{totalExpenses.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-red-400">
                  <span className="material-symbols-outlined text-[20px]">north_east</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights & Leaks Card */}
          <div className="lg:col-span-4 bg-primary border border-primary/5 rounded-3xl shadow-xl p-7 text-white relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-primary to-primary pointer-events-none"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-accent/20 flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-accent/90">AI Insights</span>
              </div>
            </div>

            <div className="relative z-10 flex-1">
              <p className="text-sm font-medium text-white/90 leading-relaxed mb-6">
                {report?.aiInsights || "Moniqo AI has analyzed your recent statement and found potential areas for optimization."}
              </p>
              
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Detected Leaks</p>
                {displayLeaks.map((leak, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3.5 flex justify-between items-center group cursor-pointer hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${leak.impact === 'high' ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]' : 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]'}`}></div>
                      <span className="text-xs font-semibold text-white truncate max-w-[140px]">{leak.title}</span>
                    </div>
                    <span className="text-xs font-bold text-accent">₹{leak.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard/coach" className="relative z-10 mt-6 w-full py-3.5 text-center bg-white text-primary rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              Ask AI Coach
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Bottom Row: Category Breakdown */}
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                  <span className="material-symbols-outlined text-[14px]">donut_small</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Categories</span>
              </div>
            </div>
            <div className="space-y-5">
              {topCategories.map((cat, i) => (
                <div key={i} className="group cursor-default">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-primary">{cat.name}</span>
                    <span className="text-sm font-bold text-primary">₹{cat.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(cat.value / totalExpenses) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row: Recent Activity */}
          <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                  <span className="material-symbols-outlined text-[14px]">history</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Recent Activity</span>
              </div>
              <Link href="/dashboard/transactions" className="text-[11px] font-bold uppercase tracking-widest text-accent hover:underline">View All</Link>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${item.type === 'credit' ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-500'}`}>
                      <span className="material-symbols-outlined text-[20px]">{item.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary truncate max-w-[200px] sm:max-w-[300px]">{item.action}</p>
                      <p className="text-xs font-medium text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${item.type === 'credit' ? 'text-accent' : 'text-primary'}`}>
                    {item.type === 'credit' ? '+' : '-'}₹{item.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
