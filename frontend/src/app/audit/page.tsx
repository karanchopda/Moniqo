"use client";

import ExpertAnalyserView from "@/components/Features/ExpertAnalyserView";
import Link from 'next/link';

export default function AuditPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
              <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
            </div>
            <span className="text-xl font-bold text-primary">
              MONIQO
            </span>
          </Link>
          
          <Link href="/">
            <button className="btn btn-secondary">
              <span className="material-symbols-outlined">close</span>
              Exit Audit
            </button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <ExpertAnalyserView />
      </main>
    </div>
  );
}
