"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Ellipsis,
  Plus,
  Search,
  WalletCards,
  X,
} from 'lucide-react';
import { transactionApi } from '@/lib/api';

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
  'Food & Dining',
  'Shopping',
  'Transport',
  'Utilities & Bills',
  'Entertainment',
  'Health',
  'Investments',
  'Transfer',
  'Income',
  'Other',
];

const formatCurrency = (value: number) =>
  `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const getCategoryBadgeStyle = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes('income') || normalized.includes('salary')) return 'bg-[#d9f2e5] text-[#078649]';
  if (normalized.includes('shopping')) return 'bg-[#dcf5d2] text-[#1b8e11]';
  if (normalized.includes('transport')) return 'bg-[#d8f3e4] text-[#078649]';
  if (normalized.includes('food') || normalized.includes('dining')) return 'bg-[#d9f2e5] text-[#078649]';
  return 'bg-[#eef2f0] text-[#526176]';
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'All' | 'debit' | 'credit'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
      .then((res) => {
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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      setForm({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        type: 'debit',
        category: 'Food & Dining',
      });
      setCurrentPage(1);
      fetchTransactions();
    } catch {
      setFormError('Failed to add transaction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map((tx) => [
      new Date(tx.date).toLocaleDateString('en-IN'),
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.category,
      tx.type,
      tx.amount,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
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

  const totals = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'credit')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const expense = transactions
      .filter((transaction) => transaction.type === 'debit' && transaction.category !== 'Transfer')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    return { income, expense };
  }, [transactions]);

  const { page, totalPages, total } = pagination;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const pageNumbers = Array.from(
    { length: Math.min(5, Math.max(totalPages, 1)) },
    (_, index) => Math.max(1, Math.min(totalPages, page - 2) + index),
  ).filter((value, index, array) => value <= totalPages && array.indexOf(value) === index);

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      {showModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#121c2d]">Add Manual Entry</h2>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-[#526176]"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[#526176]">Date</span>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  required
                  className="h-11 w-full rounded-md border border-[#dfe6e2] px-3 text-sm font-semibold text-[#121c2d] outline-none focus:border-[#159957]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[#526176]">Description</span>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="e.g. Swiggy Order"
                  required
                  className="h-11 w-full rounded-md border border-[#dfe6e2] px-3 text-sm font-semibold text-[#121c2d] outline-none placeholder:text-[#8a97a3] focus:border-[#159957]"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[#526176]">Amount</span>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="h-11 w-full rounded-md border border-[#dfe6e2] px-3 text-sm font-semibold text-[#121c2d] outline-none placeholder:text-[#8a97a3] focus:border-[#159957]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[#526176]">Type</span>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-md border border-[#dfe6e2] px-3 text-sm font-semibold text-[#121c2d] outline-none focus:border-[#159957]"
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[#526176]">Category</span>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="h-11 w-full rounded-md border border-[#dfe6e2] px-3 text-sm font-semibold text-[#121c2d] outline-none focus:border-[#159957]"
                >
                  {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>

              {formError && <p className="text-sm font-bold text-[#e40012]">{formError}</p>}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-11 rounded-md border border-[#dfe6e2] text-sm font-black text-[#526176]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-11 rounded-md bg-[#00331c] text-sm font-black text-white disabled:opacity-60"
                >
                  {submitting ? 'Adding...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-[28px] font-black tracking-[-0.01em] text-[#121c2d]">Transactions</h1>
          <p className="mt-1 text-sm font-medium text-[#526176]">Review, filter, export, and add financial activity.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#dfe6e2] bg-white px-5 text-sm font-bold text-[#35455b] shadow-sm disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#00331c] px-5 text-sm font-black text-white shadow-[0_8px_18px_rgba(0,51,28,0.18)]"
          >
            <Plus className="h-4 w-4" />
            Add Manual Entry
          </button>
        </div>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-md border border-[#dce4e0] bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-[#526176]">Current Page Expense</p>
          <p className="mt-2 text-[26px] font-black leading-none text-[#121c2d]">{formatCurrency(totals.expense)}</p>
          <p className="mt-3 text-xs font-bold text-[#526176]"><span className="text-[#159957]">▲</span> Excluding transfers</p>
        </div>
        <div className="rounded-md border border-[#dce4e0] bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-[#526176]">Current Page Income</p>
          <p className="mt-2 text-[26px] font-black leading-none text-[#159957]">{formatCurrency(totals.income)}</p>
          <p className="mt-3 text-xs font-bold text-[#526176]">Across visible transactions</p>
        </div>
        <div className="rounded-md border border-[#dce4e0] bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-[#526176]">Total Records</p>
          <p className="mt-2 text-[26px] font-black leading-none text-[#121c2d]">{total.toLocaleString('en-IN')}</p>
          <p className="mt-3 text-xs font-bold text-[#526176]">Filtered ledger count</p>
        </div>
      </section>

      <section className="mb-6 rounded-md border border-[#dce4e0] bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[#526176]">Search</span>
            <span className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#526176]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search description..."
                className="h-11 w-full rounded-md border border-[#dfe6e2] bg-[#fbfcfb] pl-9 pr-3 text-sm font-semibold text-[#121c2d] outline-none placeholder:text-[#8a97a3] focus:border-[#159957]"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[#526176]">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="h-11 w-full rounded-md border border-[#dfe6e2] bg-[#fbfcfb] px-3 text-sm font-semibold text-[#121c2d] outline-none focus:border-[#159957]"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>

          <div>
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[#526176]">Type</span>
            <div className="grid h-11 grid-cols-3 gap-1 rounded-md border border-[#dfe6e2] bg-[#fbfcfb] p-1">
              {(['All', 'debit', 'credit'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => { setSelectedType(type); setCurrentPage(1); }}
                  className={`rounded-md text-xs font-black capitalize ${
                    selectedType === type ? 'bg-[#00331c] text-white shadow-sm' : 'text-[#526176]'
                  }`}
                >
                  {type === 'All' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="h-11 rounded-md border border-[#dfe6e2] px-5 text-sm font-black text-[#00331c]"
          >
            Clear Filters
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-[#dce4e0] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left">
            <thead>
              <tr className="border-b border-[#e7ece9] bg-[#fbfcfb] text-sm font-semibold text-[#526176]">
                <th className="px-7 py-4">Date</th>
                <th className="px-7 py-4">Description</th>
                <th className="px-7 py-4">Category</th>
                <th className="px-7 py-4">Type</th>
                <th className="px-7 py-4">Amount</th>
                <th className="px-7 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7ece9]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-7 py-14 text-center text-sm font-bold text-[#526176]">Loading transactions...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-7 py-14 text-center text-sm font-bold text-[#526176]">
                    {total === 0 && !search && selectedCategory === 'All' && selectedType === 'All'
                      ? 'No transactions yet. Upload a bank statement to get started.'
                      : 'No transactions match the selected filters.'}
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const isIncome = transaction.type === 'credit';

                  return (
                    <tr key={transaction.id} className="text-sm font-medium text-[#35455b]">
                      <td className="whitespace-nowrap px-7 py-4">{formatDate(transaction.date)}</td>
                      <td className="min-w-[240px] px-7 py-4 font-semibold text-[#121c2d]">{transaction.description}</td>
                      <td className="px-7 py-4">
                        <span className={`inline-flex rounded-md px-3 py-1 text-sm font-semibold ${getCategoryBadgeStyle(transaction.category)}`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-7 py-4">
                        <span className={`inline-flex items-center gap-2 font-semibold ${isIncome ? 'text-[#159957]' : 'text-[#e40012]'}`}>
                          {isIncome ? 'Income' : 'Expense'}
                          {isIncome ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                        </span>
                      </td>
                      <td className={`whitespace-nowrap px-7 py-4 font-black ${isIncome ? 'text-[#159957]' : 'text-[#e40012]'}`}>
                        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-7 py-4 text-right">
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#243247]">
                          <Ellipsis className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e7ece9] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-[#526176]">
            {total === 0 ? 'No transactions' : `Showing ${from}-${to} of ${total} transactions`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[#dfe6e2] text-[#526176] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-black ${
                  page === pageNumber ? 'bg-[#00331c] text-white shadow-[0_8px_18px_rgba(0,51,28,0.18)]' : 'text-[#35455b]'
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[#dfe6e2] text-[#526176] disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-md border border-[#9ed9ba] bg-[#f2fff8] p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#d9f5e8] text-[#149a58]">
              <WalletCards className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#121c2d]">Monthly Insight</h2>
              <p className="mt-1 text-sm font-medium text-[#526176]">Use filters to isolate recurring payments, food delivery, and high weekend spends.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedType('debit');
              setSelectedCategory('Food & Dining');
              setCurrentPage(1);
            }}
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#159957] px-5 text-sm font-black text-white"
          >
            Find Food Spends
          </button>
        </div>
      </section>
    </div>
  );
}
