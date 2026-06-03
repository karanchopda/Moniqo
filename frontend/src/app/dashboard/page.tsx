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
const monthOptions = [
  'May 2024',
  'April 2024',
  'March 2024',
  'February 2024',
  'January 2024',
  'December 2023',
];

const formatCurrency = (value: number) =>
  `₹${Math.round(value).toLocaleString('en-IN')}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const getCategoryClass = (category: string) => {
  const normalized = category.toLowerCase();

  if (normalized.includes('income') || normalized.includes('salary')) {
    return 'bg-[#d9f2e5] text-[#078649]';
  }

  if (normalized.includes('shopping')) {
    return 'bg-[#dcf5d2] text-[#1b8e11]';
  }

  return 'bg-[#d8f3e4] text-[#078649]';
};

export default function DashboardOverview() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [latestReport, setLatestReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<'All' | 'Income' | 'Expense'>('All');
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [txRes, reportRes] = await Promise.all([
          transactionApi.getAll().catch(() => ({ data: [] })),
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

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!monthDropdownRef.current?.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedPeriod = useMemo(() => {
    const [monthName, yearValue] = selectedMonth.split(' ');
    return {
      month: new Date(`${monthName} 1, ${yearValue}`).getMonth(),
      year: Number(yearValue),
    };
  }, [selectedMonth]);

  const periodTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === selectedPeriod.month &&
        transactionDate.getFullYear() === selectedPeriod.year
      );
    });
  }, [selectedPeriod, transactions]);

  const hasData = transactions.length > 0 || !!latestReport;

  const visibleTransactions = useMemo(() => {
    if (!hasData) return [];
    const source = transactions.length > 0 ? periodTransactions : [];
    const filtered = source.filter((transaction) => {
      if (transactionFilter === 'Income') return transaction.type === 'credit';
      if (transactionFilter === 'Expense') return transaction.type === 'debit';
      return true;
    });

    return filtered.slice(0, 5);
  }, [hasData, periodTransactions, transactionFilter, transactions]);

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

  const potentialSavings = hasData
    ? (latestReport?.potentialSavings ? Number(latestReport.potentialSavings) : 0)
    : 0;

  const transactionCount = hasData ? (transactions.length > 0 ? periodTransactions.length : 0) : 0;
  const netBalanceChange = hasData
    ? (periodTransactions[0]?.balance ? Number(periodTransactions[0].balance) : 0)
    : 0;

  const spendingMix = useMemo(() => {
    if (!hasData || !latestReport?.categoryBreakdown) return [];

    const parsed = typeof latestReport.categoryBreakdown === 'string'
      ? JSON.parse(latestReport.categoryBreakdown)
      : latestReport.categoryBreakdown;

    const colors = ['#004525', '#1f9b58', '#68c68e', '#b7e5cc', '#dff4e9', '#e4e5e7'];
    const entries = Object.entries(parsed)
      .filter(([, value]) => Number(value) > 0)
      .slice(0, 6)
      .map(([name, value], index) => ({
        name,
        value: Number(value),
        color: colors[index] || '#e4e5e7',
      }));

    return entries;
  }, [hasData, latestReport]);

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
      value: formatCurrency(totalSpent / 30),
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
      value: formatCurrency(Math.abs(netBalanceChange)),
      trend: '18.3%',
      icon: ShoppingBasket,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-black tracking-[-0.01em] text-[#121c2d]">
          Audit Summary
        </h1>

        <div ref={monthDropdownRef} className="relative w-full sm:w-[168px]">
          <button
            type="button"
            onClick={() => setIsMonthOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={isMonthOpen}
            className={`flex h-11 w-full items-center justify-between rounded-md border bg-white px-4 text-sm font-semibold text-[#29384d] shadow-sm transition-colors ${
              isMonthOpen ? 'border-[#006dff] ring-2 ring-[#006dff]/10' : 'border-[#dfe6e2]'
            }`}
          >
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {selectedMonth}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isMonthOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMonthOpen && (
            <div
              role="listbox"
              className="absolute right-0 top-12 z-30 w-full overflow-hidden rounded-md border border-[#dfe6e2] bg-white py-1 shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
            >
              {monthOptions.map((month) => (
                <button
                  key={month}
                  type="button"
                  role="option"
                  aria-selected={selectedMonth === month}
                  onClick={() => {
                    setSelectedMonth(month);
                    setIsMonthOpen(false);
                  }}
                  className={`flex h-10 w-full items-center px-4 text-left text-sm font-bold ${
                    selectedMonth === month
                      ? 'bg-[#e5f7ee] text-[#00331c]'
                      : 'text-[#35455b] hover:bg-[#fbfcfb]'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="flex min-h-[118px] items-center gap-7 rounded-md border border-[#dce4e0] bg-white px-6 py-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#e5f7ee] text-[#007b43]">
                <Icon className="h-7 w-7 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#526176]">{card.label}</p>
                <p className="mt-2 text-[26px] font-black leading-none tracking-tight text-[#142033]">
                  {card.value}
                </p>
                {hasData ? (
                  <p className="mt-3 text-xs font-bold text-[#526176]">
                    <span className="text-[#159957]">▲ {card.trend}</span> vs previous
                  </p>
                ) : (
                  <p className="mt-3 text-xs font-medium text-[#8a98a8]">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr_0.93fr]">
        <div className="rounded-md border border-[#dce4e0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <h2 className="text-lg font-black text-[#121c2d]">Spending Mix</h2>
          {!hasData ? (
            <div className="flex h-[250px] flex-col items-center justify-center text-center text-[#526176] font-medium text-sm">
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
                        border: '1px solid #dce4e0',
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
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {spendingMix.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[26px] font-black tracking-tight text-[#172235]">
                    {formatCurrency(totalSpent)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#526176]">Total</p>
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
                      <span className="truncate font-medium text-[#35455b]">{item.name}</span>
                    </div>
                    <span className="font-semibold text-[#172235]">{formatCurrency(item.value)}</span>
                    <span className="w-12 text-right font-medium text-[#35455b]">
                      {((item.value / mixTotal) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-md border border-[#dce4e0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <h2 className="text-lg font-black text-[#121c2d]">Leak Alert</h2>
          {!hasData ? (
            <div className="flex h-[250px] flex-col items-center justify-center text-center text-[#526176] font-medium text-sm">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">shield_alert</span>
              No data. Upload a statement to identify leaks.
            </div>
          ) : (
            <>
              <div className="mt-5 rounded-md border border-[#ffc6c3] bg-[#fff0ef] p-6">
                <div className="flex items-center gap-7">
                  <div className="flex h-19 w-19 shrink-0 items-center justify-center rounded-md bg-[#ffd9d8] text-[#e21f27]">
                    <ShieldAlert className="h-10 w-10 fill-[#e21f27] stroke-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#35455b]">Potential Leakage</p>
                    <p className="mt-2 text-[28px] font-black leading-none text-[#e40012]">₹6,780</p>
                    <p className="mt-3 text-sm font-medium text-[#35455b]">from 18 transactions</p>
                    <Link
                      href="/dashboard/transactions"
                      className="mt-2 inline-flex items-center gap-3 text-sm font-black text-[#e40012]"
                    >
                      Review Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-md border border-[#e5ebe8]">
                {[
                  ['Subscriptions', '₹2,430', Monitor],
                  ['Repeat Convenience', '₹2,980', ShoppingBasket],
                  ['High Weekend Spend', '₹1,370', CalendarDays],
                ].map(([label, value, Icon]) => (
                  <div
                    key={label as string}
                    className="grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-[#edf1ef] px-4 py-3 last:border-b-0"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#ffe8e7] text-[#f31e2a]">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-sm font-medium text-[#35455b]">{label as string}</span>
                    <span className="text-sm font-black text-[#172235]">{value as string}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-md border border-[#9ed9ba] bg-[#f2fff8] p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <h2 className="text-lg font-black text-[#121c2d]">AI Insight</h2>
          {!hasData ? (
            <div className="flex h-full min-h-[250px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-md bg-[#d9f5e8] text-[#149a58]">
                <Sparkles className="h-10 w-10 fill-[#149a58]/20" />
              </div>
              <p className="max-w-[250px] text-sm font-medium leading-relaxed text-[#526176]">
                Upload your transaction statements to get AI-powered insights on your spending habits.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[250px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-md bg-[#d9f5e8] text-[#149a58]">
                <Sparkles className="h-10 w-10 fill-[#149a58]/20" />
              </div>
              <p className="max-w-[250px] text-[16px] font-medium leading-7 text-[#243247]">
                You spent <span className="font-black text-[#139357]">22%</span> more on food delivery this month.
                Reducing just late-night orders can save you
              </p>
              <p className="mt-4 text-[32px] font-black leading-none text-[#159957]">₹1,420</p>
              <p className="mt-4 text-sm font-medium text-[#526176]">Try setting a daily cap.</p>
              <Link
                href="/dashboard/coach"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-[#159957] px-6 text-sm font-black text-white shadow-[0_10px_20px_rgba(21,153,87,0.2)]"
              >
                View Recommendations
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-[#dce4e0] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-4 border-b border-[#e7ece9] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="mr-3 text-lg font-black text-[#121c2d]">Transactions</h2>
            {hasData && (['All', 'Income', 'Expense'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTransactionFilter(tab)}
                className={`h-9 rounded-md border px-5 text-sm font-bold ${
                  transactionFilter === tab
                    ? 'border-[#00331c] bg-[#00331c] text-white shadow-[0_8px_18px_rgba(0,51,28,0.18)]'
                    : 'border-[#dfe6e2] bg-white text-[#526176]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {hasData && (
            <Link href="/dashboard/transactions" className="text-sm font-black text-[#159957]">
              View All
            </Link>
          )}
        </div>

        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-md bg-[#e5f7ee] text-[#007b43]">
              <WalletCards className="h-10 w-10 stroke-[2]" />
            </div>
            <h3 className="text-lg font-black text-[#121c2d]">No transactions found</h3>
            <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-[#526176]">
              Get started by uploading your bank statement. Moniqo will automatically analyze your expenses, identify leakage, and suggest savings.
            </p>
            <Link
              href="/dashboard/sync"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#159957] px-6 text-sm font-black text-white shadow-[0_10px_20px_rgba(21,153,87,0.2)] hover:bg-[#128049] transition-colors"
            >
              Upload Statement
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left">
                <thead>
                  <tr className="border-b border-[#e7ece9] bg-[#fbfcfb] text-sm font-semibold text-[#526176]">
                    <th className="px-7 py-4">Date</th>
                    <th className="px-7 py-4">Description</th>
                    <th className="px-7 py-4">Category</th>
                    <th className="px-7 py-4">Type</th>
                    <th className="px-7 py-4">Amount</th>
                    <th className="px-7 py-4">Note</th>
                    <th className="px-7 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7ece9]">
                  {visibleTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-7 py-12 text-center text-sm font-bold text-[#526176]">
                        No transactions found for {selectedMonth} with the selected filter.
                      </td>
                    </tr>
                  ) : visibleTransactions.map((transaction) => {
                    const isIncome = transaction.type === 'credit';

                    return (
                      <tr key={transaction.id} className="text-sm font-medium text-[#35455b]">
                        <td className="whitespace-nowrap px-7 py-4">{formatDate(transaction.date)}</td>
                        <td className="min-w-[220px] px-7 py-4">{transaction.description}</td>
                        <td className="px-7 py-4">
                          <span className={`inline-flex rounded-md px-3 py-1 text-sm font-semibold ${getCategoryClass(transaction.category)}`}>
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
                        <td className="min-w-[150px] px-7 py-4">{transaction.note || transaction.category}</td>
                        <td className="px-7 py-4 text-right">
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#243247]">
                            <Ellipsis className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-4 px-6 py-6 text-sm font-medium text-[#35455b]">
              <button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#dfe6e2]">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-md bg-[#00331c] font-black text-white shadow-[0_8px_18px_rgba(0,51,28,0.18)]">
                1
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-md">2</button>
              <button className="flex h-10 w-10 items-center justify-center rounded-md">3</button>
              <span className="px-2">...</span>
              <button className="flex h-10 w-10 items-center justify-center rounded-md">10</button>
              <button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#dfe6e2]">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </section>

      {loading && <CornerLoader label="Loading live dashboard data…" />}
    </div>
  );
}
