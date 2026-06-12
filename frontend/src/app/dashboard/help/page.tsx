"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  ChevronDown,
  ChevronRight,
  LifeBuoy,
  Mail,
  MessageSquare,
  Receipt,
  Rocket,
  Search,
  Shield,
} from 'lucide-react';

// ─── FAQ content ─────────────────────────────────────────────────────────────
const FAQ_ITEMS: Record<string, { q: string; a: string | React.ReactNode }[]> = {
  'Getting Started': [
    {
      q: 'How do I upload my first bank statement?',
      a: 'Go to "Upload Statement" in the sidebar, then click "Upload Statement". You can upload a PDF or CSV from your bank. The AI will parse and categorize every transaction automatically.',
    },
    {
      q: 'Which file formats are supported?',
      a: 'PDF (including password-protected PDFs) and CSV. Most Indian bank exports work out of the box — HDFC, ICICI, SBI, Axis, Kotak.',
    },
    {
      q: 'How do I personalise transaction categories?',
      a: 'Open the Transactions page, click the ⋯ button on any row, and select Edit. You can update the category from the dropdown. Changes save immediately.',
    },
  ],
  'Account & Security': [
    {
      q: 'How do I reset my password?',
      a: (
        <>
          Click <Link href="/forgot-password" className="text-brand-green-text-alt font-black underline">Forgot password</Link> on the login page, enter your email, and follow the link in the email you receive.
        </>
      ),
    },
    {
      q: 'How do I update my name or email?',
      a: (
        <>
          Go to <Link href="/dashboard/settings" className="text-brand-green-text-alt font-black underline">Settings → My Profile</Link> and update your details. Changes are saved to the server instantly.
        </>
      ),
    },
    {
      q: 'Is my financial data encrypted?',
      a: 'Yes. All data is stored on Supabase (PostgreSQL) with encryption at rest. Files are stored in Supabase Storage with private access. Your bank credentials are never stored.',
    },
  ],
  'AI Coach': [
    {
      q: 'How do I get the best results from the AI Coach?',
      a: 'Ask specific questions: "How much did I spend on food last month?", "What are my biggest recurring expenses?", or "Give me a budget plan to save ₹5,000/month". The coach uses your real transaction data.',
    },
    {
      q: 'What if the AI Coach gives wrong answers?',
      a: 'The coach has a fallback engine if OpenAI is unavailable. For best results, make sure your OPENAI_API_KEY is set in the backend .env. Upload statements first so the coach has data to work with.',
    },
    {
      q: 'Can the AI Coach send me alerts?',
      a: (
        <>
          Yes — go to <Link href="/dashboard/settings?tab=notifications" className="text-brand-green-text-alt font-black underline">Settings → Notifications</Link> and enable "Spending Leak Alerts" or "AI Coach Smart Prompts". Email alerts require SMTP to be configured.
        </>
      ),
    },
  ],
  'Transactions': [
    {
      q: 'Why did my statement upload fail?',
      a: 'Common reasons: password-protected PDF (enter the password when prompted), unsupported format, or the file is corrupted. Try exporting a fresh CSV directly from your bank\'s net banking portal.',
    },
    {
      q: 'How do I edit or delete a transaction?',
      a: 'On the Transactions page, click the ⋯ button at the end of any row to open the action menu. Select Edit to change date, description, amount, type, or category. Select Delete to remove it permanently.',
    },
    {
      q: 'How do I export my transactions?',
      a: 'Click "Export CSV" or "Export PDF" at the top of the Transactions page. Both export your currently filtered transactions — CSV for spreadsheets, PDF for sharing or printing.',
    },
  ],
};

