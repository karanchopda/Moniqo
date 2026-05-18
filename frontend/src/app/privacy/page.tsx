"use client";
import LandingNav from '@/components/Landing/LandingNav';
import LandingFooter from '@/components/Landing/LandingFooter';

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen font-body text-primary overflow-x-hidden">
      <LandingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 tracking-tight leading-tight">
          Privacy <span className="text-accent italic">Policy</span>
        </h1>
        <p className="text-muted mb-10 text-base font-medium">Last updated: May 10, 2024</p>
        
        <div className="prose prose-lg max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">01</span>
              Data Protection
            </h2>
            <p className="text-muted leading-relaxed text-base">
              Your financial data is your property. Moniqo never sells or shares your personal financial information with third-party advertisers. All data is used exclusively to generate your spending analysis and reports.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">02</span>
              AI Processing
            </h2>
            <p className="text-muted leading-relaxed text-base">
              We use OpenAI's secure models to analyze your transactions. All data sent to AI models is anonymized and redacted to remove account numbers and sensitive identifiers, ensuring maximum privacy during the analysis phase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">03</span>
              Cookie Policy
            </h2>
            <p className="text-muted leading-relaxed text-base">
              We use only essential cookies to manage your session and security. No cross-site tracking or invasive analytics are deployed within the Moniqo platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">04</span>
              Right to Erasure
            </h2>
            <p className="text-muted leading-relaxed text-base">
              You maintain the right to delete your data and account at any time. Upon deletion, all financial statements and transaction records are purged from our primary databases within 24 hours.
            </p>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
