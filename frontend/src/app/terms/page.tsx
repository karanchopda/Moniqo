"use client";
import LandingNav from '@/components/Landing/LandingNav';
import LandingFooter from '@/components/Landing/LandingFooter';

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-body text-primary overflow-x-hidden">
      <LandingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-20 md:py-24 flex-1">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 tracking-tight leading-tight">
          Terms of <span className="text-accent italic">Service</span>
        </h1>
        <p className="text-muted mb-10 text-base font-medium">Last updated: May 20, 2026</p>
        
        <div className="prose prose-lg max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">01</span>
              Acceptance of Terms
            </h2>
            <p className="text-muted leading-relaxed text-base">
              By accessing and using Moniqo, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">02</span>
              User Data & Insights
            </h2>
            <p className="text-muted leading-relaxed text-base">
              Moniqo processes financial data provided by you (bank statements) to generate AI-driven insights. While our AI algorithms are highly advanced, they are for informational purposes only and do not constitute professional financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">03</span>
              Security
            </h2>
            <p className="text-muted leading-relaxed text-base">
              We employ industry-standard encryption and security systems to protect your data. However, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">04</span>
              Service Modifications
            </h2>
            <p className="text-muted leading-relaxed text-base">
              Moniqo reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice at any time.
            </p>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
