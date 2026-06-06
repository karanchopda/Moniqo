"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  RefreshCw,
  Sparkles,
  Trash2,
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
  { icon: Upload,    title: '1. Upload Statement', desc: 'Upload your bank statement in PDF or CSV format from the audit flow.' },
  { icon: Sparkles,  title: '2. AI Processing',   desc: 'Moniqo parses, categorizes, and checks every transaction for unusual patterns.' },
  { icon: TrendingUp,title: '3. Get Insights',    desc: 'Review spending mix, leak alerts, and recommendations in your dashboard.' },
];

export default function SyncPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading]       = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId]   = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await statementApi.remove(id);
      setStatements((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // keep row visible if delete failed
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PROCESSED':  return 'bg-brand-green-bg-med text-brand-green-bright';
      case 'PROCESSING': return 'bg-brand-yellow-bg text-brand-yellow-text';
      case 'FAILED':     return 'bg-brand-red-bg text-brand-red';
      default:           return 'bg-brand-gray-bg-light text-brand-text-muted';
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">

      {/* Delete confirmation dialog */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-brand-red">
              <Trash2 className="h-6 w-6" />
            </div>
            <h2 className="text-base font-black text-brand-dark">Delete statement?</h2>
            <p className="mt-2 text-sm font-medium text-brand-text-muted">
              This will also delete all transactions linked to this statement. This cannot be undone.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => setConfirmId(null)}
                className="h-11 rounded-md border border-brand-border text-sm font-black text-brand-text-muted hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmId)} disabled={!!deletingId}
                className="h-11 rounded-md bg-brand-red text-sm font-black text-white disabled:opacity-60 hover:bg-brand-red-hover">
                {deletingId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-black tracking-[-0.01em] text-brand-dark">Upload Statement</h1>
          <p className="mt-1 text-sm font-medium text-brand-text-muted">Sync and monitor your uploaded bank statements.</p>
        </div>
        <Link
          href="/audit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-black text-white shadow-[0_8px_18px_rgba(0,51,28,0.18)] hover:bg-primary-light"
        >
          <Upload className="h-4 w-4" />
          Upload Statement
        </Link>
      </div>

      {/* Info banner */}
      <section className="rounded-md border border-brand-green-border bg-brand-bg-green p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex gap-4">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-md bg-brand-green-bg-light text-brand-green-text">
              <Upload className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-brand-green-text-alt">Data Pipeline</p>
              <h2 className="mt-2 text-xl font-black text-brand-dark">Statement-Based Sync</h2>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-brand-text-muted">
                Upload your bank statement PDF or CSV. Moniqo automatically parses, categorizes, and analyzes every transaction using AI.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:w-[260px]">
            <div className="rounded-md border border-brand-border-green-light bg-white px-4 py-3 text-center">
              <p className="text-xs font-black uppercase tracking-wide text-brand-text-muted">Statements</p>
              <p className="mt-1 text-2xl font-black text-brand-dark">{statements.length}</p>
            </div>
            <div className="rounded-md border border-brand-border-green-light bg-white px-4 py-3 text-center">
              <p className="text-xs font-black uppercase tracking-wide text-brand-text-muted">Formats</p>
              <p className="mt-1 text-lg font-black text-brand-dark">PDF / CSV</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statements list */}
      <section className="mt-6 overflow-hidden rounded-md border border-brand-border-gray bg-white shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-3 border-b border-brand-border-light px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-black text-brand-dark">Uploaded Statements</h2>
          <button onClick={fetchStatements}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-brand-border px-4 text-sm font-bold text-primary hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {loading ? (
          <SectionLoader label="Loading statements…" />
        ) : statements.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-brand-light text-brand-green-medium">
              <Upload className="h-7 w-7" />
            </div>
            <p className="mt-4 text-base font-black text-brand-dark">No statements uploaded yet.</p>
            <Link href="/audit" className="mt-3 inline-flex items-center gap-2 text-sm font-black text-brand-green-text-alt">
              Upload your first statement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-brand-border-light">
            {statements.map((s) => (
              <div key={s.id} className="grid gap-4 px-6 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-bg-light text-brand-text-muted">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-brand-dark">{s.filename}</p>
                    <p className="mt-1 text-xs font-semibold text-brand-text-muted">
                      {s.count} transaction{s.count !== 1 ? 's' : ''}
                      {s.createdAt ? ` · ${new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''}
                    </p>
                  </div>
                </div>

                <span className={`inline-flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-xs font-black uppercase ${getStatusStyle(s.status)}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {s.status}
                </span>

                {/* Delete */}
                <button
                  onClick={() => setConfirmId(s.id)}
                  disabled={deletingId === s.id}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-text-muted hover:bg-red-50 hover:text-brand-red transition-colors disabled:opacity-40"
                  aria-label="Delete statement"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-md border border-brand-border-gray bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-light text-brand-green-medium">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-base font-black text-brand-dark">{step.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-brand-text-muted">{step.desc}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
