"use client";

import { useState } from 'react';

export default function AICoachPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste, Arpan! I've analyzed your spending for November. You've successfully reduced your dining out expenses by ₹4,500 compared to last month. Would you like to see where we can reallocate those savings?",
      time: "10:24 AM"
    },
    {
      id: 2,
      sender: 'user',
      text: "That's great! Yes, please. Can we look at some investment opportunities or should I top up my emergency fund?",
      time: "10:25 AM"
    },
    {
      id: 3,
      sender: 'bot',
      text: "Excellent strategy. Your current emergency fund is at ₹1,80,000, which covers 4 months of expenses. I recommend reaching a 6-month buffer (₹2,70,000) first.",
      hasGoal: true,
      goalTitle: "Goal Progress",
      goalProgress: 67,
      subText: "However, with the ₹4,500 surplus, we could split it: ₹3,000 to the fund and ₹1,500 into a Nifty 50 Index SIP. How does that sound?",
      time: "10:26 AM"
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: "I am analyzing your portfolio metrics. Let me help you set up an optimized allocation strategy for that.",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans pb-4">
      
      {/* Left Chat Column (col-span-8) */}
      <div className="lg:col-span-8 flex flex-col justify-between bg-white border border-gray-200 rounded p-6 shadow-sm min-h-[70vh]">
        
        {/* Header inside Column */}
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

        {/* Message bubble stream */}
        <div className="flex-1 overflow-y-auto space-y-6 my-6 pr-2 max-h-[50vh]">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={msg.id} className={`flex gap-3 items-start ${isBot ? '' : 'justify-end'}`}>
                {/* Bot Icon */}
                {isBot && (
                  <div className="w-8 h-8 rounded bg-[#3d5a4c] flex items-center justify-center text-accent shrink-0">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  </div>
                )}

                {/* Bubble content */}
                <div className="space-y-1.5 max-w-[85%]">
                  <div className={`p-4 rounded text-xs font-semibold leading-relaxed ${
                    isBot 
                      ? 'bg-[#c6f6d5]/40 text-[#0a5c43] border border-[#d2f4de]/40 rounded-tl' 
                      : 'bg-gray-50 text-gray-700 rounded-tr border border-gray-100'
                  }`}>
                    <p>{msg.text}</p>

                    {/* Nested goal indicator card if bot message has goal progress */}
                    {msg.hasGoal && (
                      <div className="mt-4 p-4 bg-white/70 backdrop-blur border border-emerald-100 rounded space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black">
                          <span className="text-gray-500">{msg.goalTitle}</span>
                          <span className="text-emerald-600">{msg.goalProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded" style={{ width: `${msg.goalProgress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {msg.subText && (
                      <p className="mt-4 text-[#0a5c43]/90">{msg.subText}</p>
                    )}
                  </div>
                  
                  {/* Time info */}
                  <p className={`text-[9px] font-bold text-gray-400 ${isBot ? 'pl-1' : 'text-right pr-1'}`}>
                    {msg.time}
                  </p>
                </div>

                {/* User avatar info */}
                {!isBot && (
                  <div className="w-8 h-8 rounded bg-[#2ebd75]/10 flex items-center justify-center shrink-0 border border-emerald-100">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <div className="space-y-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-gray-50/50 border border-gray-200 rounded px-4 py-3 focus-within:border-[#0a5c43] transition-colors relative">
            <button type="button" className="text-gray-400 hover:text-primary transition-colors shrink-0">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
            <input
              type="text"
              placeholder="Ask about your budget, leaks, or investments..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent text-xs font-semibold text-primary placeholder-gray-400 outline-none border-none pr-10"
            />
            <button type="submit" className="w-8 h-8 rounded bg-[#0a5c43] hover:bg-[#094d38] text-white flex items-center justify-center transition-all shadow-md shrink-0">
              <span className="material-symbols-outlined text-[16px] transform rotate-[-30deg]">send</span>
            </button>
          </form>

          {/* Quick recommendations tag row */}
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setInputText("Find subscription leaks")}
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200/60 rounded text-[10px] font-bold text-gray-600 transition-colors"
            >
              Find subscription leaks
            </button>
            <button 
              onClick={() => setInputText("Analyze tax savings")}
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200/60 rounded text-[10px] font-bold text-gray-600 transition-colors"
            >
              Analyze tax savings
            </button>
            <button 
              onClick={() => setInputText("SIP Performance")}
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200/60 rounded text-[10px] font-bold text-gray-600 transition-colors"
            >
              SIP Performance
            </button>
          </div>
        </div>

      </div>

      {/* Right Insights Sidebar Column (col-span-4) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Title row */}
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-400">Smart Insights</h2>
          <span className="material-symbols-outlined text-[#2ebd75] text-[20px]">auto_awesome</span>
        </div>

        {/* Card 1: Leak Detection (Critical status) */}
        <div className="bg-white border-l-4 border-l-red-500 border border-gray-200 rounded p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded bg-red-50 flex items-center justify-center text-red-500">
              <span className="material-symbols-outlined text-[18px]">no_sim</span>
            </div>
            <span className="text-[9px] font-black tracking-widest text-red-500 uppercase">Critical</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-black text-primary">Leak Detection</h4>
            <p className="text-[11px] font-semibold text-gray-400 leading-relaxed">
              We've identified a duplicate premium subscription for "CloudStorage Pro" across two different credit cards.
            </p>
          </div>

          <div className="flex justify-between items-end pt-2">
            <span className="text-base font-black text-red-500">₹899<span className="text-[10px] font-bold text-gray-400">/mo</span></span>
            <button className="text-[10px] font-black text-[#0a5c43] hover:underline">
              Resolve Now
            </button>
          </div>
        </div>

        {/* Card 2: Investment Boost */}
        <div className="bg-[#3b5e4c] text-white rounded p-5 shadow-md space-y-4 relative overflow-hidden border border-emerald-950/20">
          <div className="absolute right-0 bottom-0 w-20 h-20 rounded-tl bg-white/5 pointer-events-none"></div>

          <div>
            <p className="text-[9px] font-black tracking-widest text-[#a3e8cc] uppercase">Growth Opportunity</p>
            <h4 className="text-xs font-black text-white mt-1">Investment Boost</h4>
            <p className="text-[11px] font-semibold text-white/80 mt-1 leading-relaxed">
              Your idle cash in savings could earn 4.2% more in a Liquid Fund.
            </p>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-b border-white/10 text-xs font-bold">
            <span className="text-white/60">Potential Gain</span>
            <span className="text-[#a3e8cc] font-black">₹12,400/yr</span>
          </div>

          <button className="w-full py-2 bg-[#2ebd75] hover:bg-[#28ad6b] text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors shadow-sm text-center">
            Calculate SIP
          </button>
        </div>

        {/* Card 3: Budget Optimization */}
        <div className="bg-white border border-gray-200 rounded p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
              <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            </div>
            <h4 className="text-xs font-black text-primary">Budget Optimization</h4>
          </div>

          <div className="space-y-4">
            {/* Entertainment */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-500">Entertainment</span>
                <span className="text-primary">₹8,000 / <span className="text-gray-400">₹6,000</span></span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded overflow-hidden">
                <div className="h-full bg-red-500 rounded" style={{ width: '100%' }}></div>
              </div>
              <p className="text-[9px] font-black text-red-500 uppercase">₹2,000 over budget</p>
            </div>

            {/* Grocery */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-500">Grocery</span>
                <span className="text-primary">₹12,000 / <span className="text-gray-400">₹15,000</span></span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded overflow-hidden">
                <div className="h-full bg-emerald-500 rounded" style={{ width: '80%' }}></div>
              </div>
              <p className="text-[9px] font-black text-emerald-600 uppercase">₹3,000 under budget</p>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-gray-100">
            <button className="text-[10px] font-black text-[#0a5c43] hover:underline">
              View All Categories
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
