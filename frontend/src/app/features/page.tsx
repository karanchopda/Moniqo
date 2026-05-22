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
    <div className="bg-white min-h-screen flex flex-col font-body text-primary overflow-hidden transition-colors duration-500 relative">
      <LandingNav />
      
      <main className="relative flex-1">
        <FeaturesHero />
        
        <section className="px-4 sm:px-6 md:px-8 pb-12 max-w-7xl mx-auto">
          <div className="border border-outline-variant rounded-2xl bg-surface-container-low p-5 sm:p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <span className="material-symbols-outlined text-2xl">upload_file</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">Statement Analysis</p>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                  Upload once. Get a categorized audit in minutes.
                </h2>
                <p className="text-muted leading-relaxed max-w-2xl">
                  CSV and PDF statements are parsed, categorized, checked for duplicates, and converted into a report your dashboard and coach can use.
                </p>
              </div>
            </div>

            <button 
              onClick={handleOpenExpertModal}
              className="bg-primary text-white hover:bg-primary-light px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-3 active:scale-95 shrink-0"
            >
              Analyze Statement
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </section>

        <section className="px-4 sm:px-6 md:px-8 pb-10 max-w-7xl mx-auto flex flex-col gap-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">Core Capabilities</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Built around your actual transactions.
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              Each feature uses the same financial record, so uploads, reports, chat, and recommendations stay connected.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              <AIPrivateMentor />
            </div>
            <div className="lg:col-span-4">
              <MoneyLeaksCard />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
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
