"use client";

import { useCallback, useEffect, useState } from 'react';
import { Calendar, Download, RefreshCw, Repeat, TrendingDown } from 'lucide-react';
import { reportApi } from '@/lib/api';
import { exportRecurringPdf } from '@/lib/exportPdf';
import CategoryBadge from '@/components/ui/CategoryBadge';

interface RecurringItem {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  frequency: string;
  monthlyCost: number;
  annualCost: number;
  occurrences: number;
  lastDate: string;
  nextEstimatedDate: string | null;
  source: 'pattern' | 'ai';
  impact: 'high' | 'medium' | 'low';
}

const fmtCurrency = (v: number) =>
  `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const IMPACT_STYLES = {
  high: 'bg-red-50 text-brand-red border-red-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  low: 'bg-brand-bg-green text-brand-green-bright border-brand-green-border',
};

const FREQ_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
  irregular: 'Irregular',
};

export default function RecurringPage() {
  const [items, setItems] = useState<RecurringItem[]>([]);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [totalAnnual, setTotalAnnual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecurring = useCallback(() => {
    setLoading(true);
    setError('');
    reportApi.getRecurring()
      .then((res) => {
        setItems(res.data.items || []);
        setTotalMonthly(res.data.totalMonthly || 0);
        setTotalAnnual(res.data.totalAnnual || 0);
      })
      .catch(() => setError('Failed to load recurring transactions.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchRecurring(); }, [fetchRecurring]);

  const handleExportPdf = () => {
    if (!items.length) return;
    exportRecurringPdf(items, totalMonthly);
  };

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-[28px] font-black tracking-[-0.01em] text-brand-dark">Recurring &amp; Subscriptions</h1>
          <p className="mt-1 text-sm font-medium text-brand-text-muted">
            Detected from your transaction patterns and AI audit insights.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchRecurring} disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-brand-border bg-white px-5 text-sm font-bold text-brand-text-dark-gray shadow-sm disabled:opacity-40">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
          </button>
          <button onClick={handleExportPdf} disabled={!items.length}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-brand-border bg-white px-5 text-sm font-bold text-brand-text-dark-gray shadow-sm disabled:opacity-40">
            <Download className="h-4 w-4" />Export PDF
          </button>
        </div>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-brand-text-muted">Monthly Recurring Cost</p>
          <p className="mt-2 text-[26px] font-black leading-none text-brand-red">{fmtCurrency(totalMonthly)}</p>
          <p className="mt-3 text-xs font-bold text-brand-text-muted">Estimated from detected patterns</p>
        </div>
        <div className="rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-brand-text-muted">Annual Projection</p>
          <p className="mt-2 text-[26px] font-black leading-none text-brand-dark">{fmtCurrency(totalAnnual)}</p>
          <p className="mt-3 text-xs font-bold text-brand-text-muted">If all recurring charges continue</p>
        </div>
        <div className="rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="text-sm font-medium text-brand-text-muted">Detected Items</p>
          <p className="mt-2 text-[26px] font-black leading-none text-brand-dark">{items.length}</p>
          <p className="mt-3 text-xs font-bold text-brand-text-muted">Subscriptions &amp; recurring debits</p>
        </div>
      </section>

      {error && (
        <div className="mb-6 rounded-md border border-brand-red-border bg-brand-bg-red p-4 text-sm font-bold text-brand-red">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-md border border-brand-border-gray bg-white shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead>
              <tr className="border-b border-brand-border-light bg-brand-bg-light text-sm font-semibold text-brand-text-muted">
                <th className="px-6 py-4">Vendor</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Frequency</th>
                <th className="px-4 py-4">Monthly Cost</th>
                <th className="px-4 py-4">Last Charge</th>
                <th className="px-4 py-4">Impact</th>
                <th className="px-4 py-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border-light">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-7 py-14 text-center text-sm font-bold text-brand-text-muted">
                    Analyzing transaction patterns…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-7 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Repeat className="h-10 w-10 text-brand-text-muted" />
                      <p className="text-sm font-bold text-brand-text-muted">
                        No recurring charges detected yet. Upload a bank statement to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="text-sm font-medium text-brand-text-dark-gray hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-brand-red shrink-0" />
                        <span className="font-semibold text-brand-dark">{item.vendor}</span>
                      </div>
                      <span className="mt-0.5 block text-xs text-brand-text-muted">{item.occurrences} occurrences</span>
                    </td>
                    <td className="px-4 py-4"><CategoryBadge category={item.category} /></td>
                    <td className="px-4 py-4 font-black text-brand-dark">{fmtCurrency(item.amount)}</td>
                    <td className="px-4 py-4">{FREQ_LABELS[item.frequency] || item.frequency}</td>
                    <td className="px-4 py-4 font-black text-brand-red">{fmtCurrency(item.monthlyCost)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-brand-text-muted" />
                        {fmtDate(item.lastDate)}
                      </span>
                      {item.nextEstimatedDate && (
                        <span className="mt-0.5 block text-xs text-brand-text-muted">
                          Next ~{fmtDate(item.nextEstimatedDate)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-black capitalize ${IMPACT_STYLES[item.impact]}`}>
                        {item.impact}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-bold uppercase tracking-wide ${item.source === 'ai' ? 'text-brand-green-text-alt' : 'text-brand-text-muted'}`}>
                        {item.source === 'ai' ? 'AI Audit' : 'Pattern'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {items.length > 0 && (
        <section className="mt-6 rounded-md border border-brand-green-border bg-brand-bg-green p-6">
          <h2 className="text-lg font-black text-brand-dark">Savings Opportunity</h2>
          <p className="mt-2 text-sm font-medium text-brand-text-muted">
            Cancelling just the high-impact items could save up to{' '}
            <span className="font-black text-brand-green-bright">
              {fmtCurrency(items.filter((i) => i.impact === 'high').reduce((s, i) => s + i.monthlyCost, 0))}/month
            </span>
            . Review each subscription and ask: do I still use this?
          </p>
        </section>
      )}
    </div>
  );
}
