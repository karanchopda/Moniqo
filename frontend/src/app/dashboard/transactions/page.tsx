"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
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
import { TableRowLoader } from '@/components/ui/GlobalLoader';
import DateRangeFilter, { DateFilter } from '@/components/ui/DateRangeFilter';
import CategoryBadge from '@/components/ui/CategoryBadge';
import TablePagination from '@/components/ui/TablePagination';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  statementId?: string;
}

const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Groceries',
  'Entertainment',
  'Lifestyle',
  'Investment',
  'Medical',
  'Transfer',
  'Income',
  'Others',
];

const formatCurrency = (value: number) =>
  `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });


export default function TransactionsPage() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'All' | 'debit' | 'credit'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
    label: 'All time data',
  });
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'debit',
    category: 'Food',
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
    transactionApi.getAll({ limit: 10000 })
      .then((res) => {
        setAllTransactions(Array.isArray(res.data) ? res.data : (res.data?.data || []));
      })
      .catch(() => {
        setAllTransactions([]);
      })
      .finally(() => setLoading(false));
  }, []);

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
        category: 'Food',
      });
      setCurrentPage(1);
      fetchTransactions();
    } catch {
      setFormError('Failed to add transaction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      // 1. Search filter
      if (search.trim()) {
        const descMatch = transaction.description.toLowerCase().includes(search.toLowerCase().trim());
        if (!descMatch) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'All') {
        if (transaction.category !== selectedCategory) return false;
      }

      // 3. Type filter
      if (selectedType !== 'All') {
        if (transaction.type !== selectedType.toLowerCase()) return false;
      }

      // 4. Date filter
      const txDate = new Date(transaction.date);
      if (isNaN(txDate.getTime())) return false;

      const y = txDate.getFullYear();
      if (y < 2000 || y > new Date().getFullYear() + 2) return false;

      if (selectedFilter.startDate) {
        const txDateDayStart = new Date(txDate);
        txDateDayStart.setHours(0, 0, 0, 0);
        const start = new Date(selectedFilter.startDate);
        start.setHours(0, 0, 0, 0);
        if (txDateDayStart < start) return false;
      }

      if (selectedFilter.endDate) {
        const txDateDayEnd = new Date(txDate);
        txDateDayEnd.setHours(23, 59, 59, 999);
        const end = new Date(selectedFilter.endDate);
        end.setHours(23, 59, 59, 999);
        if (txDateDayEnd > end) return false;
      }

      return true;
    });
  }, [allTransactions, search, selectedCategory, selectedType, selectedFilter]);

  const visibleTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedType, selectedFilter, pageSize]);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filteredTransactions.map((tx) => [
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
    setSelectedFilter({
      startDate: null,
      endDate: null,
      label: 'All time data',
    });
    setCurrentPage(1);
  };

  const totals = useMemo(() => {
    const income = visibleTransactions
      .filter((transaction) => transaction.type === 'credit')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const expense = visibleTransactions
      .filter((transaction) => transaction.type === 'debit' && transaction.category !== 'Transfer')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    return { income, expense };
  }, [visibleTransactions]);

  const total = filteredTransactions.length;


  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      {showModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-brand-dark">Add Manual Entry</h2>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-brand-text-muted"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Date</span>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  required
                  className="h-11 w-full rounded-md border border-brand-border px-3 text-sm font-semibold text-brand-dark outline-none focus:border-brand-green-text-alt"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Description</span>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="e.g. Swiggy Order"
                  required
                  className="h-11 w-full rounded-md border border-brand-border px-3 text-sm font-semibold text-brand-dark outline-none placeholder:text-brand-muted focus:border-brand-green-text-alt"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Amount</span>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="h-11 w-full rounded-md border border-brand-border px-3 text-sm font-semibold text-brand-dark outline-none placeholder:text-brand-muted focus:border-brand-green-text-alt"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Type</span>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-md border border-brand-border px-3 text-sm font-semibold text-brand-dark outline-none focus:border-brand-green-text-alt"
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Category</span>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="h-11 w-full rounded-md border border-brand-border px-3 text-sm font-semibold text-brand-dark outline-none focus:border-brand-green-text-alt"
                >
                  {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>

              {formError && <p className="text-sm font-bold text-brand-red">{formError}</p>}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-11 rounded-md border border-brand-border text-sm font-black text-brand-text-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-11 rounded-md bg-primary text-sm font-black text-white disabled:opacity-60"
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
          <h1 className="text-[28px] font-black tracking-[-0.01em] text-brand-dark">Transactions</h1>
          <p className="mt-1 text-sm font-medium text-brand-text-muted">Review, filter, export, and add financial activity.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={handleExportCSV}
            disabled={filteredTransactions.length === 0}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-brand-border bg-white px-5 text-sm font-bold text-brand-text-dark-gray shadow-sm disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-black text-white shadow-[0_8px_18px_rgba(0,51,28,0.18)]"
          >
            <Plus className="h-4 w-4" />
            Add Manual Entry
          </button>
        </div>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-brand-text-muted">Current Page Expense</p>
          <p className="mt-2 text-[26px] font-black leading-none text-brand-dark">{formatCurrency(totals.expense)}</p>
          <p className="mt-3 text-xs font-bold text-brand-text-muted"><span className="text-brand-green-text-alt">▲</span> Excluding transfers</p>
        </div>
        <div className="rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-brand-text-muted">Current Page Income</p>
          <p className="mt-2 text-[26px] font-black leading-none text-brand-green-text-alt">{formatCurrency(totals.income)}</p>
          <p className="mt-3 text-xs font-bold text-brand-text-muted">Across visible transactions</p>
        </div>
        <div className="rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-brand-text-muted">Total Records</p>
          <p className="mt-2 text-[26px] font-black leading-none text-brand-dark">{total.toLocaleString('en-IN')}</p>
          <p className="mt-3 text-xs font-bold text-brand-text-muted">Filtered ledger count</p>
        </div>
      </section>

      <section className="mb-6 rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Search</span>
            <span className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search description..."
                className="h-11 w-full rounded-md border border-brand-border bg-brand-bg-light pl-9 pr-3 text-sm font-semibold text-brand-dark outline-none placeholder:text-brand-muted focus:border-brand-green-text-alt"
              />
            </span>
          </label>

          <div className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Date Range</span>
            <DateRangeFilter
              selectedFilter={selectedFilter}
              onChange={setSelectedFilter}
              className="w-full"
            />
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="h-11 w-full rounded-md border border-brand-border bg-brand-bg-light px-3 text-sm font-semibold text-brand-dark outline-none focus:border-brand-green-text-alt"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>

          <div>
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Type</span>
            <div className="grid h-11 grid-cols-3 gap-1 rounded-md border border-brand-border bg-brand-bg-light p-1">
              {(['All', 'debit', 'credit'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => { setSelectedType(type); setCurrentPage(1); }}
                  className={`rounded-md text-xs font-black capitalize ${
                    selectedType === type ? 'bg-primary text-white shadow-sm' : 'text-brand-text-muted'
                  }`}
                >
                  {type === 'All' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="h-11 rounded-md border border-brand-border px-5 text-sm font-black text-primary lg:w-auto w-full"
          >
            Clear Filters
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-brand-border-gray bg-white shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left">
            <thead>
              <tr className="border-b border-brand-border-light bg-brand-bg-light text-sm font-semibold text-brand-text-muted">
                <th className="px-7 py-4">Date</th>
                <th className="px-7 py-4">Description</th>
                <th className="px-7 py-4">Category</th>
                <th className="px-7 py-4">Type</th>
                <th className="px-7 py-4">Amount</th>
                <th className="px-7 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border-light">
              {loading ? (
                <TableRowLoader colSpan={6} label="Loading transactions…" />
              ) : visibleTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-7 py-14 text-center text-sm font-bold text-brand-text-muted">
                    {total === 0 && !search && selectedCategory === 'All' && selectedType === 'All'
                      ? 'No transactions yet. Upload a bank statement to get started.'
                      : 'No transactions match the selected filters.'}
                  </td>
                </tr>
              ) : (
                visibleTransactions.map((transaction) => {
                  const isIncome = transaction.type === 'credit';

                  return (
                    <tr key={transaction.id} className="text-sm font-medium text-brand-text-dark-gray">
                      <td className="whitespace-nowrap px-7 py-4">{formatDate(transaction.date)}</td>
                      <td className="min-w-[240px] px-7 py-4 font-semibold text-brand-dark">{transaction.description}</td>
                      <td className="px-7 py-4">
                        <CategoryBadge category={transaction.category} />
                      </td>
                      <td className="px-7 py-4">
                        <span className={`inline-flex items-center gap-2 font-semibold ${isIncome ? 'text-brand-green-text-alt' : 'text-brand-red'}`}>
                          {isIncome ? 'Income' : 'Expense'}
                          {isIncome ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                        </span>
                      </td>
                      <td className={`whitespace-nowrap px-7 py-4 font-black ${isIncome ? 'text-brand-green-text-alt' : 'text-brand-red'}`}>
                        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-7 py-4 text-right">
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-text-navy">
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

        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={total}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </section>

      <section className="mt-6 rounded-md border border-brand-green-border bg-brand-bg-green p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-green-bg-light text-brand-green-text">
              <WalletCards className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-brand-dark">Monthly Insight</h2>
              <p className="mt-1 text-sm font-medium text-brand-text-muted">Use filters to isolate recurring payments, food delivery, and high weekend spends.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedType('debit');
              setSelectedCategory('Food');
              setCurrentPage(1);
            }}
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-green-text-alt px-5 text-sm font-black text-white"
          >
            Find Food Spends
          </button>
        </div>
      </section>
    </div>
  );
}
