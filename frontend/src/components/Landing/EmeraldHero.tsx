"use client";

import Image from 'next/image';
import Link from 'next/link';

interface EmeraldHeroProps {
  onOpenAudit?: () => void;
}

export default function EmeraldHero({ onOpenAudit }: EmeraldHeroProps) {
  return (
    <section className="relative px-6 md:px-8 py-20 md:py-32 max-w-7xl mx-auto min-h-[85vh] flex flex-col md:flex-row items-center gap-12 md:gap-16">
      
      {/* Left Content */}
      <div className="flex-1 space-y-8 animate-fadeInUp">
        
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-primary font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-accent mr-2"></span>
          AI Personal Assistant
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
          Cultivate Wealth <br/>
          through <span className="text-accent">Intelligence</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted max-w-xl leading-relaxed">
          Escape the spreadsheet chaos. Moniqo provides a mindful, AI-curated sanctuary designed to audit your capital flows and orchestrate organic growth.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/signup" className="btn btn-primary">
            Create Account
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          
          <button 
            onClick={onOpenAudit}
            className="btn btn-secondary"
          >
            <span className="material-symbols-outlined text-accent">analytics</span>
            Try Expert Analysis
          </button>
        </div>
      </div>

      {/* Right Visual */}
      <div className="flex-1 relative w-full h-[500px] md:h-[600px]">
        
        {/* Main Image */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
          <Image 
            src="/assets/images/hero.png"
            alt="Moniqo Professional Advisor"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Floating Card 1 - Net Flow */}
        <div className="absolute -left-4 md:-left-8 top-1/4 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-md w-64 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Net Flow</span>
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-accent text-lg">account_balance_wallet</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-primary mb-2">₹12,84,000</div>
          <div className="flex items-center text-xs font-semibold text-accent gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            14.2% Growth
          </div>
        </div>

        {/* Floating Card 2 - Status */}
        <div className="absolute -bottom-4 md:-bottom-8 right-4 md:right-8 bg-primary p-6 rounded-xl shadow-lg w-72 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Live Analysis</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { pair: "USD/INR", val: "83.41", change: "+0.04%" },
              { pair: "GBP/INR", val: "105.74", change: "+0.12%" }
            ].map((rate, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">{rate.pair}</span>
                <span className="text-sm font-bold text-accent">{rate.val} <span className="text-xs text-gray-400 ml-1">{rate.change}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
