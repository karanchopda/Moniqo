"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  Ellipsis,
  Pencil,
  Plus,
  Search,
  Trash2,
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

type ModalMode = 'add' | 'edit';

const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Bills', 'Groceries',
  'Entertainment', 'Lifestyle', 'Investment', 'Medical', 'Transfer', 'Income', 'Others',
];

const fmtCurrency = (v: number) =>
  `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const BLANK_FORM = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '',
  type: 'debit',
  category: 'Food',
};

export default function TransactionsPage() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [pageSize, setPageSize]               = useState(10);
  const [loading, setLoading]                 = useState(true);
  const [selectedType, setSelectedType]       = useState<'All' | 'debit' | 'credit'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchInput, setSearchInput]         = useState('');
  const [search, setSearch]                   = useState('');
  const [currentPage, setCurrentPage]         = useState(1);
  const [dateFilter, setDateFilter]           = useState<DateFilter>({ startDate: null, endDate: null, label: 'All time data' });

  // Modal / form state
  const [modalMode, setModalMode]   = useState<ModalMode>('add');
  const [showModal, setShowModal]   = useState(false);
  const [editId, setEditId]         = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState('');
  const [form, setForm]             = useState({ ...BLANK_FORM });

  // Row action menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Delete confirm
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [deleting, setDeleting]       = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setCurrentPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    transactionApi.getAll({ limit: 10000 })
      .then((res) => setAllTransactions(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => setAllTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [search, selectedCategory, selectedType, dateFilter, pageSize]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditId(null);
    setForm({ ...BLANK_FORM });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (tx: Transaction) => {
    setModalMode('edit');
    setEditId(tx.id);
    setForm({
      date: tx.date.split('T')[0],
      description: tx.description,
      amount: String(tx.amount),
      type: tx.type,
      category: tx.category,
    });
    setFormError('');
    setOpenMenuId(null);
    setShowModal(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return setFormError('Description is required.');
    if (!form.amount || Number(form.amount) <= 0) return setFormError('Enter a valid amount.');

    setSubmitting(true);
    setFormError('');
    try {
      if (modalMode === 'edit' && editId) {
        await transactionApi.update(editId, {
          date: form.date,
          description: form.description.trim(),
          amount: Number(form.amount),
          type: form.type,
          category: form.category,
        });
      } else {
        await transactionApi.create({
          date: form.date,
          description: form.description.trim(),
          amount: Number(form.amount),
          type: form.type,
          category: form.category,
        });
        setCurrentPage(1);
      }
      setShowModal(false);
      fetchTransactions();
    } catch {
      setFormError('Failed to save transaction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await transactionApi.remove(deleteId);
      setDeleteId(null);
      fetchTransactions();
    } catch {
      // Keep dialog open so user knows it failed
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (!filteredTransactions.length) return;
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filteredTransactions.map((tx) => [
      new Date(tx.date).toLocaleDateString('en-IN'),
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.category, tx.type, tx.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `moniqo_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      if (search.trim() && !tx.description.toLowerCase().includes(search.toLowerCase().trim())) return false;
      if (selectedCategory !== 'All' && tx.category !== selectedCategory) return false;
      if (selectedType !== 'All' && tx.type !== selectedType) return false;

      const d = new Date(tx.date);
      if (isNaN(d.getTime())) return false;

      if (dateFilter.startDate) {
        const start = new Date(dateFilter.startDate); start.setHours(0,0,0,0);
        const day   = new Date(d);                    day.setHours(0,0,0,0);
        if (day < start) return false;
      }
      if (dateFilter.endDate) {
        const end = new Date(dateFilter.endDate); end.setHours(23,59,59,999);
        const day = new Date(d);                  day.setHours(23,59,59,999);
        if (day > end) return false;
      }
      return true;
    });
  }, [allTransactions, search, selectedCategory, selectedType, dateFilter]);

  const visibleTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const totals = useMemo(() => ({
    income:  visibleTransactions.filter(t => t.type === 'credit').reduce((s, t) => s + Number(t.amount), 0),
    expense: visibleTransactions.filter(t => t.type === 'debit' && t.category !== 'Transfer').reduce((s, t) => s + Number(t.amount), 0),
  }), [visibleTransactions]);

  const total = filteredTransactions.length;

  // Shared form modal JSX
  const FormModal = (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-brand-dark">
            {modalMode === 'edit' ? 'Edit Transaction' : 'Add Manual Entry'}
          </h2>
          <button onClick={() => setShowModal(false)} className="flex h-9 w-9 items-center justify-center rounded-md text-brand-text-muted" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Date</span>
            <input type="date" name="date" value={form.date} onChange={handleFormChange} required
              className="h-11 w-full rounded-md border border-brand-border px-3 text-sm font-semibold text-brand-dark outline-none focus:border-brand-green-text-alt" />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Description</span>
            <input type="text" name="description" value={form.description} onChange={handleFormChange} placeholder="e.g. Swiggy Order" required
              className="h-11 w-full rounded-md border border-brand-border px-3 text-sm font-semibold text-brand-dark outline-none placeholder:text-brand-muted focus:border-brand-green-text-alt" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Amount (₹)</span>
              <input type="number" name="amount" value={form.amount} onChange={handleFormChange} placeholder="0.00" min="0" step="0.01" required
                className="h-11 w-full rounded-md border border-brand-border px-3 text-sm font-semibold text-brand-dark outline-none placeholder:text-brand-muted focus:border-brand-green-text-alt" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Type</span>
              <select name="type" value={form.type} onChange={handleFormChange}
                className="h-11 w-full rounded-md border border-brand-border px-3 text-sm font-semibold text-brand-dark outline-none focus:border-brand-green-text-alt">
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Category</span>
            <select name="category" value={form.category} onChange={handleFormChange}
              className="h-11 w-full rounded-md border border-brand-border px-3 text-sm font-semibold text-brand-dark outline-none focus:border-brand-green-text-alt">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          {formError && <p className="text-sm font-bold text-brand-red">{formError}</p>}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)}
              className="h-11 rounded-md border border-brand-border text-sm font-black text-brand-text-muted hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="h-11 rounded-md bg-primary text-sm font-black text-white disabled:opacity-60 hover:bg-primary-light">
              {submitting ? 'Saving…' : modalMode === 'edit' ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Delete confirm dialog
  const DeleteDialog = (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-brand-red">
          <Trash2 className="h-6 w-6" />
        </div>
        <h2 className="text-base font-black text-brand-dark">Delete transaction?</h2>
        <p className="mt-2 text-sm font-medium text-brand-text-muted">This action cannot be undone.</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={() => setDeleteId(null)}
            className="h-11 rounded-md border border-brand-border text-sm font-black text-brand-text-muted hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleDeleteConfirm} disabled={deleting}
            className="h-11 rounded-md bg-brand-red text-sm font-black text-white disabled:opacity-60 hover:bg-brand-red-hover">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">

      {showModal && FormModal}
      {deleteId  && DeleteDialog}

      {/* Page header */}
      <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-[28px] font-black tracking-[-0.01em] text-brand-dark">Transactions</h1>
          <p className="mt-1 text-sm font-medium text-brand-text-muted">Review, filter, export, and manage your financial activity.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button onClick={handleExportCSV} disabled={!filteredTransactions.length}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-brand-border bg-white px-5 text-sm font-bold text-brand-text-dark-gray shadow-sm disabled:opacity-40">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button onClick={openAddModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-black text-white shadow-[0_8px_18px_rgba(0,51,28,0.18)] hover:bg-primary-light">
            <Plus className="h-4 w-4" />
            Add Manual Entry
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-brand-text-muted">Page Expenses</p>
          <p className="mt-2 text-[26px] font-black leading-none text-brand-dark">{fmtCurrency(totals.expense)}</p>
          <p className="mt-3 text-xs font-bold text-brand-text-muted"><span className="text-brand-green-text-alt">▲</span> Excluding transfers</p>
        </div>
        <div className="rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-brand-text-muted">Page Income</p>
          <p className="mt-2 text-[26px] font-black leading-none text-brand-green-text-alt">{fmtCurrency(totals.income)}</p>
          <p className="mt-3 text-xs font-bold text-brand-text-muted">Across visible transactions</p>
        </div>
        <div className="rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-brand-text-muted">Total Records</p>
          <p className="mt-2 text-[26px] font-black leading-none text-brand-dark">{total.toLocaleString('en-IN')}</p>
          <p className="mt-3 text-xs font-bold text-brand-text-muted">Filtered ledger count</p>
        </div>
      </section>

      {/* Filters */}
      <section className="mb-6 rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Search</span>
            <span className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search description…"
                className="h-11 w-full rounded-md border border-brand-border bg-brand-bg-light pl-9 pr-3 text-sm font-semibold text-brand-dark outline-none placeholder:text-brand-muted focus:border-brand-green-text-alt" />
            </span>
          </label>

          <div>
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Date Range</span>
            <DateRangeFilter selectedFilter={dateFilter} onChange={setDateFilter} className="w-full" />
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Category</span>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 w-full rounded-md border border-brand-border bg-brand-bg-light px-3 text-sm font-semibold text-brand-dark outline-none focus:border-brand-green-text-alt">
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <div>
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-brand-text-muted">Type</span>
            <div className="grid h-11 grid-cols-3 gap-1 rounded-md border border-brand-border bg-brand-bg-light p-1">
              {(['All', 'debit', 'credit'] as const).map((t) => (
                <button key={t} onClick={() => setSelectedType(t)}
                  className={`rounded-md text-xs font-black capitalize ${selectedType === t ? 'bg-primary text-white shadow-sm' : 'text-brand-text-muted hover:bg-white'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => { setSelectedType('All'); setSelectedCategory('All'); setSearchInput(''); setSearch(''); setDateFilter({ startDate: null, endDate: null, label: 'All time data' }); setCurrentPage(1); }}
            className="h-11 rounded-md border border-brand-border px-5 text-sm font-black text-primary lg:w-auto w-full hover:bg-gray-50">
            Clear
          </button>
        </div>
      </section>

      {/* Table */}
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
                <th className="px-7 py-4 text-right">Actions</th>
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
                visibleTransactions.map((tx) => {
                  const isIncome = tx.type === 'credit';
                  const menuOpen = openMenuId === tx.id;

                  return (
                    <tr key={tx.id} className="text-sm font-medium text-brand-text-dark-gray hover:bg-gray-50/50">
                      <td className="whitespace-nowrap px-7 py-4">{fmtDate(tx.date)}</td>
                      <td className="min-w-[240px] px-7 py-4 font-semibold text-brand-dark">{tx.description}</td>
                      <td className="px-7 py-4"><CategoryBadge category={tx.category} /></td>
                      <td className="px-7 py-4">
                        <span className={`inline-flex items-center gap-2 font-semibold ${isIncome ? 'text-brand-green-text-alt' : 'text-brand-red'}`}>
                          {isIncome ? 'Income' : 'Expense'}
                          {isIncome ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                        </span>
                      </td>
                      <td className={`whitespace-nowrap px-7 py-4 font-black ${isIncome ? 'text-brand-green-text-alt' : 'text-brand-red'}`}>
                        {isIncome ? '+' : '-'} {fmtCurrency(tx.amount)}
                      </td>

                      {/* Row action menu */}
                      <td className="px-7 py-4 text-right">
                        <div className="relative inline-block" ref={menuOpen ? menuRef : undefined}>
                          <button
                            onClick={() => setOpenMenuId(menuOpen ? null : tx.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-text-muted hover:bg-gray-100"
                            aria-label="Row actions"
                          >
                            <Ellipsis className="h-5 w-5" />
                          </button>

                          {menuOpen && (
                            <div className="absolute right-0 top-9 z-50 w-40 rounded-md border border-brand-border bg-white py-1 shadow-xl">
                              <button
                                onClick={() => openEditModal(tx)}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-dark hover:bg-gray-50"
                              >
                                <Pencil className="h-4 w-4 text-brand-text-muted" />
                                Edit
                              </button>
                              <button
                                onClick={() => { setDeleteId(tx.id); setOpenMenuId(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-red hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
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

      {/* Bottom insight */}
      <section className="mt-6 rounded-md border border-brand-green-border bg-brand-bg-green p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-green-bg-light text-brand-green-text">
              <WalletCards className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-brand-dark">Monthly Insight</h2>
              <p className="mt-1 text-sm font-medium text-brand-text-muted">Filter by Food category to spot delivery spend patterns.</p>
            </div>
          </div>
          <button
            onClick={() => { setSelectedType('debit'); setSelectedCategory('Food'); setCurrentPage(1); }}
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-green-text-alt px-5 text-sm font-black text-white hover:opacity-90">
            Find Food Spends
          </button>
        </div>
      </section>
    </div>
  );
}
