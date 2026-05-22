"use client";

import LandingNav from '@/components/Landing/LandingNav';
import LandingFooter from '@/components/Landing/LandingFooter';
import PricingHero from '@/components/Pricing/PricingHero';
import PricingCards from '@/components/Pricing/PricingCards';
import PricingBenefits from '@/components/Pricing/PricingBenefits';
import PricingFAQ from '@/components/Pricing/PricingFAQ';

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-body text-primary selection:bg-accent/30 selection:text-primary overflow-hidden scroll-smooth transition-colors duration-500 relative">
      <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[50%] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <LandingNav />
      
      <main className="relative flex-1">
        <PricingHero />
        <PricingCards />
        <PricingBenefits />
        <PricingFAQ />
      </main>

      <LandingFooter />
    </div>
  );
}
