"use client";

import { useState } from 'react';
import {
  Bot,
  Brain,
  ChartNoAxesColumnIncreasing,
  Lightbulb,
  RefreshCw,
  Send,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react';
import api from '@/lib/api';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

const now = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export default function AICoachPage() {
  const openingMessage: Message = {
    id: 1,
    sender: 'bot',
    text: "Hello! I'm your Moniqo Auditor. Ask me about spending leaks, vendor patterns, budgets, or your next savings move.",
    time: now(),
  };

  const [messages, setMessages] = useState<Message[]>([openingMessage]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now(), sender: 'user', text, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await api.post('/chat/coach', { message: text });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.data.reply || 'No response received.',
          time: now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Unable to reach the advisor. Please try again.',
          time: now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const promptChips = [
    'Find subscription leaks',
    'How much did I spend on food?',
    'Give me a budget blueprint',
  ];

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-black tracking-[-0.01em] text-[#121c2d]">AI Coach</h1>
          <p className="mt-1 text-sm font-medium text-[#526176]">Ask focused questions about your audit, leaks, and monthly plan.</p>
        </div>
        <button
          onClick={() => setMessages([openingMessage])}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#dfe6e2] bg-white px-4 text-sm font-bold text-[#35455b] shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <section className="flex min-h-[640px] flex-col overflow-hidden rounded-md border border-[#dce4e0] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between border-b border-[#e7ece9] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#e5f7ee] text-[#007b43]">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#121c2d]">Financial Advisor AI</h2>
                <p className="mt-1 flex items-center gap-2 text-xs font-bold text-[#159957]">
                  <span className="h-2 w-2 rounded-md bg-[#159957]" />
                  Active and analyzing your data
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
            {messages.map((message) => {
              const isBot = message.sender === 'bot';

              return (
                <div key={message.id} className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
                  {isBot && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#00331c] text-white">
                      <Brain className="h-5 w-5" />
                    </div>
                  )}
                  <div className={`max-w-[86%] space-y-1.5 ${isBot ? '' : 'items-end'}`}>
                    <div
                      className={`rounded-md border px-4 py-3 text-sm font-medium leading-6 whitespace-pre-wrap ${
                        isBot
                          ? 'border-[#cbe9d8] bg-[#f2fff8] text-[#173525]'
                          : 'border-[#dfe6e2] bg-[#fbfcfb] text-[#243247]'
                      }`}
                    >
                      {message.text}
                    </div>
                    <p className={`text-[11px] font-bold text-[#8a97a3] ${isBot ? 'pl-1' : 'text-right pr-1'}`}>{message.time}</p>
                  </div>
                  {!isBot && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#d9f2e5] text-[#078649]">
                      <WalletCards className="h-5 w-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#00331c] text-white">
                  <Brain className="h-5 w-5" />
                </div>
                <div className="rounded-md border border-[#cbe9d8] bg-[#f2fff8] px-4 py-3 text-sm font-bold text-[#173525]">
                  Analyzing...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#e7ece9] p-4 sm:p-5">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3 rounded-md border border-[#dfe6e2] bg-[#fbfcfb] px-4 py-3 focus-within:border-[#159957]"
            >
              <input
                type="text"
                placeholder="Ask about your budget, leaks, or investments..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#121c2d] outline-none placeholder:text-[#8a97a3]"
              />
              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="hidden h-8 w-8 items-center justify-center rounded-md text-[#8a97a3] sm:flex"
                  aria-label="Clear message"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#00331c] text-white disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-3 flex flex-wrap gap-2">
              {promptChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setInputText(chip)}
                  className="rounded-md border border-[#dfe6e2] bg-white px-3 py-2 text-xs font-bold text-[#526176]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-md border border-[#9ed9ba] bg-[#f2fff8] p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#121c2d]">Smart Insights</h2>
              <Sparkles className="h-5 w-5 text-[#159957]" />
            </div>
            <div className="space-y-4">
              <div className="rounded-md border border-[#ffc6c3] bg-white p-5">
                <p className="text-xs font-black uppercase tracking-wide text-[#e40012]">Prompt</p>
                <h3 className="mt-2 text-base font-black text-[#121c2d]">Ask the Auditor</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-[#526176]">
                  Try asking for your biggest vendors, duplicate charges, or the month&apos;s avoidable spends.
                </p>
              </div>

              <div className="rounded-md bg-[#00331c] p-5 text-white">
                <p className="text-xs font-black uppercase tracking-wide text-[#9ed9ba]">Opportunity</p>
                <h3 className="mt-2 text-base font-black">Investment Boost</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-white/78">
                  Calculate SIP potential based on recurring savings found in your current spending.
                </p>
                <button
                  onClick={() => setInputText('Calculate my SIP potential')}
                  className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-[#159957] text-sm font-black text-white"
                >
                  Calculate SIP
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-[#dce4e0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#e5f7ee] text-[#007b43]">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="text-base font-black text-[#121c2d]">Budget Optimization</h3>
            </div>
            <p className="mt-4 text-sm font-medium leading-6 text-[#526176]">
              Ask for a category-wise cap plan, weekly targets, and where to trim without hurting essentials.
            </p>
            <button
              onClick={() => setInputText('Give me a category-wise budget optimization plan')}
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#dfe6e2] text-sm font-black text-[#00331c]"
            >
              <ChartNoAxesColumnIncreasing className="h-4 w-4" />
              Build Plan
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
