"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';
import Link from 'next/link';
import api from '@/lib/api';
import { getErrorMessage } from '@/lib/error';

interface Leak {
  category: string;
  amount: number;
  reason: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  balance?: number;
}

interface BankStatementAuditProps {
  className?: string;
}

const COLORS = [
  'var(--color-audit-1)',
  'var(--color-audit-2)',
  'var(--color-audit-3)',
  'var(--color-audit-4)',
  'var(--color-audit-5)',
  'var(--color-audit-6)',
];

const auditSteps = [
  { label: 'Reading Statement', icon: 'lock_open' },
  { label: 'Categorizing Transactions', icon: 'account_tree' },
  { label: 'Scanning for Spending Leaks', icon: 'search_insights' },
  { label: 'Generating AI Recommendations', icon: 'psychology' }
];

export default function BankStatementAudit({ className }: BankStatementAuditProps) {
  const [phase, setPhase] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [activeTab, setActiveTab] = useState<'pdf' | 'sms'>('pdf');
  const [smsText, setSmsText] = useState('');
  const [leaks, setLeaks] = useState<Leak[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<{
    summary: string;
    keyFindings: string[];
    moneyLeak: string;
    actions: string[];
    confidence: number;
  } | null>(null);
  const [wasteTotal, setWasteTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [auditStep, setAuditStep] = useState(0);

  const resetAudit = () => {
    setPhase('upload');
    setSelectedFile(null);
    setTransactions([]);
    setAiAnalysis(null);
    setError(null);
    setPassword('');
    setNeedsPassword(false);
    setSmsText('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setError(null);
    setPassword('');
    setNeedsPassword(false);

    if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content.includes('/Encrypt')) {
                setNeedsPassword(true);
            }
        };
        reader.readAsText(file.slice(0, 102400));
    }
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;
 
    setPhase('analyzing');
    if (!needsPassword) setError(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (password) {
      formData.append('password', password);
    }
 
    try {
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
 
      const statementId = uploadRes.data.statementId;
 
      // BullMQ Status Polling
      let status = 'PROCESSING';
      let attempts = 0;
      const maxAttempts = 60; // 2 minutes max
      
      setAuditStep(0); // Reading Statement
      
      while (status === 'PROCESSING' && attempts < maxAttempts) {
        attempts++;
        await new Promise(r => setTimeout(r, 2000));
        
        const statusRes = await api.get(`/upload/status/${statementId}`);
        status = statusRes.data.status;
        
        if (status === 'PASSWORD_REQUIRED') {
          setNeedsPassword(true);
          setPhase('upload');
          setError("This PDF is password-protected. Please enter the secure password to unlock.");
          return;
        }
        
        if (status === 'FAILED') {
          throw new Error("Moniqo engine failed to parse this bank statement.");
        }
        
        // Progress steps visually during polling
        if (attempts > 3 && auditStep === 0) {
          setAuditStep(1); // Categorizing Transactions
        }
      }
 
      if (status !== 'PROCESSED') {
        throw new Error("Parsing timed out. Please try again.");
      }
 
      setAuditStep(2); // Scanning for Spending Leaks
      const res = await api.post('/report/generate', { statementId });
      
      setAuditStep(3); // Generating AI Recommendations
      await new Promise(r => setTimeout(r, 1000));
 
      const report = res.data;
      const detectedLeaks = report.leaks || [];
      const calculatedWaste = detectedLeaks.reduce((sum: number, leak: Leak) => sum + (Number(leak.amount) || 0), 0);
      
      // Parse AI Insights
      let analysis = null;
      try {
        analysis = typeof report.aiInsights === 'string' 
            ? JSON.parse(report.aiInsights) 
            : report.aiInsights;
      } catch (e) {
        console.error("Failed to parse AI insights", e);
      }
 
      setLeaks(detectedLeaks);
      setTransactions(report.transactions || []);
      setAiAnalysis(analysis);
      setWasteTotal(calculatedWaste);
      setPhase('result');
      setAuditStep(0);
    } catch (err: any) {
      console.error(err);
      const msg = getErrorMessage(err, "Failed to process analysis. The AI encountered an anomaly.");
      const code = err.response?.data?.code;
      
      if (code === 'PASSWORD_REQUIRED' || msg.toLowerCase().includes('password')) {
        setNeedsPassword(true);
        if (password) {
            setError("Incorrect secure password. Please try again.");
        }
      } else {
        setError(msg);
      }
      setPhase('upload'); 
    }
  };

  const startSmsAnalysis = async () => {
    if (!smsText.trim()) return;

    setPhase('analyzing');
    setError(null);
    setAuditStep(0);

    try {
      const res = await api.post('/report/sms-scan', { smsText });
      
      setAuditStep(1);
      await new Promise(r => setTimeout(r, 800));
      setAuditStep(2);
      await new Promise(r => setTimeout(r, 800));
      setAuditStep(3);
      await new Promise(r => setTimeout(r, 800));

      const report = res.data;
      const detectedLeaks = report.leaks || [];
      const calculatedWaste = detectedLeaks.reduce((sum: number, leak: Leak) => sum + (Number(leak.amount) || 0), 0);
      
      let analysis = null;
      try {
        analysis = typeof report.aiInsights === 'string' 
            ? JSON.parse(report.aiInsights) 
            : report.aiInsights;
      } catch (e) {
        console.error("Failed to parse AI insights", e);
      }

      setLeaks(detectedLeaks);
      setTransactions(report.transactions || []);
      setAiAnalysis(analysis);
      setWasteTotal(calculatedWaste);
      setPhase('result');
      setAuditStep(0);
    } catch (err: any) {
      console.error(err);
      const msg = getErrorMessage(err, "Failed to process SMS scan. The AI encountered an anomaly.");
      setError(msg);
      setPhase('upload');
    }
  };

  const shouldShowRedAlert = error && (!needsPassword || (needsPassword && password));

  const chartData = useMemo(() => {
    if (transactions.length === 0) return [];
    const groups: { [key: string]: number } = {};
    transactions.forEach(t => {
      if (t.type === 'debit') {
        const d = new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        groups[d] = (groups[d] || 0) + Number(t.amount);
      }
    });
    return Object.entries(groups).map(([date, amount]) => ({ date, amount })).reverse();
  }, [transactions]);

  const categoryData = useMemo(() => {
    const cats: { [key: string]: number } = {};
    transactions.forEach(t => {
      if (t.type === 'debit') {
        cats[t.category] = (cats[t.category] || 0) + Number(t.amount);
      }
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className={`w-full ${className}`}>
      <AnimatePresence mode="wait">
      {phase === 'upload' && (
        <div className="w-full bg-white rounded p-6 md:p-12 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-300">
            <div className="absolute top-[-50%] left-[-10%] w-[80%] h-[80%] bg-primary/5 rounded blur-3xl pointer-events-none"></div>

            <div className="flex flex-col items-center text-center relative z-10 w-full max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-primary/5 rounded flex items-center justify-center mb-8 border border-primary/10 shadow-sm relative">
                <span className="material-symbols-outlined text-primary text-5xl">manage_search</span>
              </div>
              
              <h3 className="text-3xl font-bold text-primary mb-4 leading-snug">
                {selectedFile 
                  ? (needsPassword ? 'Password Required' : 'Ready to Analyze') 
                  : (activeTab === 'pdf' ? 'Analyze Bank Statement' : 'SMS Quick Scan')}
              </h3>
              <p className="text-muted mb-8 text-base leading-relaxed max-w-lg mx-auto">
                {selectedFile 
                  ? (needsPassword 
                      ? 'Please enter your statement password to proceed.' 
                      : 'File selected and ready for analysis.') 
                  : (activeTab === 'pdf' 
                      ? 'Upload your bank statement PDF to run a forensic AI money audit.' 
                      : 'Copy-paste raw SMS transaction logs for instant zero-friction feedback.')}
              </p>

              {shouldShowRedAlert && (
                 <div className="mb-10 w-full bg-red-50 border border-red-200 text-red-800 p-5 rounded flex items-start gap-4 text-left shadow-sm transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl text-red-600">warning</span>
                    <div>
                      <p className="text-xs font-bold uppercase mb-1 text-red-600">Notice</p>
                      <p className="text-sm font-semibold leading-relaxed">{error}</p>
                    </div>
                 </div>
              )}

              {!selectedFile && (
                <div className="flex bg-gray-100/80 border border-gray-200/50 p-1 rounded gap-1 mb-8 w-full max-w-sm mx-auto">
                  <button
                    onClick={() => setActiveTab('pdf')}
                    className={`flex-1 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'pdf' 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">description</span>
                    Upload PDF
                  </button>
                  <button
                    onClick={() => setActiveTab('sms')}
                    className={`flex-1 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'sms' 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">sms</span>
                    Quick Scan
                  </button>
                </div>
              )}

              {/* Render either Dropzone, SMS area or password box */}
              {!selectedFile ? (
                activeTab === 'pdf' ? (
                  <label className="cursor-pointer group w-full">
                    <div className="border border-gray-100 rounded p-16 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden shadow-sm hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="bg-primary text-white px-8 py-3.5 rounded font-semibold text-sm hover:scale-105 transition-transform flex items-center justify-center gap-3 relative z-10 shadow-md">
                            <span className="material-symbols-outlined text-lg">drive_folder_upload</span>
                            Select File
                        </span>
                        <p className="text-xs text-muted mt-6 relative z-10 font-semibold uppercase">Drag and drop statement here</p>
                    </div>
                    <input type="file" className="hidden" accept=".csv,.pdf" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="w-full space-y-6 relative z-10 transition-all duration-300">
                    <div className="relative group">
                      <textarea
                        rows={6}
                        placeholder={`Paste SMS text logs here. Example:\nDebited INR 250.00 from HDFC Bank to ZOMATO on 24-10-24.\nSent Rs.150 to SWIGGY via UPI Ref 4102941...\nDebited Rs 899.00 for Netflix Subscription on 23-10-24.`}
                        value={smsText}
                        onChange={(e) => setSmsText(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded p-6 text-primary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-sm shadow-sm"
                      />
                    </div>
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={startSmsAnalysis}
                        disabled={!smsText.trim()}
                        className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined text-lg">auto_awesome</span>
                        Scan SMS Logs
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full space-y-8 relative z-10 transition-all duration-300">
                    <div className="bg-gray-50 border border-gray-200 rounded p-8 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-5 overflow-hidden w-full">
                        <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-2xl">description</span>
                        </div>
                        <div className="flex flex-col items-start overflow-hidden w-full text-left">
                          <span className="text-primary font-bold truncate text-xl w-full">{selectedFile.name}</span>
                          <span className="text-xs uppercase font-bold text-muted mt-1">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {needsPassword ? 'Encrypted' : 'Ready'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {needsPassword && (
                      <div className="w-full transition-all duration-300">
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors font-bold">lock</span>
                          <input 
                            type="password"
                            placeholder="Enter Statement Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
                            className="w-full bg-white border border-gray-200 rounded py-4 pl-16 pr-8 text-primary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-base shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button 
                            onClick={startAnalysis}
                            className="flex-1 bg-primary text-white px-8 py-4 rounded font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <span className="material-symbols-outlined text-lg">analytics</span>
                            {needsPassword ? 'Unlock & Analyze' : 'Analyze Statement'}
                        </button>
                        <button 
                            onClick={resetAudit}
                            className="text-primary hover:bg-primary/5 border border-primary/20 hover:border-primary/50 px-8 py-4 rounded font-semibold text-sm transition-all w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20 w-full transition-all duration-300"
          >
            <div className="relative w-40 h-40 mb-16">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded border-t-2 border-l-2 border-primary opacity-80 shadow-[0_0_30px_rgba(0,51,28,0.2)]"
              />
              <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded border-b-2 border-r-2 border-secondary opacity-40"
              />
              <motion.div 
                animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.2, 0.6, 0.2] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-12 rounded bg-primary-container blur-xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="material-symbols-outlined text-primary text-4xl animate-pulse">query_stats</span>
              </div>
            </div>
            
            <h3 className="text-3xl font-headline font-bold text-primary mb-6 tracking-tight text-center">
              Analyzing Statement...
            </h3>
            
            <div className="w-full max-w-md space-y-4 mb-8">
              {auditSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded flex items-center justify-center border transition-all duration-500 ${
                    i < auditStep ? 'bg-primary border-primary text-on-primary' : 
                    i === auditStep ? 'border-primary text-primary animate-pulse' : 
                    'border-outline-variant text-on-surface-variant/20'
                  }`}>
                    <span className="material-symbols-outlined text-sm">{i < auditStep ? 'done' : step.icon}</span>
                  </div>
                  <span className={`text-sm font-semibold tracking-wider uppercase transition-all duration-500 ${
                    i <= auditStep ? 'text-primary' : 'text-on-surface-variant/20'
                  }`}>{step.label}</span>
                </div>
              ))}
            </div>

            <p className="text-primary font-semibold uppercase tracking-wider text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-primary"></span>
              AI Analysis Engine Active
            </p>
          </div>
        )}

        {phase === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full space-y-10 pb-20"
          >
            <div className="bg-white rounded p-8 md:p-12 lg:p-16 border border-gray-100 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-12 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded -mr-48 -mt-48 blur-[120px] pointer-events-none" />
              
              <div className="space-y-8 relative z-10 w-full">
                <div className="flex items-center gap-4">
                  <span className="inline-block px-5 py-2 rounded bg-primary-container/10 text-primary font-semibold uppercase text-xs tracking-wider border border-primary/10">
                    Analysis Complete
                  </span>
                  {transactions.length > 0 && (
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50">
                      <span className="material-symbols-outlined text-sm">history</span>
                      Categorized Transactions
                    </span>
                  )}
                </div>
                <h3 className="text-3xl md:text-5xl font-headline font-bold leading-tight text-primary tracking-tight">
                  We identified <br/>
                  <span className="text-on-primary-container italic transition-colors">₹{wasteTotal.toLocaleString()}</span> <br/> 
                  <span className="text-xl md:text-2xl text-primary/50 leading-none">in annual spending leaks.</span>
                </h3>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-8 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50 mb-1">External Spend</span>
                    <span className="text-xl font-headline font-bold text-primary">₹{wasteTotal.toLocaleString()}</span>
                  </div>
                  <div className="w-[1px] h-10 bg-outline-variant/20 self-end mb-1"></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50 mb-1">Internal Transfers</span>
                    <span className="text-xl font-headline font-bold text-on-surface-variant/60">₹{(transactions.filter(t => t.category === 'Transfer').reduce((s, t) => s + Number(t.amount || 0), 0)).toLocaleString()}</span>
                  </div>
                </motion.div>
                {aiAnalysis && (
                  <p className="text-on-surface-variant text-xl leading-relaxed font-medium pt-2 max-w-xl">
                    {aiAnalysis.summary}
                  </p>
                )}
              </div>

              <div className="relative z-10 w-full md:w-auto shrink-0 flex flex-col items-center gap-6">
                {aiAnalysis && (
                   <div className="flex flex-col items-center">
                      <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50 mb-2">Confidence Score</div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-primary/10 rounded overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${aiAnalysis.confidence}%` }}
                            className="h-full bg-primary"
                           />
                        </div>
                        <span className="text-sm font-semibold text-primary">{aiAnalysis.confidence}%</span>
                      </div>
                   </div>
                )}
                <button 
                  onClick={resetAudit}
                  className="w-full bg-white border border-primary/20 hover:border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 px-10 py-5 rounded text-xs font-semibold uppercase tracking-wider shadow-sm active:scale-95"
                >
                  Upload Another Statement
                </button>
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-10 py-5 rounded text-xs font-bold uppercase tracking-wider shadow-md hover:bg-primary/90 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">dashboard</span>
                  View Dashboard
                </Link>
              </div>
            </div>

            {aiAnalysis && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="grid grid-cols-1 md:grid-cols-2 gap-8"
               >
                  <div className="bg-white rounded p-10 border border-gray-100 relative overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
                     <div className="absolute top-0 right-0 p-8">
                        <span className="material-symbols-outlined text-primary/20 text-6xl">psychology</span>
                     </div>
                     <h4 className="text-xl font-headline font-bold text-primary mb-6 tracking-tight">Audit Summary</h4>
                     <div className="space-y-6">
                        {aiAnalysis.keyFindings.map((finding, i) => (
                           <div key={i} className="flex gap-4 items-start">
                              <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                 <span className="material-symbols-outlined text-xs text-primary">analytics</span>
                              </span>
                              <p className="text-on-surface-variant font-medium leading-relaxed">{finding}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-accent/5 rounded p-10 border border-accent/20 relative overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
                     <div className="absolute top-0 right-0 p-8">
                        <span className="material-symbols-outlined text-accent/20 text-6xl">bolt</span>
                     </div>
                     <h4 className="text-xl font-headline font-bold text-primary mb-6 tracking-tight">Recommended Actions</h4>
                     <div className="space-y-6">
                        {aiAnalysis.actions.map((action, i) => (
                           <div key={i} className="flex gap-4 items-start bg-white/50 p-4 rounded border border-accent/10">
                              <span className="material-symbols-outlined text-accent">check_circle</span>
                              <p className="text-primary font-bold leading-tight">{action}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-white rounded p-8 border border-gray-100 relative overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.02)]"
               >
                  <h4 className="text-lg font-headline font-bold text-primary mb-8 flex items-center gap-2 tracking-tight">
                    <span className="material-symbols-outlined text-secondary">analytics</span>
                    Spending Trend
                  </h4>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                        <XAxis 
                          dataKey="date" 
                          stroke="var(--color-outline)" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ background: 'var(--color-background)', border: '1px solid var(--color-audit-border)', borderRadius: '4px', color: 'var(--color-on-surface)' }}
                          itemStyle={{ color: 'var(--color-audit-2)' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="var(--color-audit-2)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-white rounded p-8 border border-gray-100 relative overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.02)]"
               >
                  <h4 className="text-lg font-headline font-bold text-primary mb-8 flex items-center gap-2 tracking-tight">
                    <span className="material-symbols-outlined text-secondary">pie_chart</span>
                    Expense Breakdown
                  </h4>
                  <div className="h-[300px] w-full flex items-center">
                    <div className="w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {categoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ background: 'var(--color-background)', border: '1px solid var(--color-audit-border)', borderRadius: '4px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 space-y-4 pr-4">
                        {categoryData.slice(0, 4).map((cat, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{cat.name}</span>
                            </div>
                            <span className="text-xs font-bold text-primary">₹{cat.value.toLocaleString()}</span>
                          </div>
                        ))}
                    </div>
                  </div>
               </motion.div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-headline font-bold text-primary flex items-center gap-3 px-2 tracking-tight">
                <span className="material-symbols-outlined text-secondary">troubleshoot</span>
                Identified Spending Leaks
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leaks.map((leak, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.6, type: 'spring' }}
                    className="bg-white border border-outline-variant/30 hover:border-primary p-8 rounded transition-all duration-500 relative overflow-hidden group hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-primary/5 rounded blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <span className="text-xs font-semibold uppercase text-primary tracking-wider bg-primary/5 border border-primary/10 px-3 py-1.5 rounded">
                          {leak.category}
                        </span>
                        <span className="text-xl font-headline font-bold text-secondary tracking-tight">₹{leak.amount}</span>
                      </div>
                      <p className="text-base text-on-surface-variant font-medium leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
                        "{leak.reason}"
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {leaks.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white border border-dashed border-outline-variant rounded">
                    <div className="w-20 h-20 bg-primary/5 rounded flex items-center justify-center mx-auto mb-6">
                      <span className="material-symbols-outlined text-5xl text-primary">verified_user</span>
                    </div>
                    <p className="text-primary font-bold text-xl mb-3 tracking-tight">No leaks detected</p>
                    <p className="text-on-surface-variant font-medium text-lg max-w-md mx-auto">No significant leaks detected. Your capital deployment is highly optimized.</p>
                  </div>
                )}
              </div>
            </div>
            
            {transactions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-6 pt-10"
              >
                <h4 className="text-lg font-headline font-bold text-primary flex items-center gap-3 px-2 tracking-tight">
                  <span className="material-symbols-outlined text-secondary">receipt_long</span>
                  Categorized Transactions
                </h4>
                <div className="bg-white border border-outline-variant/30 rounded overflow-hidden shadow-2xl">
                  <div className="max-h-[500px] overflow-y-auto w-full custom-scrollbar">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-surface-container-low sticky top-0 z-20 border-b border-outline-variant/30">
                        <tr>
                          <th className="px-8 py-6 font-semibold uppercase text-xs tracking-wider text-on-surface-variant">Date</th>
                          <th className="px-8 py-6 font-semibold uppercase text-xs tracking-wider text-on-surface-variant">Description</th>
                          <th className="px-8 py-6 font-semibold uppercase text-xs tracking-wider text-on-surface-variant">Category</th>
                          <th className="px-8 py-6 font-semibold uppercase text-xs tracking-wider text-on-surface-variant text-right">Amount</th>
                          <th className="px-8 py-6 font-semibold uppercase text-xs tracking-wider text-on-surface-variant text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {transactions.map((t, i) => (
                          <tr key={t.id || i} className="hover:bg-primary/5 transition-colors group">
                            <td className="px-8 py-5 text-on-surface-variant font-medium">
                              {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${t.type === 'credit' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                     <span className="material-symbols-outlined text-sm">{t.type === 'credit' ? 'stat_3' : 'payments'}</span>
                                  </div>
                                  <span className="text-primary font-bold max-w-md truncate group-hover:text-secondary transition-colors" title={t.description}>
                                    {t.description}
                                  </span>
                               </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded shadow-sm border ${
                                t.category === 'Transfer' ? 'bg-surface-variant/20 border-outline-variant text-on-surface-variant/60' : 
                                t.type === 'credit' ? 'bg-secondary/5 border-secondary/20 text-secondary' : 'bg-primary/5 border-primary/20 text-primary'
                              }`}>
                                {t.category}
                              </span>
                            </td>
                            <td className={`px-8 py-5 font-headline font-bold text-base text-right ${t.type === 'credit' ? 'text-secondary' : 'text-primary'}`}>
                              {t.type === 'credit' ? '+' : '-'}₹{Number(t.amount || 0).toLocaleString()}
                            </td>
                            <td className="px-8 py-5 text-right font-headline font-bold text-on-surface-variant/50">
                              {t.balance ? `₹${Number(t.balance).toLocaleString()}` : '--'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8 }}
               className="bg-white mt-12 p-8 md:p-10 rounded border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-transparent to-primary/5 pointer-events-none"></div>
              <div className="relative z-10 text-center md:text-left">
                <p className="text-on-surface-variant/60 text-xs font-semibold uppercase tracking-wider mb-2">Projected Annual Leakage</p>
                <div className="text-primary font-headline font-bold text-3xl md:text-4xl tracking-tight">₹{(wasteTotal * 12).toLocaleString()}</div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full md:w-auto">
                <Link href="/dashboard" className="w-full sm:w-auto bg-primary/5 text-primary hover:bg-primary/10 px-8 py-4 rounded font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-primary">dashboard</span>
                  Dashboard
                </Link>
                <button className="w-full sm:w-auto bg-accent text-primary border border-accent hover:border-white shadow-[0_0_40px_rgba(63,197,128,0.3)] px-10 py-4 rounded font-semibold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  Fix Leaks with AI
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 230, 164, 0.5);
        }
      `}</style>
    </div>
  );
}
