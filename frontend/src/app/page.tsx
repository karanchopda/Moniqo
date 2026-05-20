"use client";

import LandingNav from '@/components/Landing/LandingNav';
import EmeraldHero from '@/components/Landing/EmeraldHero';
import PartnerSection from '@/components/Landing/PartnerSection';
import ArboretumFeatures from '@/components/Landing/ArboretumFeatures';
import EmeraldCoach from '@/components/Landing/EmeraldCoach';
import HowItWorks from '@/components/Landing/HowItWorks';
import LandingPricing from '@/components/Landing/LandingPricing';
import LandingFooter from '@/components/Landing/LandingFooter';
import FeaturesCTA from '@/components/Features/FeaturesCTA';
import TestimonialSection from '@/components/Landing/TestimonialSection';
import FAQSection from '@/components/Landing/FAQSection';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const handleOpenAudit = () => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    router.push('/audit');
  };

  return (
    <div className="bg-background font-body text-on-surface flex flex-col selection:bg-primary-container/30 selection:text-primary overflow-x-hidden scroll-smooth transition-colors duration-500 min-h-screen">
      <LandingNav />

      <main className="relative pt-32 flex-1">
        <EmeraldHero onOpenAudit={handleOpenAudit} />

        <PartnerSection />

        {/* Rebranded Features */}
        <ArboretumFeatures />

        {/* AI Mentor Chat Interface */}
        <EmeraldCoach />

        {/* How It Works (Methodology) */}
        <HowItWorks />

        {/* Social Proof */}
        <TestimonialSection />

        {/* Pricing Section */}
        <LandingPricing />

        {/* FAQ Section */}
        <FAQSection />

        <FeaturesCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
