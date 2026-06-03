"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { statementApi } from '@/lib/api';
import { SectionLoader } from '@/components/ui/GlobalLoader';

interface Statement {
  id: string;
  filename: string;
  status: string;
  createdAt: string;
  count: number;
}

const steps = [
  {
    icon: Upload,
    title: '1. Upload Statement',
    desc: 'Upload your bank statement in PDF or CSV format from your audit flow.',
  },
  {
    icon: Sparkles,
    title: '2. AI Processing',
    desc: 'Moniqo parses, categorizes, and checks every transaction for unusual patterns.',
  },
  {
    icon: TrendingUp,
    title: '3. Get Insights',
    desc: 'Review spending mix, leak alerts, and recommendations in your dashboard.',
  },
];

export default function SyncPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatements = async () => {
    setLoading(true);
    try {
      const res = await statementApi.getAll();
      setStatements(res.data || []);
    } catch {
      setStatements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatements(); }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PROCESSED': return 'bg-[#d9f2e5] text-[#078649]';
      case 'PROCESSING': return 'bg-[#fff6df] text-[#b36b00]';
      case 'FAILED': return 'bg-[#ffe8e7] text-[#e40012]';
      default: return 'bg-[#eef2f0] text-[#526176]';
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-black tracking-[-0.01em] text-[#121c2d]">Upload Statement</h1>
          <p className="mt-1 text-sm font-medium text-[#526176]">Sync and monitor your uploaded bank statements.</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#00331c] px-5 text-sm font-black text-white shadow-[0_8px_18px_rgba(0,51,28,0.18)]"
        >
          <Upload className="h-4 w-4" />
          Upload Statement
        </Link>
      </div>

      <section className="rounded-md border border-[#9ed9ba] bg-[#f2fff8] p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex gap-4">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-md bg-[#d9f5e8] text-[#149a58]">
              <Upload className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#159957]">Data Pipeline</p>
              <h2 className="mt-2 text-xl font-black text-[#121c2d]">Statement-Based Sync</h2>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#526176]">
                Upload statements, let the parser process transactions, and keep your audit summary current without adding extra pages.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-[260px]">
            <div className="rounded-md border border-[#cbe9d8] bg-white px-4 py-3 text-center">
              <p className="text-xs font-black uppercase tracking-wide text-[#526176]">Statements</p>
              <p className="mt-1 text-2xl font-black text-[#121c2d]">{statements.length}</p>
            </div>
            <div className="rounded-md border border-[#cbe9d8] bg-white px-4 py-3 text-center">
              <p className="text-xs font-black uppercase tracking-wide text-[#526176]">Formats</p>
              <p className="mt-1 text-2xl font-black text-[#121c2d]">PDF</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-[#dce4e0] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-3 border-b border-[#e7ece9] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-black text-[#121c2d]">Uploaded Statements</h2>
          <button
            onClick={fetchStatements}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#dfe6e2] px-4 text-sm font-bold text-[#00331c]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {loading ? (
          <SectionLoader label="Loading statements…" />
        ) : statements.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-[#e5f7ee] text-[#007b43]">
              <Upload className="h-7 w-7" />
            </div>
            <p className="mt-4 text-base font-black text-[#121c2d]">No statements uploaded yet.</p>
            <Link href="/dashboard" className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#159957]">
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#e7ece9]">
            {statements.map((statement) => (
              <div key={statement.id} className="grid gap-4 px-6 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#fbfcfb] text-[#526176]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#121c2d]">{statement.filename}</p>
                    <p className="mt-1 text-xs font-semibold text-[#526176]">
                      {statement.count} transactions
                      {statement.createdAt ? ` · ${new Date(statement.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-xs font-black uppercase ${getStatusStyle(statement.status)}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {statement.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>


      <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="rounded-md border border-[#dce4e0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#e5f7ee] text-[#007b43]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-base font-black text-[#121c2d]">{step.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-[#526176]">{step.desc}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
