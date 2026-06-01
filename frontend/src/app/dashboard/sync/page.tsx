"use client";

import { useState, useEffect } from 'react';
import { statementApi } from '@/lib/api';
import Link from 'next/link';
import { 
  Upload, 
  RefreshCw, 
  FileText, 
  Sparkles, 
  TrendingUp 
} from 'lucide-react';

const StepIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  switch (iconName) {
    case 'upload_file':
      return <Upload className={className} />;
    case 'auto_awesome':
      return <Sparkles className={className} />;
    case 'insights':
      return <TrendingUp className={className} />;
    default:
      return <Upload className={className} />;
  }
};

interface Statement {
  id: string;
  filename: string;
  status: string;
  createdAt: string;
  count: number;
}

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
      case 'PROCESSED': return 'bg-[#eefcf2] text-[#1aa34b]';
      case 'PROCESSING': return 'bg-[#fffaf0] text-[#dd6b20]';
      case 'FAILED': return 'bg-red-50 text-red-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-6 pb-4 font-sans">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0a5c43]">Data Pipeline</p>
          <h1 className="text-2xl font-black text-primary tracking-tight mt-1">Sync Management</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">Upload bank statements to sync your financial data.</p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0a5c43] hover:bg-[#094d38] text-white rounded text-xs font-bold transition-all shadow-md"
        >
          <Upload className="w-4 h-4" />
          Upload Statement
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-[#3e5f4f] text-white p-6 rounded shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden border border-emerald-950/20">
        <div className="absolute right-0 bottom-0 w-32 h-32 rounded-tl bg-white/5 pointer-events-none select-none"></div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-[#a3e8cc] shrink-0 mt-0.5">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Statement-Based Sync</h3>
            <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
              Upload your bank statement (PDF or CSV) from the dashboard. Moniqo automatically parses, categorizes, and analyzes your transactions using AI.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 px-4 py-2 rounded text-center">
            <p className="text-[9px] font-black uppercase text-white/50 tracking-wider">Statements</p>
            <p className="text-sm font-black text-white mt-0.5">{statements.length}</p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded text-center">
            <p className="text-[9px] font-black uppercase text-white/50 tracking-wider">Formats</p>
            <p className="text-sm font-black text-white mt-0.5">PDF / CSV</p>
          </div>
        </div>
      </div>

      {/* Uploaded Statements */}
      <div className="bg-white border border-gray-200/80 rounded shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Uploaded Statements</h2>
          <button onClick={fetchStatements} className="text-[10px] font-black text-[#0a5c43] hover:underline flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-xs font-bold text-gray-400">Loading...</div>
        ) : statements.length === 0 ? (
          <div className="px-6 py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded bg-gray-50 flex items-center justify-center text-gray-300 mx-auto border border-gray-100">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-gray-400">No statements uploaded yet.</p>
            <Link href="/dashboard" className="inline-block text-[10px] font-black text-[#0a5c43] hover:underline">
              Go to Dashboard to upload →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {statements.map((s) => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                    <FileText className="w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-primary">{s.filename}</p>
                    <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                      {s.count} transactions
                      {s.createdAt ? ` · ${new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[9px] font-black uppercase tracking-tight ${getStatusStyle(s.status)}`}>
                  <span className={`w-1 h-1 rounded ${s.status === 'PROCESSED' ? 'bg-emerald-500' : s.status === 'PROCESSING' ? 'bg-orange-400' : 'bg-red-500'}`}></span>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: 'upload_file', title: '1. Upload Statement', desc: 'Upload your bank statement in PDF or CSV format from the dashboard.' },
          { icon: 'auto_awesome', title: '2. AI Processing', desc: 'Moniqo automatically parses and categorizes every transaction using AI.' },
          { icon: 'insights', title: '3. Get Insights', desc: 'View your spending breakdown, money leaks, and AI-powered recommendations.' },
        ].map((step) => (
          <div key={step.title} className="bg-white border border-gray-200/80 rounded p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded bg-[#e6f4ee] flex items-center justify-center text-[#0a5c43]">
              <StepIcon iconName={step.icon} className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-primary">{step.title}</h3>
            <p className="text-[11px] font-semibold text-gray-400 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
