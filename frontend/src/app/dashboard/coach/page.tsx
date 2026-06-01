"use client";

import { useState } from 'react';
import api from '@/lib/api';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm your Moniqo Auditor. Upload a bank statement first, then ask me anything about your spending — vendor audits, leak detection, budget blueprints, or investment suggestions.",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await api.post('/chat/coach', { message: text });
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.data.reply || 'No response received.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Unable to reach the advisor. Please try again.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans pb-4">

      {/* Left Chat Column */}
      <div className="lg:col-span-8 flex flex-col justify-between bg-white border border-gray-200 rounded p-6 shadow-sm min-h-[70vh]">

        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-lg font-black text-primary">Financial Advisor AI</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-600">Active and analyzing your data</span>
            </div>
          </div>
          <button
            onClick={() => setMessages([messages[0]])}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">history</span>
            Clear History
          </button>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto space-y-6 my-6 pr-2 max-h-[50vh]">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={msg.id} className={`flex gap-3 items-start ${isBot ? '' : 'justify-end'}`}>
                {isBot && (
                  <div className="w-8 h-8 rounded bg-[#3d5a4c] flex items-center justify-center text-accent shrink-0">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  </div>
                )}
                <div className="space-y-1.5 max-w-[85%]">
                  <div className={`p-4 rounded text-xs font-semibold leading-relaxed whitespace-pre-wrap ${
                    isBot
                      ? 'bg-[#c6f6d5]/40 text-[#0a5c43] border border-[#d2f4de]/40 rounded-tl'
                      : 'bg-gray-50 text-gray-700 rounded-tr border border-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[9px] font-bold text-gray-400 ${isBot ? 'pl-1' : 'text-right pr-1'}`}>
                    {msg.time}
                  </p>
                </div>
                {!isBot && (
                  <div className="w-8 h-8 rounded bg-[#2ebd75]/10 flex items-center justify-center shrink-0 border border-emerald-100">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  </div>
                )}
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded bg-[#3d5a4c] flex items-center justify-center text-accent shrink-0">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <div className="p-4 rounded bg-[#c6f6d5]/40 border border-[#d2f4de]/40 text-[#0a5c43] text-xs font-semibold">
                Analyzing...
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="space-y-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-gray-50/50 border border-gray-200 rounded px-4 py-3 focus-within:border-[#0a5c43] transition-colors relative">
            <input
              type="text"
              placeholder="Ask about your budget, leaks, or investments..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-transparent text-xs font-semibold text-primary placeholder-gray-400 outline-none border-none pr-10"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-8 h-8 rounded bg-[#0a5c43] hover:bg-[#094d38] text-white flex items-center justify-center transition-all shadow-md shrink-0 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px] transform rotate-[-30deg]">send</span>
            </button>
          </form>
          <div className="flex flex-wrap items-center gap-2">
            {['Find subscription leaks', 'How much did I spend on food?', 'Budget blueprint'].map(q => (
              <button
                key={q}
                onClick={() => setInputText(q)}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200/60 rounded text-[10px] font-bold text-gray-600 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Insights Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-400">Smart Insights</h2>
          <span className="material-symbols-outlined text-[#2ebd75] text-[20px]">auto_awesome</span>
        </div>

        <div className="bg-white border-l-4 border-l-red-500 border border-gray-200 rounded p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded bg-red-50 flex items-center justify-center text-red-500">
              <span className="material-symbols-outlined text-[18px]">no_sim</span>
            </div>
            <span className="text-[9px] font-black tracking-widest text-red-500 uppercase">Tip</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-primary">Ask the Auditor</h4>
            <p className="text-[11px] font-semibold text-gray-400 leading-relaxed">
              Try asking: "How much did I spend on Swiggy?" or "Show my biggest money leaks."
            </p>
          </div>
        </div>

        <div className="bg-[#3b5e4c] text-white rounded p-5 shadow-md space-y-4 relative overflow-hidden border border-emerald-950/20">
          <div className="absolute right-0 bottom-0 w-20 h-20 rounded-tl bg-white/5 pointer-events-none"></div>
          <div>
            <p className="text-[9px] font-black tracking-widest text-[#a3e8cc] uppercase">Growth Opportunity</p>
            <h4 className="text-xs font-black text-white mt-1">Investment Boost</h4>
            <p className="text-[11px] font-semibold text-white/80 mt-1 leading-relaxed">
              Ask the AI coach to calculate your SIP potential based on your current spending.
            </p>
          </div>
          <button
            onClick={() => setInputText('Calculate my SIP potential')}
            className="w-full py-2 bg-[#2ebd75] hover:bg-[#28ad6b] text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors shadow-sm text-center"
          >
            Calculate SIP
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
              <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            </div>
            <h4 className="text-xs font-black text-primary">Budget Optimization</h4>
          </div>
          <p className="text-[11px] font-semibold text-gray-400 leading-relaxed">
            Ask the AI coach for a personalized budget blueprint based on your actual transactions.
          </p>
          <button
            onClick={() => setInputText('Give me a budget blueprint')}
            className="w-full text-[10px] font-black text-[#0a5c43] hover:underline text-center pt-2 border-t border-gray-100"
          >
            Get Budget Blueprint
          </button>
        </div>
      </div>

    </div>
  );
}
