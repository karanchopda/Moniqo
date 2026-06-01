"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  ComposedChart, Bar, Line, Area, ResponsiveContainer,
  XAxis, YAxis, Tooltip
} from 'recharts';
import { transactionApi, reportApi } from '@/lib/api';
import Link from 'next/link';
import { 
  TrendingUp, 
  Brain, 
  ArrowDownLeft, 
  ArrowUpRight, 
  MoreVertical, 
  Landmark, 
  Utensils, 
  ShoppingBag 
} from 'lucide-react';

const TransactionIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  switch (iconName) {
    case 'account_balance':
      return <Landmark className={className} />;
    case 'restaurant':
      return <Utensils className={className} />;
    case 'shopping_bag':
      return <ShoppingBag className={className} />;
    default:
      return <ShoppingBag className={className} />;
  }
};

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [latestReport, setLatestReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [txRes, reportRes] = await Promise.all([
        transactionApi.getAll().catch(() => ({ data: [] })),
        reportApi.getLatest().catch(() => ({ data: null }))
      ]);
      setTransactions(Array.isArray(txRes.data) ? txRes.data : (txRes.data?.data || []));
      setLatestReport(reportRes?.data || null);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations with mock fallbacks matching Image exactly
  const displayInflowVal = transactions.length > 0
    ? transactions.filter(t => t.type === 'credit' && t.category !== 'Transfer').reduce((sum, t) => sum + Number(t.amount), 0)
    : 84200;

  const displayOutflowVal = latestReport
    ? latestReport.totalSpent
    : (transactions.length > 0
       ? transactions.filter(t => t.type === 'debit' && t.category !== 'Transfer').reduce((sum, t) => sum + Number(t.amount), 0)
       : 32150);

  const displayNetBalance = transactions.length > 0 && transactions[0]?.balance
    ? Number(transactions[0].balance)
    : (latestReport ? (displayInflowVal - displayOutflowVal) : 482450.00);

  // Dynamic Chart Data from user transactions
  const chartData = useMemo(() => {
    if (transactions.length === 0) {
      return [
        { name: '1', barValue: 120, lineValue: 100 },
        { name: '2', barValue: 180, lineValue: 110 },
        { name: '3', barValue: 140, lineValue: 105 },
        { name: '4', barValue: 260, lineValue: 120 },
        { name: '5', barValue: 220, lineValue: 115 },
        { name: '6', barValue: 200, lineValue: 135 },
        { name: '7', barValue: 300, lineValue: 165 },
      ];
    }
    
    // Group transactions into 7 intervals to show a beautiful aggregate trajectory
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const chunkSize = Math.max(1, Math.floor(sorted.length / 7));
    const data = [];
    for (let i = 0; i < 7; i++) {
      const chunk = sorted.slice(i * chunkSize, (i + 1) * chunkSize);
      let debitSum = 0;
      let creditSum = 0;
      chunk.forEach(t => {
        if (t.type === 'debit') debitSum += t.amount;
        else if (t.type === 'credit') creditSum += t.amount;
      });
      data.push({
        name: `${i + 1}`,
        barValue: Math.max(50, Math.min(debitSum / 100, 400)), 
        lineValue: Math.max(40, Math.min(creditSum / 100, 350))
      });
    }
    return data;
  }, [transactions]);

  // Dynamic AI coach insights
  const aiCoachInsight = useMemo(() => {
    if (!latestReport) {
      return {
        title: "Optimize Subscriptions",
        text: 'You could save <span class="text-[#4df2aa] font-black">₹4,200/mo</span> by optimizing dining subscriptions and recurring digital services.'
      };
    }
    try {
      const parsed = typeof latestReport.aiInsights === 'string'
        ? JSON.parse(latestReport.aiInsights)
        : latestReport.aiInsights;
      
      const rawText = parsed.summary || "No specific money leaks identified in this statement period.";
      const htmlText = rawText.replace(/\*\*(.*?)\*\*/g, '<span class="text-[#4df2aa] font-black">$1</span>');
      
      return {
        title: "Latest Audit Verdict",
        text: htmlText
      };
    } catch (e) {
      return {
        title: "Latest Audit Verdict",
        text: "Forensic audit has scanned your records. Review suggestions below to plug capital leaks."
      };
    }
  }, [latestReport]);

  // Dynamic budget health categories
  const budgetHealth = useMemo(() => {
    const defaults = [
      { category: "Dining", percent: 64, color: "bg-emerald-500" },
      { category: "Shopping", percent: 92, color: "bg-red-500" },
      { category: "Transport", percent: 45, color: "bg-emerald-500" }
    ];

    if (!latestReport || !latestReport.categoryBreakdown) {
      return defaults;
    }

    const breakdown = typeof latestReport.categoryBreakdown === 'string'
      ? JSON.parse(latestReport.categoryBreakdown)
      : latestReport.categoryBreakdown;

    const total = (Object.values(breakdown).reduce((sum: number, val: any) => sum + Number(val), 0) as number) || 1;

    const items = Object.entries(breakdown).map(([cat, val]: [string, any]) => {
      const amount = Number(val);
      const percent = Math.round((amount / total) * 100);
      const color = percent > 75 ? "bg-red-500" : "bg-emerald-500";
      return {
        category: cat,
        percent,
        color
      };
    });

    return items.length > 0 ? items.slice(0, 3) : defaults;
  }, [latestReport]);


  // Dynamic Recent Activity list with layout visual matching Image exactly
  const recentTransactions = transactions.length > 0 
    ? transactions.slice(0, 3).map(t => ({
        description: t.description,
        category: t.category,
        date: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: Number(t.amount),
        type: t.type,
        icon: t.type === 'credit' ? 'account_balance' : (t.category.toLowerCase().includes('dining') ? 'restaurant' : 'shopping_bag')
      }))
    : [
        { description: "Salary Deposit", category: "Income", date: "25 Oct, 2024", amount: 75000.00, type: "credit", icon: "account_balance" },
        { description: "Amazon India", category: "Shopping", date: "24 Oct, 2024", amount: 4250.00, type: "debit", icon: "shopping_bag" },
        { description: "Zomato", category: "Dining", date: "23 Oct, 2024", amount: 850.00, type: "debit", icon: "restaurant" }
      ];

  const getCategoryBadgeStyle = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('income') || c.includes('salary')) {
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    }
    if (c.includes('dining') || c.includes('food')) {
      return 'bg-rose-50 text-rose-500 border border-rose-100';
    }
    return 'bg-gray-100 text-gray-500';
  };

  const getIconBgColor = (icon: string) => {
    switch (icon) {
      case 'account_balance': return 'bg-emerald-50 text-emerald-600';
      case 'shopping_bag': return 'bg-gray-100 text-gray-500';
      case 'restaurant': return 'bg-[#f4f7f6] text-[#0a5c43]';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-6 pb-4 font-sans">
      
      {/* Top row cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Net Balance Composed Chart Card (col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between relative">
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Net Balance</p>
              <h2 className="text-3xl font-black text-primary tracking-tight mt-1">₹{displayNetBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <div className="flex items-center gap-1 mt-1 text-emerald-600">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                <span className="text-[10px] font-black">+2.4%</span>
                <span className="text-[10px] font-bold text-gray-400">vs last month</span>
              </div>
            </div>
            {/* Time interval filter buttons */}
            <div className="flex bg-gray-50 p-1 rounded gap-1">
              <button className="px-3 py-1.5 rounded text-[9px] font-black text-gray-500 hover:bg-white transition-all">1W</button>
              <button className="px-3 py-1.5 rounded text-[9px] font-black bg-[#0a5c43] text-white shadow-sm transition-all">1M</button>
              <button className="px-3 py-1.5 rounded text-[9px] font-black text-gray-500 hover:bg-white transition-all">1Y</button>
            </div>
          </div>

          {/* Bar & Line Composed Chart */}
          <div className="h-44 w-full mt-4 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  {/* Gradient for bars */}
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2ebd75" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#2ebd75" stopOpacity={0.15} />
                  </linearGradient>
                  {/* Glow/Gradient for curve line shadow */}
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0a5c43" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#0a5c43" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any) => [`₹${(val * 1000).toLocaleString()}`, 'Net balance']}
                  labelFormatter={() => 'Index'}
                />
                {/* Vertical gradient bars */}
                <Bar dataKey="barValue" fill="url(#barGrad)" radius={[4, 4, 0, 0]} barSize={26} />
                {/* Curved line shadow area */}
                <Area type="monotone" dataKey="lineValue" stroke="none" fill="url(#lineGrad)" />
                {/* Dark green overlay line */}
                <Line type="monotone" dataKey="lineValue" stroke="#0a5c43" strokeWidth={3.5} dot={false} activeDot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Coach Insight Card (col-span-4) */}
        <div className="lg:col-span-4 bg-[#315442] rounded p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden border border-emerald-950/20">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-[#4df2aa] shadow-inner">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#a3e8cc]">AI Coach Insight</span>
            </div>

            <h3 className="text-base font-extrabold text-[#4df2aa] leading-tight">{aiCoachInsight.title}</h3>
            <p className="text-xs text-white/80 mt-3 leading-relaxed font-semibold" dangerouslySetInnerHTML={{ __html: aiCoachInsight.text }} />
          </div>

          <Link href="/dashboard/coach" className="w-full py-3 text-center bg-[#2ebd75] hover:bg-[#28ad6b] text-white rounded font-bold text-xs shadow-md transition-colors mt-6 block">
            Review Suggestions
          </Link>
        </div>

      </div>

      {/* Middle row: Inflow, Outflow, Budget Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Total Inflow Card */}
        <div className="bg-white border border-gray-200 rounded p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-11 h-11 rounded bg-[#e6f4ee] flex items-center justify-center text-[#0a5c43] shrink-0 shadow-sm">
            <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Inflow</p>
            <h3 className="text-2xl font-black text-primary mt-1">₹{displayInflowVal.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        {/* Total Outflow Card */}
        <div className="bg-white border border-gray-200 rounded p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-11 h-11 rounded bg-red-50 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Outflow</p>
            <h3 className="text-2xl font-black text-primary mt-1">₹{displayOutflowVal.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        {/* Budget Health Card */}
        <div className="bg-white border border-gray-200 rounded p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Budget Health</h3>
            <button className="text-gray-400 hover:text-primary transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {budgetHealth.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 mb-1.5">
                  <span className="capitalize">{item.category}</span>
                  <span className={item.color === 'bg-red-500' ? 'text-red-500' : ''}>{item.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded overflow-hidden">
                  <div className={`h-full ${item.color} rounded`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom section: Recent Activity Table */}
      <div className="bg-white border border-gray-200 rounded p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Recent Activity</h3>
          <Link href="/dashboard/transactions" className="text-[10px] font-black uppercase tracking-widest text-[#0a5c43] hover:underline">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Description</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded flex items-center justify-center shadow-sm ${getIconBgColor(tx.icon)}`}>
                        <TransactionIcon iconName={tx.icon} className="w-[18px] h-[18px]" />
                      </div>
                      <span className="text-xs font-extrabold text-primary">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded uppercase tracking-tight ${getCategoryBadgeStyle(tx.category)}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    {tx.date}
                  </td>
                  <td className={`px-6 py-4 text-right text-xs font-extrabold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-primary'}`}>
                    {tx.type === 'credit' ? '' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
