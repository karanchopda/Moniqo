"use client";

import LandingNav from '@/components/Landing/LandingNav';
import LandingFooter from '@/components/Landing/LandingFooter';

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen font-body text-primary overflow-x-hidden">
      <LandingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-5xl md:text-7xl font-headline font-black text-primary mb-10 tracking-tighter leading-tight">
          Privacy <span className="text-accent italic">Protocol</span>
        </h1>
        <p className="text-muted mb-12 text-lg font-medium">Last updated: May 10, 2024</p>
        
        <div className="prose prose-lg max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-headline font-black text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm">01</span>
              Data Sovereignty
            </h2>
            <p className="text-muted leading-relaxed">
              Your financial data is your property. Moniqo never sells or shares your personal financial information with third-party advertisers. All data is used exclusively to generate your private wealth reports.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline font-black text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm">02</span>
              Neural Processing
            </h2>
            <p className="text-muted leading-relaxed">
              We use OpenAI's GPT-4o models to analyze your transactions. All data sent to AI models is anonymized and redacted to remove account numbers and sensitive identifiers, ensuring maximum privacy during the intelligence phase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline font-black text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm">03</span>
              Cookie Policy
            </h2>
            <p className="text-muted leading-relaxed">
              We use only essential cookies to manage your session and security. No cross-site tracking or invasive analytics are deployed within the Moniqo sanctuary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline font-black text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm">04</span>
              Right to Erasure
            </h2>
            <p className="text-muted leading-relaxed">
              You maintain the right to delete your data and account at any time. Upon deletion, all financial statements and transaction records are purged from our primary databases within 24 hours.
            </p>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
