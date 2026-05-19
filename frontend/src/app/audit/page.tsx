"use client";

import ExpertAnalyserView from "@/components/Features/ExpertAnalyserView";
import Link from 'next/link';
import MoniqoLogo from '@/components/ui/MoniqoLogo';

export default function AuditPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
            <MoniqoLogo size="md" variant="full" />
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
