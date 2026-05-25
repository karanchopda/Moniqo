"use client";

import { useState } from 'react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8 pb-4 font-sans">
      
      {/* Top Header Label */}
      <div>
        <h1 className="text-xl font-black text-primary tracking-tight">Help Center</h1>
      </div>

      {/* Hero Wavy Banner Container */}
      <div className="relative overflow-hidden rounded bg-gradient-to-br from-[#0c2f24] via-[#094030] to-[#0a5c43] p-10 md:p-14 text-center text-white shadow-lg border border-emerald-950/20">
        {/* Wavy background decor overlay */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-100 via-emerald-900 to-emerald-950"></div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded pointer-events-none"></div>

        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            How can we help you today?
          </h2>

          {/* Search bar inside banner */}
          <div className="flex bg-white rounded p-1.5 shadow-md items-center max-w-xl mx-auto border border-gray-100">
            <input 
              type="text" 
              placeholder="Search articles, tutorials, and FAQ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 pl-5 pr-3 py-2 text-xs font-semibold text-primary outline-none border-none placeholder-gray-400 bg-transparent"
            />
            <button className="flex items-center gap-1.5 bg-[#0a5c43] hover:bg-[#084b36] text-white px-5 py-2 rounded text-xs font-black transition-colors shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[15px]">search</span>
              Search
            </button>
          </div>

          {/* Popular Search tags list */}
          <p className="text-[10px] font-semibold text-[#a3e8cc]">
            Popular: <span className="underline cursor-pointer hover:text-white mx-1">Reset Password</span> • <span className="underline cursor-pointer hover:text-white mx-1">Link Bank Account</span> • <span className="underline cursor-pointer hover:text-white mx-1">Pro Pricing</span>
          </p>
        </div>
      </div>

      {/* Four Category Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Getting Started */}
        <div className="bg-white border border-gray-200/80 rounded p-6 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded bg-emerald-50 text-[#0a5c43] flex items-center justify-center border border-emerald-100 shadow-sm">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-primary">Getting Started</h3>
              <p className="text-[11px] font-semibold text-gray-400 leading-relaxed">
                New to MONIQO? Learn the basics and set up your dashboard in minutes.
              </p>
            </div>
          </div>
          <div className="space-y-2 pt-2 text-[11px] font-bold text-[#0a5c43]">
            <p className="underline hover:text-[#084b36] cursor-pointer">Initial setup guide</p>
            <p className="underline hover:text-[#084b36] cursor-pointer">Importing your data</p>
            <p className="underline hover:text-[#084b36] cursor-pointer">Personalizing categories</p>
          </div>
        </div>

        {/* Card 2: Account & Security */}
        <div className="bg-white border border-gray-200/80 rounded p-6 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded bg-emerald-50 text-[#0a5c43] flex items-center justify-center border border-emerald-100 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-primary">Account & Security</h3>
              <p className="text-[11px] font-semibold text-gray-400 leading-relaxed">
                Manage your profile settings, 2FA, and privacy permissions.
              </p>
            </div>
          </div>
          <div className="space-y-2 pt-2 text-[11px] font-bold text-[#0a5c43]">
            <p className="underline hover:text-[#084b36] cursor-pointer">Enabling 2FA</p>
            <p className="underline hover:text-[#084b36] cursor-pointer">Managing devices</p>
            <p className="underline hover:text-[#084b36] cursor-pointer">Data encryption info</p>
          </div>
        </div>

        {/* Card 3: AI Coach (Fully Filled Green Card) */}
        <div className="bg-[#3b5e4c] text-white rounded p-6 shadow-md flex flex-col justify-between space-y-5 border border-emerald-950/20">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded bg-white/10 text-[#4df2aa] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-white">AI Coach</h3>
              <p className="text-[11px] font-semibold text-white/80 leading-relaxed">
                How to leverage our smart insights to reach your financial goals faster.
              </p>
            </div>
          </div>
          <div className="space-y-2 pt-2 text-[11px] font-bold text-[#4df2aa]">
            <p className="underline hover:text-white cursor-pointer">Prompting the Coach</p>
            <p className="underline hover:text-white cursor-pointer">Smart alerts setup</p>
            <p className="underline hover:text-white cursor-pointer">Advanced forecasting</p>
          </div>
        </div>

        {/* Card 4: Transactions */}
        <div className="bg-white border border-gray-200/80 rounded p-6 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded bg-emerald-50 text-[#0a5c43] flex items-center justify-center border border-emerald-100 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-primary">Transactions</h3>
              <p className="text-[11px] font-semibold text-gray-400 leading-relaxed">
                Everything about syncing, categorizing, and manual entries.
              </p>
            </div>
          </div>
          <div className="space-y-2 pt-2 text-[11px] font-bold text-[#0a5c43]">
            <p className="underline hover:text-[#084b36] cursor-pointer">Bank sync issues</p>
            <p className="underline hover:text-[#084b36] cursor-pointer">Editing bulk tags</p>
            <p className="underline hover:text-[#084b36] cursor-pointer">Exporting reports</p>
          </div>
        </div>

      </div>

      {/* Trending Tutorials Header Row */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Top Resources</p>
            <h2 className="text-lg font-black text-primary mt-1">Trending Tutorials</h2>
          </div>
          <button className="text-xs font-black text-[#0a5c43] hover:underline flex items-center gap-1">
            View all documentation
            <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
          </button>
        </div>

        {/* Video Guide & Quick Tips Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Video Guide Card (col-span-8) */}
          <div className="lg:col-span-8 rounded relative overflow-hidden h-[300px] shadow-sm border border-gray-200 flex flex-col justify-end p-6">
            {/* Background image overlay */}
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=400&q=80" 
              alt="Dashboard overview display" 
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />
            {/* Dark shadow layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            <div className="relative z-10 space-y-2 text-white">
              <span className="inline-block bg-[#2ebd75] text-white px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                Video Guide
              </span>
              <h3 className="text-lg font-black tracking-tight leading-tight">
                Mastering the Advanced Dashboard
              </h3>
              <p className="text-xs text-white/80 max-w-lg font-semibold leading-relaxed">
                Learn how to create custom views and cross-reference your spending with historical data.
              </p>
            </div>
          </div>

          {/* Quick Tips Card (col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0a5c43] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <h4 className="text-xs font-black text-primary uppercase tracking-wider">Quick Tips</h4>
              </div>

              <div className="space-y-4 text-xs font-bold text-gray-500 leading-normal">
                {/* Tip 1 */}
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px] font-black text-primary shrink-0">1</div>
                  <p>Use <span className="text-primary font-black">‘Cmd + K’</span> to open the global search from anywhere.</p>
                </div>
                {/* Tip 2 */}
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px] font-black text-primary shrink-0">2</div>
                  <p>Connect more than 3 banks to unlock <span className="text-[#0a5c43] font-black">"Deep Portfolio Insights"</span>.</p>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded font-bold text-xs transition-colors text-center shadow-sm">
              See all tips
            </button>
          </div>

        </div>
      </div>

      {/* Still need help Section */}
      <div className="bg-[#e6f4ee] rounded p-8 text-center space-y-6">
        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="text-base font-black text-[#0a5c43]">Still need help?</h3>
          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            Our support team is available 24/7 to help you resolve any issues or answer questions about your MONIQO account.
          </p>
        </div>

        {/* Support Options cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          
          {/* Card 1: Live Chat */}
          <div className="bg-white border border-gray-200/60 p-4 rounded shadow-sm flex items-center justify-between hover:border-[#0a5c43]/40 cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#e6f4ee] text-[#0a5c43] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-primary leading-tight">Live Chat</h4>
                <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Average response time: 2 mins</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-[18px]">chevron_right</span>
          </div>

          {/* Card 2: Email Support */}
          <div className="bg-white border border-gray-200/60 p-4 rounded shadow-sm flex items-center justify-between hover:border-[#0a5c43]/40 cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#e6f4ee] text-[#0a5c43] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-primary leading-tight">Email Support</h4>
                <p className="text-[10px] font-semibold text-gray-400 mt-0.5">We'll get back to you within 24h</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-[18px]">chevron_right</span>
          </div>

        </div>
      </div>

    </div>
  );
}
