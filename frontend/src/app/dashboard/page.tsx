"use client";

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, ResponsiveContainer,
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip
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

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Fetch transactions
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

  // Calculate metrics from real data
  const totalBalance = transactions.length > 0 && transactions[0].balance 
    ? transactions[0].balance 
    : 0;

  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const netFlow = totalIncome - totalExpenses;

  // Category breakdown for expenses
  const categoryBreakdown: { [key: string]: number } = {};
  transactions
    .filter(t => t.type === 'debit')
    .forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, value]) => ({ name, value }));

  // Chart data - last 7 days of spending
  const last7Days = transactions
    .filter(t => t.type === 'debit')
    .slice(0, 7)
    .reverse()
    .map(t => ({
      date: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      amount: t.amount
    }));

  // Recent activity from transactions
  const recentActivity = transactions.slice(0, 4).map(t => ({
    time: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    action: t.description,
    status: t.type === 'credit' ? 'success' : 'info',
    amount: t.amount,
    type: t.type
  }));

  const COLORS = ['#00331c', '#2b685c', '#3fc580', '#b0efdf'];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Loading your financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasData = transactions.length > 0;

  return (
    <div className="space-y-8">
      {/* Email Verification Banner */}
      {user && !user.emailVerified && (
        <EmailVerificationBanner email={user.email} />
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-accent"></span>
            <p className="text-sm text-muted">
              {hasData ? `${transactions.length} transactions loaded` : 'No data yet'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={fetchTransactions}
          className="btn btn-secondary"
          disabled={loading}
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
          <span className="material-symbols-outlined">error</span>
          <div>
            <p className="font-bold">Error loading data</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!hasData ? (
        // Empty State
        <div className="card p-12 text-center">
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-primary">upload_file</span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">No Transactions Yet</h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Upload your first bank statement to start tracking your finances and get AI-powered insights.
          </p>
          <Link href="/dashboard/sync" className="btn btn-primary inline-flex">
            <span className="material-symbols-outlined">drive_folder_upload</span>
            Upload Statement
          </Link>
        </div>
      ) : (
        // Dashboard with Real Data
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Financial Overview Card */}
          <div className="lg:col-span-2 card card-hover p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                    <span className="text-sm font-bold text-muted">Current Balance</span>
                  </div>
                  <h2 className="text-5xl font-bold text-primary">
                    ₹{totalBalance.toLocaleString()}
                  </h2>
                  <p className="text-sm text-muted mt-3 leading-relaxed">
                    Net flow: <span className={`font-bold ${netFlow >= 0 ? 'text-accent' : 'text-red-500'}`}>
                      {netFlow >= 0 ? '+' : ''}₹{netFlow.toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-muted mb-1">Total Income</p>
                    <p className="text-lg font-bold text-accent">₹{totalIncome.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-muted mb-1">Total Expenses</p>
                    <p className="text-lg font-bold text-primary">₹{totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 h-64 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={last7Days}>
                    <defs>
                      <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3fc580" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3fc580" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3fc580" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#spendingGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Categories Card */}
          <div className="card card-hover p-8 bg-gray-50">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">pie_chart</span>
              <span className="text-sm font-bold text-muted">Top Spending Categories</span>
            </div>
            
            <div className="space-y-4">
              {topCategories.map((cat, i) => {
                const percentage = (cat.value / totalExpenses) * 100;
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-primary">{cat.name}</span>
                      <span className="text-sm font-bold text-muted">₹{cat.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS[i % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link 
              href="/dashboard/sync"
              className="btn btn-primary w-full mt-6"
            >
              <span className="material-symbols-outlined">analytics</span>
              View Full Analysis
            </Link>
          </div>

          {/* Activity Feed */}
          <div className="card card-hover p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400">history</span>
                <span className="text-sm font-bold text-muted">Recent Activity</span>
              </div>
              <Link href="/dashboard/transactions" className="text-xs font-bold text-primary hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-6">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      item.type === 'credit' ? 'bg-accent' : 'bg-primary'
                    }`}></div>
                    {idx !== recentActivity.length - 1 && <div className="w-px h-full bg-gray-200 mt-2"></div>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-700 truncate">{item.action}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted">{item.time}</p>
                      <p className={`text-xs font-bold ${item.type === 'credit' ? 'text-accent' : 'text-primary'}`}>
                        {item.type === 'credit' ? '+' : '-'}₹{item.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 card card-hover p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-gray-400">bolt</span>
              <span className="text-sm font-bold text-muted">Quick Actions</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link 
                href="/dashboard/sync"
                className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition-all group"
              >
                <span className="material-symbols-outlined text-3xl text-primary mb-3 block group-hover:scale-110 transition-transform">upload_file</span>
                <p className="font-bold text-primary mb-1">Upload Statement</p>
                <p className="text-xs text-muted">Add new transactions</p>
              </Link>

              <Link 
                href="/dashboard/coach"
                className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition-all group"
              >
                <span className="material-symbols-outlined text-3xl text-accent mb-3 block group-hover:scale-110 transition-transform">psychology</span>
                <p className="font-bold text-primary mb-1">AI Coach</p>
                <p className="text-xs text-muted">Get financial advice</p>
              </Link>

              <Link 
                href="/dashboard/transactions"
                className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition-all group"
              >
                <span className="material-symbols-outlined text-3xl text-primary mb-3 block group-hover:scale-110 transition-transform">receipt_long</span>
                <p className="font-bold text-primary mb-1">All Transactions</p>
                <p className="text-xs text-muted">View complete history</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
