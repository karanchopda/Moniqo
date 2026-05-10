"use client";

import LandingNav from '@/components/Landing/LandingNav';
import LandingFooter from '@/components/Landing/LandingFooter';

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen font-body text-primary overflow-x-hidden">
      <LandingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-5xl md:text-7xl font-headline font-black text-primary mb-10 tracking-tighter leading-tight">
          Terms of <span className="text-accent italic">Service</span>
        </h1>
        <p className="text-muted mb-12 text-lg font-medium">Last updated: May 10, 2024</p>
        
        <div className="prose prose-lg max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-headline font-black text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm">01</span>
              Acceptance of Terms
            </h2>
            <p className="text-muted leading-relaxed">
              By accessing and using Moniqo, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline font-black text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm">02</span>
              User Data & Intelligence
            </h2>
            <p className="text-muted leading-relaxed">
              Moniqo processes financial data provided by you (bank statements) to generate AI-driven insights. While our AI algorithms are highly advanced, they are for informational purposes only and do not constitute professional financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline font-black text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm">03</span>
              Security Protocols
            </h2>
            <p className="text-muted leading-relaxed">
              We employ industry-standard encryption and security protocols to protect your data. However, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline font-black text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm">04</span>
              Service Modifications
            </h2>
            <p className="text-muted leading-relaxed">
              Moniqo reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice at any time.
            </p>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
