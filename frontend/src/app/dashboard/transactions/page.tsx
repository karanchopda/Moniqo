"use client";

import { useState } from 'react';
import Link from 'next/navigation';

interface Transaction {
  id: string;
  date: string;
  description: string;
  bankInfo: string;
  category: string;
  status: 'Completed' | 'Pending';
  amount: number;
}

export default function TransactionsPage() {
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Pending'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Exact mockup transactions list
  const mockTransactions: Transaction[] = [
    { id: '1', date: 'Oct 28, 2023', description: 'Starbucks Reserve', bankInfo: 'HDFC Bank • **** 1289', category: 'Food & Dining', status: 'Completed', amount: 450.00 },
    { id: '2', date: 'Oct 26, 2023', description: 'Zerodha Broking', bankInfo: 'ICICI Bank • **** 4402', category: 'Investments', status: 'Completed', amount: 25000.00 },
    { id: '3', date: 'Oct 25, 2023', description: 'Amazon India', bankInfo: 'SBI Credit • **** 9910', category: 'Shopping', status: 'Pending', amount: 1299.00 },
    { id: '4', date: 'Oct 24, 2023', description: 'Airtel Postpaid', bankInfo: 'HDFC Bank • **** 1289', category: 'Utilities', status: 'Completed', amount: 899.00 },
    { id: '5', date: 'Oct 22, 2023', description: 'Zomato Limited', bankInfo: 'HDFC Bank • **** 1289', category: 'Food & Dining', status: 'Completed', amount: 320.00 },
  ];

  const getCategoryBadgeStyle = (cat: string) => {
    switch (cat) {
      case 'Food & Dining': return 'bg-[#fff5f2] text-[#f26a36] border border-[#ffebd6]';
      case 'Investments': return 'bg-[#eefcf2] text-[#1aa34b] border border-[#d6f5df]';
      case 'Shopping': return 'bg-[#edf5ff] text-[#3b82f6] border border-[#d6e5ff]';
      case 'Utilities': return 'bg-[#faf0ff] text-[#a855f7] border border-[#eed6ff]';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-6 pb-4 font-sans">
      
      {/* Title & Top buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Transaction History</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">Review and manage your financial activity across all connected accounts.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0a5c43] hover:bg-[#094d38] text-white rounded-xl text-xs font-bold transition-all shadow-md">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Manual Entry
          </button>
        </div>
      </div>

      {/* Filters Bar Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
        <div className="grid grid-cols-1 sm:grid-cols-4 items-end gap-6">
          {/* Date range picker */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Date Range</label>
            <div className="flex items-center gap-2 pl-3 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">calendar_today</span>
              <span className="text-xs font-bold text-gray-700">Oct 01 - Oct 31, 2023</span>
            </div>
          </div>

          {/* Category dropdown */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-xs font-bold text-gray-700 cursor-pointer outline-none hover:bg-gray-50 transition-colors"
            >
              <option value="All">All Categories</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Investments">Investments</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>

          {/* Status buttons */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Status</label>
            <div className="flex items-center bg-gray-50 p-1 rounded-xl gap-1">
              <button 
                onClick={() => setSelectedStatus('All')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStatus === 'All'
                    ? 'bg-[#c6f6d5] text-[#0a5c43]'
                    : 'text-gray-500 hover:bg-white'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setSelectedStatus('Pending')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStatus === 'Pending'
                    ? 'bg-[#c6f6d5] text-[#0a5c43]'
                    : 'text-gray-500 hover:bg-white'
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="text-right pb-2">
            <button className="text-xs font-black text-[#0a5c43] hover:underline">
              Clear all filters
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Table Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 bg-gray-50/50">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Description</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-primary">{tx.description}</span>
                      <span className="text-[10px] font-semibold text-gray-400 mt-0.5">{tx.bankInfo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-tight ${getCategoryBadgeStyle(tx.category)}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                      <span className={`text-xs font-bold ${tx.status === 'Completed' ? 'text-primary' : 'text-gray-400 italic'}`}>
                        {tx.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-extrabold text-primary">
                    ₹ {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-bold text-gray-400">
            Showing 1 to 5 of 124 transactions
          </p>

          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all select-none">
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center bg-[#0a5c43] text-white shadow-sm">1</button>
            <button className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center text-gray-500 hover:bg-gray-100">2</button>
            <button className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center text-gray-500 hover:bg-gray-100">3</button>
            <span className="text-gray-400 text-xs px-1">...</span>
            <button className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center text-gray-500 hover:bg-gray-100">25</button>
            <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all select-none">
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left widget: Monthly Insight (col-span-8) */}
        <div className="lg:col-span-8 bg-[#4d6a5d] rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden border border-emerald-950/10">
          <div className="absolute right-0 bottom-0 w-32 h-32 rounded-tl-full bg-white/5 pointer-events-none select-none"></div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>account_balance_wallet</span>
              <span className="text-sm font-black tracking-tight">Monthly Insight</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-semibold">
              "Your spending on <span className="font-black text-[#a3e8cc]">Food & Dining</span> is 12% higher than last month. Most of this is attributed to late-night orders. Switching to home-cooked meals 2 extra days a week could save you <span className="font-black text-[#a3e8cc]">₹4,500</span> by month-end."
            </p>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className="px-5 py-2.5 bg-[#2ebd75] hover:bg-[#28ad6b] text-white rounded-xl font-bold text-xs shadow-md transition-colors">
              Setup Alert
            </button>
            <button className="px-5 py-2.5 border border-white/30 hover:bg-white/10 text-white rounded-xl font-bold text-xs transition-colors">
              More Analysis
            </button>
          </div>
        </div>

        {/* Right widget: Total Spent (col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Spent (Oct)</p>
            <h3 className="text-2xl font-black text-primary mt-1">₹ 42,670.00</h3>
          </div>

          <div className="mt-4">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black mt-2">
              <span className="text-gray-400">Budget: ₹ 55,000</span>
              <span className="text-emerald-600">78% Used</span>
            </div>
          </div>

          <button className="w-full py-2.5 mt-6 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-bold text-xs transition-colors text-center">
            Manage Budget
          </button>
        </div>

      </div>

    </div>
  );
}
