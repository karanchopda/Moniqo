"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExpertAnalyserView from "@/components/Features/ExpertAnalyserView";
import Link from 'next/link';
import MoniqoLogo from '@/components/ui/MoniqoLogo';
import { isLoggedIn } from '@/lib/auth';

export default function AuditPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login?redirect=/audit');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
            <MoniqoLogo size="md" />
          </Link>
          <Link href="/dashboard">
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
