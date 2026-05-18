"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'coach';
  content: string;
}

export default function MentorChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'coach', content: 'Welcome! I am your AI Financial Mentor. Ask me anything about your transactions, spending categories, subscription leaks, or investment opportunities. What would you like to review today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkData = async () => {
      try {
        const res = await api.get('/report/latest');
        setHasData(!!res.data);
      } catch (err) {
        setHasData(false);
      }
    };
    checkData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await api.post('/chat/coach', { message: userMessage });
      setMessages(prev => [...prev, { role: 'coach', content: res.data.reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'coach', content: 'Connection interrupted. Please check your network connection and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (hasData === false) {
    return (
      <div className="space-y-8 pb-16">
        <div className="h-[70vh] flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden p-10 text-center relative">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-8 border border-primary/10 shadow-sm relative">
            <span className="material-symbols-outlined text-4xl text-primary/40">database_off</span>
          </div>
          
          <h2 className="text-3xl font-headline font-bold text-primary mb-4">Financial Data Needed</h2>
          <p className="text-muted max-w-md mb-10 leading-relaxed font-medium">
            To get personalized financial coaching, please upload your latest bank statement first. I will analyze your transactions to help you identify leaks and optimize your budget.
          </p>
          
          <Link href="/dashboard/sync" className="btn btn-primary px-10 py-5 text-base shadow-xl">
            <span className="material-symbols-outlined">sync</span>
            Upload Statement
          </Link>
        </div>
      </div>
    );
  }

  if (hasData === null) {
    return (
      <div className="space-y-8 pb-16">
        <div className="h-[70vh] flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <Loader2 className="animate-spin text-accent mb-4" size={40} />
          <p className="text-xs font-semibold uppercase tracking-wider text-primary/50">Connecting to AI Coach...</p>
        </div>
      </div>
    );
  }

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
            AI Money <span className="text-accent italic">Coach</span>
          </h1>
          <p className="text-sm font-medium text-muted">
            Ask questions about your spending, leaks, or how to optimize your budget.
          </p>
        </div>
      </div>

      <div className="h-[70vh] flex flex-col bg-white border border-gray-100 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Chat Header */}
        <div className="bg-primary/5 px-10 py-8 border-b border-primary/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(63,197,128,0.3)]">
              <span className="material-symbols-outlined text-primary text-xl">psychology</span>
            </div>
            <div>
              <h2 className="text-xl font-headline font-bold text-primary tracking-tight">AI Financial Mentor</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <p className="text-xs font-semibold uppercase tracking-wider text-primary/50">Online & Secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 relative z-10 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] p-6 rounded-2xl 
                  ${msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-none shadow-xl'
                    : 'bg-primary/5 border border-primary/5 text-primary rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'font-medium' : 'font-medium'}`}>
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-primary/5 border border-primary/5 p-6 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
                  <Loader2 className="animate-spin text-accent" size={20} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary/50">Thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white border-t border-primary/5 relative z-10">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask your AI Mentor a question about your spending..."
              className="w-full bg-primary/5 border border-transparent rounded-2xl py-6 pl-8 pr-20 text-sm text-primary placeholder-primary/30 focus:bg-white focus:border-accent outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all disabled:opacity-50 disabled:hover:bg-primary disabled:hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
