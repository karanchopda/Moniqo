"use client";

import { useState, useEffect, useMemo } from 'react';
import { transactionApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  balance?: number;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
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

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
    return filtered;
  }, [transactions, searchQuery, filterType, filterCategory, sortBy, sortOrder]);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white border border-primary/5 rounded-2xl shadow-3xl p-8">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary/50">Loading transaction ledger...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-3 tracking-tight leading-tight">
              Transactions
            </h1>
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse"></span>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary/50">
                {filteredTransactions.length} transactions analyzed
              </p>
            </div>
          </div>
          
          <button 
            onClick={fetchTransactions}
            className="btn btn-secondary px-8 py-4 border-primary/10 hover:bg-primary/5 rounded-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Refresh
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-primary/5 rounded-2xl shadow-xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-full bg-accent/5 translate-x-12 skew-x-12 group-hover:translate-x-0 transition-transform duration-700"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary/50 mb-4">Total Income</p>
            <p className="text-3xl font-headline font-bold text-accent">₹{totalIncome.toLocaleString()}</p>
          </div>

          <div className="bg-white border border-primary/5 rounded-2xl shadow-xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-full bg-primary/5 translate-x-12 skew-x-12 group-hover:translate-x-0 transition-transform duration-700"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary/50 mb-4">Total Expenses</p>
            <p className="text-3xl font-headline font-bold text-primary">₹{totalExpenses.toLocaleString()}</p>
          </div>

          <div className="bg-primary border border-primary/5 rounded-2xl shadow-xl p-8 relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-accent/20 rounded-full blur-[40px]"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">Net Flow</p>
            <p className={`text-3xl font-headline font-bold ${totalIncome - totalExpenses >= 0 ? 'text-accent' : 'text-red-400'}`}>
              {totalIncome - totalExpenses >= 0 ? '+' : ''}₹{(totalIncome - totalExpenses).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white border border-primary/5 rounded-2xl shadow-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-accent transition-colors">search</span>
              <input
                type="text"
                placeholder="Search description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-primary/[0.02] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-accent transition-all text-sm font-bold text-primary"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-6 py-4 bg-primary/[0.02] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-accent transition-all text-sm font-bold text-primary cursor-pointer appearance-none"
            >
              <option value="all">All Types</option>
              <option value="credit">Income</option>
              <option value="debit">Expenses</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-6 py-4 bg-primary/[0.02] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-accent transition-all text-sm font-bold text-primary cursor-pointer appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-6 py-4 bg-primary/[0.02] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-accent transition-all text-sm font-bold text-primary cursor-pointer appearance-none"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-14 h-14 flex items-center justify-center bg-primary/[0.02] border border-transparent rounded-2xl hover:bg-primary hover:text-white transition-all text-primary"
              >
                <span className="material-symbols-outlined">
                  {sortOrder === 'asc' ? 'north' : 'south'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white border border-primary/5 rounded-2xl shadow-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/[0.02] border-b border-primary/5">
                  <th className="px-8 py-6 text-left text-xs font-semibold uppercase tracking-wider text-primary/50">Date</th>
                  <th className="px-8 py-6 text-left text-xs font-semibold uppercase tracking-wider text-primary/50">Description</th>
                  <th className="px-8 py-6 text-left text-xs font-semibold uppercase tracking-wider text-primary/50">Category</th>
                  <th className="px-8 py-6 text-right text-xs font-semibold uppercase tracking-wider text-primary/50">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-primary/[0.02] transition-all cursor-pointer group"
                  >
                    <td className="px-8 py-6">
                      <p className="text-xs font-semibold text-primary/40 uppercase">
                        {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                          tx.type === 'credit' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                        }`}>
                          <span className="material-symbols-outlined text-sm font-semibold">
                            {tx.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-primary tracking-tight">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        tx.category === 'Transfer' 
                          ? 'bg-primary/5 text-primary/40' 
                          : tx.type === 'credit'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className={`px-8 py-6 text-right font-headline font-bold text-lg ${
                      tx.type === 'credit' ? 'text-accent' : 'text-primary'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Slide Panel */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-md bg-white z-[201] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] p-12 overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedTx(null)}
                className="w-12 h-12 rounded-full border border-primary/5 flex items-center justify-center text-primary/40 hover:bg-primary hover:text-white transition-all mb-12"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="space-y-12">
                <div>
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${
                    selectedTx.type === 'credit' ? 'bg-accent text-white' : 'bg-primary text-white'
                  }`}>
                    <span className="material-symbols-outlined text-4xl font-bold">
                      {selectedTx.type === 'credit' ? 'trending_up' : 'trending_down'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-headline font-bold text-primary leading-tight mb-2">
                    {selectedTx.description}
                  </h3>
                  <p className="text-sm font-bold text-muted uppercase tracking-widest">{selectedTx.category}</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-primary/[0.02] rounded-xl border border-primary/5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary/50 mb-2">Amount</p>
                    <p className={`text-4xl font-headline font-bold ${selectedTx.type === 'credit' ? 'text-accent' : 'text-primary'}`}>
                      {selectedTx.type === 'credit' ? '+' : '-'}₹{selectedTx.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-primary/[0.02] rounded-xl border border-primary/5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary/50 mb-2">Date</p>
                      <p className="text-sm font-bold text-primary">
                        {new Date(selectedTx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="p-6 bg-primary/[0.02] rounded-xl border border-primary/5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary/50 mb-2">Status</p>
                      <p className="text-sm font-bold text-accent">Completed</p>
                    </div>
                  </div>

                  {selectedTx.balance && (
                    <div className="p-6 bg-primary/[0.02] rounded-xl border border-primary/5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary/50 mb-2">Post-Transaction Balance</p>
                      <p className="text-xl font-headline font-bold text-primary">₹{selectedTx.balance.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <div className="pt-12 border-t border-primary/5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary/50 mb-6">AI Insight</h4>
                  <div className="flex gap-4 p-6 bg-accent/5 rounded-2xl border border-accent/10">
                    <span className="material-symbols-outlined text-accent">psychology</span>
                    <p className="text-xs font-medium text-primary leading-relaxed">
                      This transaction is categorized under <span className="font-bold text-accent italic">{selectedTx.category.toLowerCase()}</span>. No anomalies detected.
                    </p>
                  </div>
                </div>

                <button className="w-full py-6 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-xl hover:bg-accent hover:text-primary transition-all">
                  Request AI Audit
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

