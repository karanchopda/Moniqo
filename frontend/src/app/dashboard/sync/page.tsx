"use client";

import { useState } from 'react';

interface Connection {
  id: string;
  name: string;
  type: string;
  lastSynced: string;
  autoSync: boolean;
  status: 'Synced' | 'Action Required';
  tokenStatus?: string;
  iconBg: string;
  iconText: string;
  highlighted?: boolean;
}

export default function SyncPage() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: '1',
      name: 'HDFC Bank',
      type: 'Savings & Credit Card (3 accounts)',
      lastSynced: '12 mins ago',
      autoSync: true,
      status: 'Synced',
      iconBg: 'bg-[#edf2f7] text-[#1a365d]',
      iconText: 'H'
    },
    {
      id: '2',
      name: 'ICICI Direct',
      type: 'Investment Portfolio (2 accounts)',
      lastSynced: '1 hour ago',
      autoSync: true,
      status: 'Synced',
      iconBg: 'bg-[#fffaf0] text-[#dd6b20]',
      iconText: 'I'
    },
    {
      id: '3',
      name: 'Zerodha',
      type: 'Equity & F&O Portfolio',
      lastSynced: '',
      autoSync: false,
      status: 'Action Required',
      tokenStatus: 'Token Expired',
      iconBg: 'bg-[#ebf8ff] text-[#2b6cb0]',
      iconText: 'Z',
      highlighted: true
    },
    {
      id: '4',
      name: 'American Express',
      type: 'Corporate Card (1 account)',
      lastSynced: '3 hours ago',
      autoSync: true,
      status: 'Synced',
      iconBg: 'bg-[#ebf8ff] text-[#2b6cb0]',
      iconText: 'A'
    }
  ]);

  const toggleAutoSync = (id: string) => {
    setConnections(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, autoSync: !c.autoSync };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6 pb-4 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0a5c43]">Connectivity Hub</p>
          <h1 className="text-2xl font-black text-primary tracking-tight mt-1">Sync Management</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">Manage your secure financial data pipelines and bank connections.</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0a5c43] hover:bg-[#094d38] text-white rounded text-xs font-bold transition-all shadow-md">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Connection
        </button>
      </div>

      {/* AI Sync Optimizer Banner Box */}
      <div className="bg-[#3e5f4f] text-white p-6 rounded shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden border border-emerald-950/20">
        <div className="absolute right-0 bottom-0 w-32 h-32 rounded-tl bg-white/5 pointer-events-none select-none"></div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-[#a3e8cc] shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h3 className="text-sm font-black text-white">AI Sync Optimizer Active</h3>
            <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
              We've optimized your background sync frequency to save battery while keeping data fresh.
            </p>
          </div>
        </div>

        {/* Metrics info */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 px-4 py-2 rounded text-center">
            <p className="text-[9px] font-black uppercase text-white/50 tracking-wider">Uptime</p>
            <p className="text-sm font-black text-white mt-0.5">99.9%</p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded text-center">
            <p className="text-[9px] font-black uppercase text-white/50 tracking-wider">Latency</p>
            <p className="text-sm font-black text-white mt-0.5">140ms</p>
          </div>
        </div>
      </div>

      {/* Grid of Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((c) => (
          <div 
            key={c.id} 
            className={`bg-white border rounded p-6 shadow-sm flex flex-col justify-between space-y-6 transition-all ${
              c.highlighted 
                ? 'border-red-200 ring-2 ring-red-500/5 shadow-[0_4px_20px_rgba(239,68,68,0.04)]' 
                : 'border-gray-200/80 hover:border-gray-300'
            }`}
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-sm shadow-sm ${c.iconBg}`}>
                {c.iconText}
              </div>

              {/* Status pill badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[9px] font-black uppercase tracking-tight ${
                c.status === 'Synced'
                  ? 'bg-[#eefcf2] text-[#1aa34b]'
                  : 'bg-red-50 text-red-500'
              }`}>
                <span className={`w-1 h-1 rounded ${c.status === 'Synced' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                {c.status}
              </span>
            </div>

            {/* Title / Description */}
            <div className="space-y-1">
              <h3 className="text-sm font-black text-primary">{c.name}</h3>
              <p className="text-[11px] font-semibold text-gray-400 leading-normal">{c.type}</p>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* Bottom details */}
            <div className="space-y-3.5">
              {c.status === 'Synced' ? (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-400">Last synced</span>
                  <span className="font-bold text-primary">{c.lastSynced}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-red-500">{c.tokenStatus}</span>
                  <button className="font-black text-[#0a5c43] hover:underline">
                    Reconnect Now
                  </button>
                </div>
              )}

              {/* Auto sync toggler */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-400">Auto-sync</span>
                <button 
                  onClick={() => toggleAutoSync(c.id)}
                  className={`w-9 h-5 rounded p-0.5 transition-colors duration-200 outline-none ${
                    c.autoSync ? 'bg-[#0a5c43]' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded bg-white shadow-sm transform transition-transform duration-200 ${
                    c.autoSync ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>

          </div>
        ))}

        {/* Link Institution card */}
        <div className="bg-[#fcfdfd] border-2 border-dashed border-gray-200 rounded p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-gray-50/50 transition-colors min-h-[220px]">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200/60 shadow-inner">
            <span className="material-symbols-outlined text-[20px]">link</span>
          </div>
          <div>
            <h4 className="text-xs font-black text-primary">Link Institution</h4>
            <p className="text-[10px] font-semibold text-gray-400 mt-1">Secure 256-bit encryption</p>
          </div>
        </div>
      </div>

    </div>
  );
}
