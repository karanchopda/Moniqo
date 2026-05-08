"use client";

import { useState, useEffect, useMemo } from 'react';
import { transactionApi } from '@/lib/api';

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

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Sort
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

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-primary">Transactions</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl">
          <p className="font-bold mb-2">Error loading transactions</p>
          <p className="text-sm">{error}</p>
          <button onClick={fetchTransactions} className="btn btn-secondary mt-4">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Transactions</h1>
          <p className="text-sm text-muted">
            {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>
        
        <button 
          onClick={fetchTransactions}
          className="btn btn-secondary"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-accent">trending_up</span>
            <span className="text-sm font-bold text-muted">Total Income</span>
          </div>
          <p className="text-2xl font-bold text-accent">₹{totalIncome.toLocaleString()}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary">trending_down</span>
            <span className="text-sm font-bold text-muted">Total Expenses</span>
          </div>
          <p className="text-2xl font-bold text-primary">₹{totalExpenses.toLocaleString()}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-gray-600">account_balance</span>
            <span className="text-sm font-bold text-muted">Net Flow</span>
          </div>
          <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-accent' : 'text-red-500'}`}>
            ₹{(totalIncome - totalExpenses).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted">search</span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="all">All Types</option>
            <option value="credit">Income</option>
            <option value="debit">Expenses</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <span className="material-symbols-outlined">
                {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Category</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-muted uppercase">Amount</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-muted uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-5xl text-gray-300">search_off</span>
                      <p className="text-muted">No transactions found</p>
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setFilterType('all');
                          setFilterCategory('all');
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          transaction.type === 'credit' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                        }`}>
                          <span className="material-symbols-outlined text-sm">
                            {transaction.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-primary">{transaction.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        transaction.category === 'Transfer' 
                          ? 'bg-gray-100 text-gray-600' 
                          : transaction.type === 'credit'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {transaction.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      transaction.type === 'credit' ? 'text-accent' : 'text-primary'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-muted">
                      {transaction.balance ? `₹${transaction.balance.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
