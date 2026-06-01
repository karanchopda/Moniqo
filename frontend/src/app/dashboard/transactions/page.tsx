"use client";

import { useState, useEffect, useCallback } from 'react';
import { transactionApi } from '@/lib/api';
import { 
  X, 
  Download, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Wallet 
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  statementId?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

const CATEGORIES = [
  'Food & Dining', 'Shopping', 'Transport', 'Utilities & Bills',
  'Entertainment', 'Health', 'Investments', 'Transfer', 'Income', 'Other',
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedType, setSelectedType] = useState<'All' | 'debit' | 'credit'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState(''); // debounced
  const [currentPage, setCurrentPage] = useState(1);

  // Manual entry modal state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'debit',
    category: 'Food & Dining',
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    transactionApi.getAll({
      page: currentPage,
      limit: PAGE_SIZE,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      type: selectedType !== 'All' ? selectedType : undefined,
      search: search || undefined,
    })
      .then(res => {
        setTransactions(res.data.data || []);
        setPagination(res.data.pagination || { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
      })
      .catch(() => {
        setTransactions([]);
        setPagination({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
      })
      .finally(() => setLoading(false));
  }, [currentPage, selectedCategory, selectedType, search]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return setFormError('Description is required.');
    if (!form.amount || Number(form.amount) <= 0) return setFormError('Enter a valid amount.');
    setSubmitting(true);
    setFormError('');
    try {
      await transactionApi.create({
        date: form.date,
        description: form.description.trim(),
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
      });
      setShowModal(false);
      setForm({ date: new Date().toISOString().split('T')[0], description: '', amount: '', type: 'debit', category: 'Food & Dining' });
      // Go back to page 1 to see the new entry
      setCurrentPage(1);
    } catch {
      setFormError('Failed to add transaction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(tx => [
      new Date(tx.date).toLocaleDateString('en-IN'),
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.category,
      tx.type,
      tx.amount,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moniqo_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearFilters = () => {
    setSelectedType('All');
    setSelectedCategory('All');
    setSearchInput('');
    setSearch('');
    setCurrentPage(1);
  };

  const getCategoryBadgeStyle = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('food') || c.includes('dining')) return 'bg-[#fff5f2] text-[#f26a36] border border-[#ffebd6]';
    if (c.includes('invest')) return 'bg-[#eefcf2] text-[#1aa34b] border border-[#d6f5df]';
    if (c.includes('shop')) return 'bg-[#edf5ff] text-[#3b82f6] border border-[#d6e5ff]';
    if (c.includes('util') || c.includes('bill')) return 'bg-[#faf0ff] text-[#a855f7] border border-[#eed6ff]';
    return 'bg-gray-100 text-gray-500';
  };

  const totalDebits = transactions
    .filter(t => t.type === 'debit' && t.category !== 'Transfer')
    .reduce((s, t) => s + Number(t.amount), 0);

  const { page, totalPages, total } = pagination;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  // Page numbers to show (max 5, centred around current page)
  const pageNumbers = (() => {
    const delta = 2;
    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  return (
    <div className="space-y-6 pb-4 font-sans">

      {/* Add Manual Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded shadow-xl w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-primary">Add Manual Entry</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded text-xs font-bold text-primary outline-none focus:border-[#0a5c43] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="e.g. Swiggy Order"
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded text-xs font-bold text-primary outline-none focus:border-[#0a5c43] transition-colors placeholder-gray-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded text-xs font-bold text-primary outline-none focus:border-[#0a5c43] transition-colors placeholder-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded text-xs font-bold text-primary outline-none focus:border-[#0a5c43] transition-colors cursor-pointer"
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded text-xs font-bold text-primary outline-none focus:border-[#0a5c43] transition-colors cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {formError && (
                <p className="text-[11px] font-bold text-red-500">{formError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#0a5c43] hover:bg-[#094d38] text-white rounded text-xs font-bold transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Adding...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Title & Top buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Transaction History</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">Review and manage your financial activity across all connected accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition-all shadow-sm disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0a5c43] hover:bg-[#094d38] text-white rounded text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Manual Entry
          </button>
        </div>
      </div>

      {/* Filters Bar Card */}
      <div className="bg-white border border-gray-200/80 rounded p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
        <div className="grid grid-cols-1 sm:grid-cols-4 items-end gap-6">
          {/* Search */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search description..."
                className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded bg-gray-50/50 text-xs font-bold text-gray-700 outline-none focus:border-[#0a5c43] transition-colors placeholder-gray-300"
              />
            </div>
          </div>
          {/* Category */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 border border-gray-200 rounded bg-gray-50/50 text-xs font-bold text-gray-700 cursor-pointer outline-none hover:bg-gray-50 transition-colors"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Type */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Type</label>
            <div className="flex items-center bg-gray-50 p-1 rounded gap-1">
              {(['All', 'debit', 'credit'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { setSelectedType(s); setCurrentPage(1); }}
                  className={`flex-1 px-4 py-1.5 rounded text-xs font-bold transition-all capitalize ${
                    selectedType === s ? 'bg-[#c6f6d5] text-[#0a5c43]' : 'text-gray-500 hover:bg-white'
                  }`}
                >
                  {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="text-right pb-2">
            <button
              onClick={handleClearFilters}
              className="text-xs font-black text-[#0a5c43] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Table Card */}
      <div className="bg-white border border-gray-200/80 rounded shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 bg-gray-50/50">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Description</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Type</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs font-bold text-gray-400">Loading transactions...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs font-bold text-gray-400">
                    {total === 0 && !search && selectedCategory === 'All' && selectedType === 'All'
                      ? 'No transactions yet. Upload a bank statement to get started.'
                      : 'No transactions match the selected filters.'}
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-extrabold text-primary">{tx.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[9px] font-bold px-3 py-1 rounded uppercase tracking-tight ${getCategoryBadgeStyle(tx.category)}`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded ${tx.type === 'credit' ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                        <span className={`text-xs font-bold capitalize ${tx.type === 'credit' ? 'text-emerald-600' : 'text-primary'}`}>
                          {tx.type}
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-right text-xs font-extrabold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-primary'}`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination bar */}
        <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-bold text-gray-400">
            {total === 0 ? 'No transactions' : `Showing ${from}–${to} of ${total} transactions`}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pageNumbers.map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition-all ${
                  page === p ? 'bg-[#0a5c43] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-[#4d6a5d] rounded p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden border border-emerald-950/10">
          <div className="absolute right-0 bottom-0 w-32 h-32 rounded-tl bg-white/5 pointer-events-none select-none"></div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-white" />
              <span className="text-sm font-black tracking-tight">Monthly Insight</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-semibold">
              Upload a bank statement from the dashboard to get AI-powered insights on your spending patterns and money leaks.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button className="px-5 py-2.5 bg-[#2ebd75] hover:bg-[#28ad6b] text-white rounded font-bold text-xs shadow-md transition-colors">
              Setup Alert
            </button>
            <button className="px-5 py-2.5 border border-white/30 hover:bg-white/10 text-white rounded font-bold text-xs transition-colors">
              More Analysis
            </button>
          </div>
        </div>
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Debits</p>
            <h3 className="text-2xl font-black text-primary mt-1">
              ₹{totalDebits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">Current page · excl. transfers</p>
          </div>
          <button className="w-full py-2.5 mt-6 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded font-bold text-xs transition-colors text-center">
            Manage Budget
          </button>
        </div>
      </div>

    </div>
  );
}
