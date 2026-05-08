"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';

import LandingNav from '@/components/Landing/LandingNav';
import LandingFooter from '@/components/Landing/LandingFooter';
import FeaturesHero from '@/components/Features/FeaturesHero';
import AIPrivateMentor from '@/components/Features/AIPrivateMentor';
import MoneyLeaksCard from '@/components/Features/MoneyLeaksCard';
import SmartAutomationCard from '@/components/Features/SmartAutomationCard';
import DeepAnalysisCard from '@/components/Features/DeepAnalysisCard';
import ExpertAnalyserView from '@/components/Features/ExpertAnalyserView';
import FeaturesCTA from '@/components/Features/FeaturesCTA';

export default function FeaturesPage() {
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const router = useRouter();

  const handleOpenExpertModal = () => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    router.push('/audit');
  };

  return (
    <div className="bg-white min-h-screen font-body text-primary overflow-x-hidden transition-colors duration-500 relative">
      {/* Background glows */}
      <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[50%] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <LandingNav />
      
      <main className="relative">
        <FeaturesHero />
        
        {/* Expert Analysis Trigger */}
        <section className="px-8 pb-32 pt-10 max-w-[1550px] mx-auto flex flex-col items-center">
            <div className="flex flex-col items-center text-center py-20 bg-white border border-primary/5 rounded-[4rem] w-full max-w-6xl shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-8 border border-accent/20 shadow-sm relative z-10 transition-transform duration-700 group-hover:rotate-[15deg]">
                    <span className="material-symbols-outlined text-4xl text-primary font-black">query_stats</span>
                </div>
                
                <h2 className="text-4xl md:text-7xl font-headline font-black text-primary mb-10 tracking-tighter leading-tight relative z-10">
                    Ready for your <br/>
                    <span className="text-accent italic">Professional Audit?</span>
                </h2>
                
                <button 
                  onClick={handleOpenExpertModal}
                  className="bg-primary text-white hover:bg-accent hover:text-primary px-16 py-6 rounded-full font-black text-xs uppercase tracking-[0.35em] transition-all shadow-3xl flex items-center gap-4 group relative z-10 active:scale-95"
                >
                  Initiate Secure Audit
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-2 transition-transform">bolt</span>
                </button>
            </div>
        </section>

        {/* Features Bento Layout */}
        <section className="px-8 pb-10 max-w-7xl mx-auto flex flex-col gap-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Top Row: Private Mentor (8 cols) + Money Leaks (4 cols) */}
            <div className="lg:col-span-8">
              <AIPrivateMentor />
            </div>
            <div className="lg:col-span-4">
              <MoneyLeaksCard />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Bottom Row: Smart Automation (4 cols) + Deep Analysis (8 cols) */}
            <div className="lg:col-span-4">
              <SmartAutomationCard />
            </div>
            <div className="lg:col-span-8">
              <DeepAnalysisCard />
            </div>
          </div>
        </section>

        <FeaturesCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
