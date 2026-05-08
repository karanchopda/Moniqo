"use client";

import BankStatementAudit from '@/components/Features/BankStatementAudit';

export default function ExpertAnalyserView() {
  return (
    <div className="w-full max-w-[1550px] mx-auto flex flex-col items-center justify-center min-h-[80vh] relative">
      <BankStatementAudit />
    </div>
  );
}
