"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Monitor,
  PiggyBank,
  Redo2,
  ShieldAlert,
  ShoppingBasket,
  Sparkles,
  TrendingUp,
  WalletCards,
} from 'lucide-react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { reportApi, transactionApi } from '@/lib/api';
import { CornerLoader } from '@/components/ui/GlobalLoader';
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
  note?: string;
  balance?: number;
}

const formatCurrency = (value: number) =>
  `₹${Math.round(value).toLocaleString('en-IN')}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });


export default function DashboardOverview() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [latestReport, setLatestReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
    label: 'All time data',
  });
  const [transactionFilter, setTransactionFilter] = useState<'All' | 'Income' | 'Expense'>('All');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [txRes, reportRes] = await Promise.all([
          transactionApi.getAll({ limit: 10000 }).catch(() => ({ data: [] })),
          reportApi.getLatest().catch(() => ({ data: null })),
        ]);

        setTransactions(Array.isArray(txRes.data) ? txRes.data : (txRes.data?.data || []));
        setLatestReport(reportRes?.data || null);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  const filterLabel = useMemo(() => {
    if (selectedFilter.label === 'Custom' && selectedFilter.startDate && selectedFilter.endDate) {
      const startStr = selectedFilter.startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const endStr = selectedFilter.endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      return `${startStr} - ${endStr}`;
    }
    return selectedFilter.label;
  }, [selectedFilter]);

  const periodTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
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
  }, [selectedFilter, transactions]);


  const hasData = transactions.length > 0 || !!latestReport;

  const filteredTransactions = useMemo(() => {
    return periodTransactions.filter((transaction) => {
      if (transactionFilter === 'Income') return transaction.type === 'credit';
      if (transactionFilter === 'Expense') return transaction.type === 'debit';
      return true;
    });
  }, [periodTransactions, transactionFilter]);

  const visibleTransactions = useMemo(() => {
    if (!hasData) return [];
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [hasData, filteredTransactions, currentPage, pageSize]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, transactionFilter]);

  const totalSpent = useMemo(() => {
    if (!hasData) return 0;
    if (transactions.length === 0 && latestReport?.totalSpent) return Number(latestReport.totalSpent);

    if (transactions.length > 0) {
      return periodTransactions
        .filter((item) => item.type === 'debit' && item.category !== 'Transfer')
        .reduce((sum, item) => sum + Number(item.amount), 0);
    }

    return 0;
  }, [hasData, latestReport, periodTransactions, transactions.length]);

  const parsedLeaks = useMemo(() => {
    if (!latestReport?.leaks) return [];
    try {
      return typeof latestReport.leaks === 'string'
        ? JSON.parse(latestReport.leaks)
        : latestReport.leaks;
    } catch (e) {
      console.error('Failed to parse leaks', e);
      return [];
    }
  }, [latestReport]);

  const potentialSavings = useMemo(() => {
    if (!hasData) return 0;
    return parsedLeaks.reduce((sum: number, leak: any) => sum + (Number(leak.amount) || 0), 0);
  }, [hasData, parsedLeaks]);

  const parsedAIInsights = useMemo(() => {
    if (!latestReport?.aiInsights) return null;
    try {
      return typeof latestReport.aiInsights === 'string'
        ? JSON.parse(latestReport.aiInsights)
        : latestReport.aiInsights;
    } catch (e) {
      console.error('Failed to parse AI insights', e);
      return null;
    }
  }, [latestReport]);

  const getLeakIcon = (titleOrCategory: string) => {
    const lower = titleOrCategory.toLowerCase();
    if (
      lower.includes('sub') ||
      lower.includes('netflix') ||
      lower.includes('spotify') ||
      lower.includes('premium') ||
      lower.includes('prime')
    ) {
      return Monitor;
    }
    if (
      lower.includes('convenience') ||
      lower.includes('food') ||
      lower.includes('swiggy') ||
      lower.includes('zomato') ||
      lower.includes('shopping')
    ) {
      return ShoppingBasket;
    }
    return CalendarDays;
  };

  const transactionCount = hasData ? (transactions.length > 0 ? periodTransactions.length : 0) : 0;

  const netBalanceChange = useMemo(() => {
    if (!hasData || periodTransactions.length === 0) return 0;
    const credits = periodTransactions
      .filter((t) => t.type === 'credit')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const debits = periodTransactions
      .filter((t) => t.type === 'debit')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return credits - debits;
  }, [hasData, periodTransactions]);

  const uniqueDaysInPeriod = useMemo(() => {
    if (periodTransactions.length === 0) return 30;
    const days = new Set(periodTransactions.map(t => new Date(t.date).toDateString()));
    return Math.max(1, days.size);
  }, [periodTransactions]);

  const spendingMix = useMemo(() => {
    if (!hasData) return [];

    // Calculate category breakdown dynamically from selected period transactions
    const breakdown: { [key: string]: number } = {};
    const expenseTransactions = periodTransactions.filter(t => t.type === 'debit' && t.category !== 'Transfer');
    expenseTransactions.forEach(t => {
      breakdown[t.category] = (breakdown[t.category] || 0) + Number(t.amount);
    });

    const colors = [
      'var(--color-chart-1)',
      'var(--color-chart-2)',
      'var(--color-chart-3)',
      'var(--color-chart-4)',
      'var(--color-chart-5)',
      'var(--color-chart-6)',
    ];
    const entries = Object.entries(breakdown)
      .filter(([, value]) => Number(value) > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value], index) => ({
        name,
        value: Number(value),
        color: colors[index] || 'var(--color-chart-6)',
      }));

    return entries;
  }, [hasData, periodTransactions]);

  const mixTotal = spendingMix.reduce((sum, item) => sum + item.value, 0) || 1;

  const statCards = [
    {
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      trend: '12.4%',
      icon: WalletCards,
    },
    {
      label: 'Daily Average',
      value: formatCurrency(totalSpent / uniqueDaysInPeriod),
      trend: '8.7%',
      icon: TrendingUp,
    },
    {
      label: 'Potential Savings',
      value: formatCurrency(potentialSavings),
      trend: '15.2%',
      icon: PiggyBank,
    },
    {
      label: 'Transactions',
      value: transactionCount.toLocaleString('en-IN'),
      trend: '10.1%',
      icon: Redo2,
    },
    {
      label: 'Net Balance Change',
      value: (netBalanceChange >= 0 ? '+' : '-') + formatCurrency(Math.abs(netBalanceChange)),
      trend: '18.3%',
      icon: ShoppingBasket,
    },
  ];

  const total = filteredTransactions.length;

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-black tracking-[-0.01em] text-brand-dark">
          Audit Summary
        </h1>
        <DateRangeFilter
          selectedFilter={selectedFilter}
          onChange={setSelectedFilter}
        />
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="flex min-h-[118px] items-center gap-7 rounded-md border border-brand-border-gray bg-white px-6 py-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-light text-brand-green-medium">
                <Icon className="h-7 w-7 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-text-muted">{card.label}</p>
                <p className="mt-2 text-[26px] font-black leading-none tracking-tight text-brand-dark-blue">
                  {card.value}
                </p>
                {hasData ? (
                  <p className="mt-3 text-xs font-bold text-brand-text-muted">
                    <span className="text-brand-green-text-alt">▲ {card.trend}</span> vs previous
                  </p>
                ) : (
                  <p className="mt-3 text-xs font-medium text-brand-muted">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr_0.93fr]">
        <div className="rounded-md border border-brand-border-gray bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <h2 className="text-lg font-black text-brand-dark">Spending Mix</h2>
          {!hasData ? (
            <div className="flex h-[250px] flex-col items-center justify-center text-center text-brand-text-muted font-medium text-sm">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">pie_chart</span>
              No spending data available.
            </div>
          ) : (
            <div className="mt-5 grid gap-6 lg:grid-cols-[250px_1fr] lg:items-center xl:grid-cols-[290px_1fr]">
              <div className="relative mx-auto h-[250px] w-[250px] xl:h-[280px] xl:w-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Spent']}
                      contentStyle={{
                        border: '1px solid var(--color-brand-border)',
                        borderRadius: 6,
                        boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
                        fontSize: 12,
                      }}
                    />
                    <Pie
                      data={spendingMix}
                      innerRadius="48%"
                      outerRadius="86%"
                      paddingAngle={1}
                      dataKey="value"
                      stroke="white"
                      strokeWidth={2}
                    >
                      {spendingMix.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[26px] font-black tracking-tight text-brand-dark-blue-alt">
                    {formatCurrency(totalSpent)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-brand-text-muted">Total</p>
                </div>
              </div>

              <div className="space-y-5">
                {spendingMix.map((item) => (
                  <div key={item.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-5 text-sm">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-md"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate font-medium text-brand-text-dark-gray">{item.name}</span>
                    </div>
                    <span className="font-semibold text-brand-dark-blue-alt">{formatCurrency(item.value)}</span>
                    <span className="w-12 text-right font-medium text-brand-text-dark-gray">
                      {((item.value / mixTotal) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-md border border-brand-border-gray bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <h2 className="text-lg font-black text-brand-dark">Leak Alert</h2>
          {!hasData ? (
            <div className="flex h-[250px] flex-col items-center justify-center text-center text-brand-text-muted font-medium text-sm">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">shield_alert</span>
              No data. Upload a statement to identify leaks.
            </div>
          ) : (
            <>
              <div className="mt-5 rounded-md border border-brand-red-border bg-brand-bg-red p-6">
                <div className="flex items-center gap-7">
                  <div className="flex h-19 w-19 shrink-0 items-center justify-center rounded-md bg-brand-red-bg-light text-brand-red-bright">
                    <ShieldAlert className="h-10 w-10 fill-brand-red-bright stroke-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-text-dark-gray">Potential Leakage</p>
                    <p className="mt-2 text-[28px] font-black leading-none text-brand-red">{formatCurrency(potentialSavings)}</p>
                    <p className="mt-3 text-sm font-medium text-brand-text-dark-gray">from {parsedLeaks.length} leak source{parsedLeaks.length === 1 ? '' : 's'}</p>
                    <Link
                      href="/dashboard/transactions"
                      className="mt-2 inline-flex items-center gap-3 text-sm font-black text-brand-red"
                    >
                      Review Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-md border border-brand-bg-gray-green">
                {parsedLeaks.length === 0 ? (
                  <div className="p-4 text-center text-sm font-semibold text-brand-text-muted">
                    No spending leaks detected.
                  </div>
                ) : (
                  parsedLeaks.slice(0, 4).map((leak: any, idx: number) => {
                    const Icon = getLeakIcon(leak.title || leak.category || '');
                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-brand-border-ultra-light px-4 py-3 last:border-b-0"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-red-bg text-brand-red-alert">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span className="text-sm font-medium text-brand-text-dark-gray truncate pr-2" title={leak.reason || leak.title || leak.category}>
                          {leak.title || leak.category}
                        </span>
                        <span className="text-sm font-black text-brand-dark-blue-alt">{formatCurrency(leak.amount)}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        <div className="rounded-md border border-brand-green-border bg-brand-bg-green p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <h2 className="text-lg font-black text-brand-dark">AI Insight</h2>
          {!hasData ? (
            <div className="flex h-full min-h-[250px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-md bg-brand-green-bg-light text-brand-green-text">
                <Sparkles className="h-10 w-10 fill-brand-green-text/20" />
              </div>
              <p className="max-w-[250px] text-sm font-medium leading-relaxed text-brand-text-muted">
                Upload your transaction statements to get AI-powered insights on your spending habits.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[250px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-brand-green-bg-light text-brand-green-text">
                <Sparkles className="h-7 w-7 fill-brand-green-text/20" />
              </div>
              <p className="max-w-[280px] text-[15px] font-bold leading-relaxed text-brand-text-navy mb-4">
                {parsedAIInsights?.summary || "Analyzing your transaction statements..."}
              </p>
              {parsedAIInsights?.confidence && (
                <div className="text-[11px] font-bold text-brand-green-text-alt bg-brand-green-bg-med px-2.5 py-1 rounded-md mb-4 shadow-sm">
                  Confidence Score: {parsedAIInsights.confidence}%
                </div>
              )}
              {parsedAIInsights?.actions?.[0] && (
                <p className="max-w-[280px] text-xs font-semibold text-brand-text-muted bg-white border border-brand-green-border/30 p-3 rounded-md shadow-sm">
                  💡 <strong>Action:</strong> {parsedAIInsights.actions[0]}
                </p>
              )}
              <Link
                href="/dashboard/coach"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-brand-green-text-alt px-6 text-sm font-black text-white shadow-[0_10px_20px_rgba(21,153,87,0.2)]"
              >
                Chat with Coach
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-brand-border-gray bg-white shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-4 border-b border-brand-border-light px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="mr-3 text-lg font-black text-brand-dark">Transactions</h2>
            {hasData && (['All', 'Income', 'Expense'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTransactionFilter(tab)}
                className={`h-9 rounded-md border px-5 text-sm font-bold ${
                  transactionFilter === tab
                    ? 'border-primary bg-primary text-white shadow-[0_8px_18px_rgba(0,51,28,0.18)]'
                    : 'border-brand-border bg-white text-brand-text-muted'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {hasData && (
            <Link href="/dashboard/transactions" className="text-sm font-black text-brand-green-text-alt">
              View All
            </Link>
          )}
        </div>

        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-md bg-brand-light text-brand-green-medium">
              <WalletCards className="h-10 w-10 stroke-[2]" />
            </div>
            <h3 className="text-lg font-black text-brand-dark">No transactions found</h3>
            <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-brand-text-muted">
              Get started by uploading your bank statement. Moniqo will automatically analyze your expenses, identify leakage, and suggest savings.
            </p>
            <Link
              href="/audit"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-brand-green-text-alt px-6 text-sm font-black text-white shadow-[0_10px_20px_rgba(21,153,87,0.2)] hover:bg-brand-green-text-alt/90 transition-colors"
            >
              Upload Statement
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left">
                <thead>
                  <tr className="border-b border-brand-border-light bg-brand-bg-light text-sm font-semibold text-brand-text-muted">
                    <th className="px-7 py-4">Date</th>
                    <th className="px-7 py-4">Description</th>
                    <th className="px-7 py-4">Category</th>
                    <th className="px-7 py-4">Type</th>
                    <th className="px-7 py-4">Amount</th>
                    <th className="px-7 py-4">Note</th>
                    <th className="px-7 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border-light">
                  {visibleTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-7 py-12 text-center text-sm font-bold text-brand-text-muted">
                        No transactions found for {filterLabel} with the selected filter.
                      </td>
                    </tr>
                  ) : visibleTransactions.map((transaction) => {
                    const isIncome = transaction.type === 'credit';

                    return (
                      <tr key={transaction.id} className="text-sm font-medium text-brand-text-dark-gray">
                        <td className="whitespace-nowrap px-7 py-4">{formatDate(transaction.date)}</td>
                        <td className="min-w-[220px] px-7 py-4">{transaction.description}</td>
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
                        <td className="min-w-[150px] px-7 py-4">{transaction.note || transaction.category}</td>
                        <td className="px-7 py-4 text-right">
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-text-navy">
                            <Ellipsis className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
          </>
        )}
      </section>

      {loading && <CornerLoader label="Loading live dashboard data…" />}
    </div>
  );
}
