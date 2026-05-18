"use client";

import BankStatementAudit from '@/components/Features/BankStatementAudit';
import Link from 'next/link';

export default function SyncPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-accent transition-colors mb-3">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary tracking-tight leading-tight mb-2">
            Audit <span className="text-accent italic">Statement</span>
          </h1>
          <p className="text-sm font-medium text-muted">
            Upload your bank or credit card statement for immediate AI analysis.
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center relative min-h-[60vh]">
        <BankStatementAudit />
      </div>
    </div>
  );
}
