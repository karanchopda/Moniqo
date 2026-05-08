"use client";

import Link from 'next/link';

interface LandingHeroProps {
  onOpenAudit?: () => void;
}

export default function LandingHero({ onOpenAudit }: LandingHeroProps) {
  return (
    <section className="relative min-h-screen bg-primary overflow-hidden px-4 sm:px-6 md:px-8 pt-24 sm:pt-32 pb-12 sm:pb-20 flex items-center">
      
      {/* Subtle Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left w-full">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            <span className="text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wide">AI Personal Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Sovereign Money. <br />
            <span className="text-gradient-accent">Perfect IQ.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed px-4 sm:px-0">
            Experience the tranquility of audited wealth. Moniqo transforms raw transaction data into a bespoke journey of clarity and foresight.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-center lg:justify-start gap-3 sm:gap-4 px-4 sm:px-0">
            <Link
              href="/signup"
              className="btn btn-primary w-full sm:w-auto justify-center"
            >
              <span>Create Your Account</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>

            {onOpenAudit ? (
              <button
                onClick={onOpenAudit}
                className="btn btn-secondary w-full sm:w-auto justify-center bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <span className="material-symbols-outlined text-accent">auto_awesome</span>
                Try Expert Audit
              </button>
            ) : (
              <Link
                href="/features"
                className="btn btn-secondary w-full sm:w-auto justify-center bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <span className="material-symbols-outlined text-accent">auto_awesome</span>
                Try Expert Audit
              </Link>
            )}
          </div>
        </div>

        {/* Right Content - App Mockup */}
        <div className="flex-1 relative flex justify-center lg:justify-end w-full mt-8 lg:mt-0">
          
          <div className="relative z-20 scale-90 sm:scale-100">
            <div className="w-[280px] sm:w-[300px] h-[580px] sm:h-[620px] bg-[#030405] rounded-[2.5rem] sm:rounded-[3rem] border-[8px] sm:border-[10px] border-[#111318] shadow-xl overflow-hidden flex flex-col">

              <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-b from-[#0a0c10] to-[#030405]">
                
                {/* Status Bar */}
                <div className="h-12 flex justify-between items-end px-8 pb-2 text-white/50">
                  <span className="text-xs font-semibold">9:41</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="material-symbols-outlined text-sm">signal_cellular_4_bar</span>
                    <span className="material-symbols-outlined text-sm">wifi</span>
                    <span className="material-symbols-outlined text-sm">battery_5_bar</span>
                  </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">AI Assistant</p>
                  <h4 className="text-2xl font-bold text-white mb-8">Good Morning,<br />Elite User</h4>

                  {/* Insight Card */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-accent text-xl">insights</span>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Yield Insight</p>
                    </div>
                    <p className="text-lg font-bold leading-tight mb-2 text-white">Optimized <span className="text-accent">14.2%</span> portfolio growth.</p>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">By reallocating idle cash to high-yield bonds, you're outpacing inflation.</p>

                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Net Worth</p>
                      <p className="text-xl font-bold text-white">$2.4M</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Liquid</p>
                      <p className="text-xl font-bold text-accent">$420K</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="h-20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent text-xl">add</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