const categories = [
  { title: 'Getting Started',    desc: 'Set up your dashboard and import data.',          icon: Rocket,  highlight: false },
  { title: 'Account & Security', desc: 'Manage profile, password, and data privacy.',     icon: Shield,  highlight: false },
  { title: 'AI Coach',           desc: 'Prompts, alerts, and spending recommendations.',  icon: Brain,   highlight: true  },
  { title: 'Transactions',       desc: 'Sync, edit, filter, and export your ledger.',     icon: Receipt, highlight: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function HelpPage() {
  const [searchQuery, setSearchQuery]             = useState('');
  const [activeCategory, setActiveCategory]       = useState<string | null>(null);
  const [openFaq, setOpenFaq]                     = useState<string | null>(null);

  // Flat list for search
  const allFaqs = Object.entries(FAQ_ITEMS).flatMap(([cat, items]) =>
    items.map((item) => ({ ...item, cat }))
  );

  const searchResults = searchQuery.trim().length > 1
    ? allFaqs.filter((f) =>
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof f.a === 'string' && f.a.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : null;

  const displayFaqs = activeCategory ? FAQ_ITEMS[activeCategory] ?? [] : [];

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      <div className="mb-7">
        <h1 className="text-[28px] font-black tracking-[-0.01em] text-brand-dark">Help Center</h1>
        <p className="mt-1 text-sm font-medium text-brand-text-muted">Find answers for dashboard, sync, transactions, and AI Coach workflows.</p>
      </div>

      {/* Search banner */}
      <section className="rounded-md border border-brand-green-border bg-brand-bg-green p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-green-bg-light text-brand-green-text">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-black text-brand-dark">How can we help you today?</h2>
            <p className="mt-2 text-sm font-medium text-brand-text-muted">Search guides and common fixes for the Moniqo dashboard.</p>
          </div>
          <div className="rounded-md border border-brand-border-green-light bg-white p-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <Search className="ml-3 h-4 w-4 text-brand-text-muted shrink-0" />
              <input
                type="text"
                placeholder="Search articles, tutorials, and FAQ..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory(null); }}
                className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm font-semibold text-brand-dark outline-none placeholder:text-brand-muted"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="px-3 text-xs font-bold text-brand-text-muted hover:text-brand-red">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search results */}
      {searchResults !== null && (
        <section className="mt-6 rounded-md border border-brand-border-gray bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <p className="mb-4 text-sm font-bold text-brand-text-muted">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
          </p>
          {searchResults.length === 0 ? (
            <p className="text-sm font-semibold text-brand-text-muted py-4 text-center">No articles found. Try a different search term.</p>
          ) : (
            <div className="space-y-2">
              {searchResults.map((item) => {
                const key = `search-${item.q}`;
                return (
                  <div key={key} className="rounded-md border border-brand-border-light overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === key ? null : key)}
                      className="flex w-full items-center justify-between px-5 py-3.5 text-left"
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-brand-green-text-alt">{item.cat}</span>
                        <p className="mt-0.5 text-sm font-black text-brand-dark">{item.q}</p>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-brand-text-muted transition-transform shrink-0 ml-4 ${openFaq === key ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === key && (
                      <div className="border-t border-brand-border-light bg-brand-bg-light px-5 py-4 text-sm font-medium leading-6 text-brand-text-muted">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Category cards */}
      {!searchResults && (
        <>
          <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.title;
              return (
                <button
                  key={cat.title}
                  onClick={() => setActiveCategory(isActive ? null : cat.title)}
                  className={`rounded-md border p-6 text-left shadow-[0_8px_22px_rgba(15,23,42,0.03)] transition-all ${
                    isActive
                      ? 'border-primary bg-primary text-white shadow-[0_8px_24px_rgba(0,51,28,0.18)]'
                      : cat.highlight
                      ? 'border-brand-green-border bg-brand-bg-green hover:border-primary'
                      : 'border-brand-border-gray bg-white hover:border-primary'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-md ${isActive ? 'bg-white/15 text-white' : 'bg-brand-light text-brand-green-medium'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className={`mt-5 text-base font-black ${isActive ? 'text-white' : 'text-brand-dark'}`}>{cat.title}</h3>
                  <p className={`mt-2 text-sm font-medium leading-6 ${isActive ? 'text-white/75' : 'text-brand-text-muted'}`}>{cat.desc}</p>
                  <div className={`mt-3 flex items-center gap-1.5 text-xs font-black ${isActive ? 'text-brand-green-border' : 'text-brand-green-text-alt'}`}>
                    {isActive ? 'Hide articles' : 'View articles'}
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                  </div>
                </button>
              );
            })}
          </section>

          {/* Inline FAQ accordion for selected category */}
          {activeCategory && displayFaqs.length > 0 && (
            <section className="mt-4 rounded-md border border-brand-border-gray bg-white shadow-[0_8px_22px_rgba(15,23,42,0.03)] overflow-hidden">
              <div className="border-b border-brand-border-light px-6 py-4">
                <p className="text-xs font-black uppercase tracking-wide text-brand-green-text-alt">{activeCategory}</p>
                <h2 className="mt-1 text-base font-black text-brand-dark">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y divide-brand-border-light">
                {displayFaqs.map((item) => {
                  const key = `cat-${item.q}`;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => setOpenFaq(openFaq === key ? null : key)}
                        className="flex w-full items-center justify-between px-6 py-4 text-left"
                      >
                        <span className="text-sm font-black text-brand-dark pr-4">{item.q}</span>
                        <ChevronDown className={`h-4 w-4 text-brand-text-muted shrink-0 transition-transform ${openFaq === key ? 'rotate-180 text-primary' : ''}`} />
                      </button>
                      {openFaq === key && (
                        <div className="bg-brand-bg-light px-6 pb-5 pt-1 text-sm font-medium leading-6 text-brand-text-muted border-t border-brand-border-light">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Support contact */}
          <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              { title: 'Live Chat',      desc: 'Average response time: 2 mins', icon: MessageSquare },
              { title: 'Email Support',  desc: 'We reply within 24 hours',       icon: Mail          },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="grid grid-cols-[48px_1fr_auto] items-center gap-4 rounded-md border border-brand-border-gray bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-light text-brand-green-medium">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-brand-dark">{item.title}</p>
                    <p className="mt-0.5 text-xs font-semibold text-brand-text-muted">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-brand-text-muted" />
                </div>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}
