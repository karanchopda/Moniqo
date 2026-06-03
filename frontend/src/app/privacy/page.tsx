import type { Metadata } from 'next';
import LandingNav from '@/components/Landing/LandingNav';
import LandingFooter from '@/components/Landing/LandingFooter';

export const metadata: Metadata = {
  title: "Privacy Policy | Moniqo Financial Sanctuary",
  description: "Read Moniqo's privacy policy detailing our compliance with India's DPDP Act 2023, data retention, OpenAI secure third-party processing, and user rights.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-body text-primary overflow-hidden">
      <LandingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-20 md:py-24 flex-1">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 tracking-tight leading-tight">
          Privacy <span className="text-accent italic">Policy</span>
        </h1>
        <p className="text-muted mb-10 text-base font-medium">Last updated: June 03, 2026</p>
        
        <div className="prose prose-lg max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">01</span>
              Compliance & Legal Framework
            </h2>
            <p className="text-muted leading-relaxed text-base">
              At Moniqo, we respect your privacy and are committed to protecting your personal data. This Privacy Policy governs your access to and use of Moniqo's financial services and tools. We comply with all applicable legal requirements, including the <strong>Information Technology Act, 2000</strong> and the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">02</span>
              Collection of Financial Data & Information
            </h2>
            <p className="text-muted leading-relaxed text-base">
              To provide our spending analysis and financial roadmaps, we collect the bank account statements (PDF/CSV) that you upload voluntarily. We also collect account credentials, including full names, email addresses, password hashes, and OAuth profile details. We do not store full bank account numbers, PINs, or raw bank credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">03</span>
              AI Data Processing & Third-Party Sharing (OpenAI)
            </h2>
            <p className="text-muted leading-relaxed text-base">
              We process your bank statement text utilizing OpenAI's secure models to parse, extract, and categorize transaction datasets. 
              <strong> Crucially:</strong>
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 mt-2 ml-4 text-base">
              <li>Before any data is transmitted to OpenAI, all transaction records are pre-processed to programmatically redact and strip out sensitive identifiers, including full name, physical addresses, and bank account numbers.</li>
              <li>Moniqo operates under a Data Processing Addendum (DPA) with OpenAI. OpenAI is strictly prohibited from utilizing customer datasets for training artificial intelligence models or improving their own services.</li>
              <li>No financial data is ever sold or shared with third-party advertisers or marketers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">04</span>
              Data Retention & Account Deletion
            </h2>
            <p className="text-muted leading-relaxed text-base">
              We store your uploaded statements and processed transaction history solely to populate your private dashboard and AI coach chat threads.
            </p>
            <p className="text-muted leading-relaxed text-base mt-2">
              If you request the deletion of your account, all transactional data, uploaded files, and personal credentials will be permanently purged from our primary production databases within <strong>24 hours</strong>. Backups will be securely overwritten and fully cleared within <strong>30 days</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">05</span>
              User Rights Under the DPDP Act, 2023
            </h2>
            <p className="text-muted leading-relaxed text-base">
              As a Data Principal under India's Digital Personal Data Protection Act, 2023, you hold specific statutory rights:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 mt-2 ml-4 text-base">
              <li><strong>Right to Summary:</strong> You have the right to request a summary of the personal data undergoing processing and a list of third parties with whom data has been shared.</li>
              <li><strong>Right to Correction & Erasure:</strong> You can request correction, completion, or erasure of outdated or inaccurate personal data.</li>
              <li><strong>Right to Redressal:</strong> You can withdraw your consent at any time and seek grievance redressal directly from our team.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-headline font-bold text-primary mb-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-accent text-sm font-semibold">06</span>
              Grievance Officer Details
            </h2>
            <p className="text-muted leading-relaxed text-base">
              In accordance with the DPDP Act, 2023, any privacy complaints, disputes, or requests regarding your data rights should be directed to our designated Grievance Officer:
            </p>
            <div className="mt-4 bg-[#f8faf9] border border-[#dce4e0] rounded-lg p-5 text-sm font-semibold text-primary space-y-1">
              <p><span className="text-[#526176]">Designation:</span> Grievance Officer, Moniqo Security & Compliance</p>
              <p><span className="text-[#526176]">Address:</span> Moniqo Global Private Banking, Bangalore, Karnataka, India</p>
              <p><span className="text-[#526176]">Email:</span> <a href="mailto:legal@moniqo.com" className="text-accent underline">legal@moniqo.com</a></p>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
