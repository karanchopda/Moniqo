"use client";

import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';

import LandingNav from '@/components/Landing/LandingNav';
import LandingFooter from '@/components/Landing/LandingFooter';
import FeaturesHero from '@/components/Features/FeaturesHero';
import AIPrivateMentor from '@/components/Features/AIPrivateMentor';
import MoneyLeaksCard from '@/components/Features/MoneyLeaksCard';
import SmartAutomationCard from '@/components/Features/SmartAutomationCard';
import DeepAnalysisCard from '@/components/Features/DeepAnalysisCard';
import FeaturesCTA from '@/components/Features/FeaturesCTA';

export default function FeaturesPage() {
  const router = useRouter();

  const handleOpenExpertModal = () => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    router.push('/audit');
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-body text-primary overflow-x-hidden transition-colors duration-500 relative">
      {/* Background glows */}
      <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[50%] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <LandingNav />
      
      <main className="relative flex-1">
        <FeaturesHero />
        
        {/* Expert Analysis Trigger */}
        <section className="px-8 pb-16 pt-0 max-w-7xl mx-auto flex flex-col items-center">
            <div className="flex flex-col items-center text-center py-16 bg-white border border-primary/5 rounded-2xl w-full max-w-6xl shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-8 border border-accent/20 shadow-sm relative z-10 transition-transform duration-700 group-hover:rotate-[15deg]">
                    <span className="material-symbols-outlined text-4xl text-primary font-semibold">query_stats</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-headline font-bold text-primary mb-8 tracking-tight leading-tight relative z-10">
                    Ready for your <br/>
                    <span className="text-accent italic">Statement Analysis?</span>
                </h2>
                
                <button 
                  onClick={handleOpenExpertModal}
                  className="bg-primary text-white hover:bg-accent hover:text-primary px-10 py-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-4 group relative z-10 active:scale-95"
                >
                  Analyze Statement
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
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
