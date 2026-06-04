"use client";

import { useState } from 'react';
import {
  ArrowRight,
  Brain,
  ChevronRight,
  LifeBuoy,
  Mail,
  MessageSquare,
  Receipt,
  Rocket,
  Search,
  Shield,
} from 'lucide-react';

const categories = [
  {
    title: 'Getting Started',
    desc: 'Set up your dashboard, import data, and understand the audit flow.',
    icon: Rocket,
    links: ['Initial setup guide', 'Importing your data', 'Personalizing categories'],
    highlight: false,
  },
  {
    title: 'Account & Security',
    desc: 'Manage profile settings, privacy permissions, and account access.',
    icon: Shield,
    links: ['Reset password', 'Managing devices', 'Data encryption info'],
    highlight: false,
  },
  {
    title: 'AI Coach',
    desc: 'Use prompts and recommendations to uncover spending patterns faster.',
    icon: Brain,
    links: ['Prompting the Coach', 'Smart alerts setup', 'Advanced forecasting'],
    highlight: true,
  },
  {
    title: 'Transactions',
    desc: 'Sync, categorize, filter, and export your transaction history.',
    icon: Receipt,
    links: ['Statement sync issues', 'Editing categories', 'Exporting reports'],
    highlight: false,
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="mx-auto w-full max-w-[1588px] px-4 py-7 sm:px-6 lg:px-11 lg:py-9">
      <div className="mb-7">
        <h1 className="text-[28px] font-black tracking-[-0.01em] text-brand-dark">Help Center</h1>
        <p className="mt-1 text-sm font-medium text-brand-text-muted">Find answers for dashboard, sync, transactions, and AI Coach workflows.</p>
      </div>

      <section className="rounded-md border border-brand-green-border bg-brand-bg-green p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <div className="flex h-13 w-13 items-center justify-center rounded-md bg-brand-green-bg-light text-brand-green-text">
              <LifeBuoy className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight text-brand-dark">How can we help you today?</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-brand-text-muted">
              Search guides and common fixes for the financial audit dashboard.
            </p>
          </div>

          <div className="rounded-md border border-brand-border-green-light bg-white p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <Search className="ml-3 h-5 w-5 text-brand-text-muted" />
              <input
                type="text"
                placeholder="Search articles, tutorials, and FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-semibold text-brand-dark outline-none placeholder:text-brand-muted"
              />
              <button className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-black text-white">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <div
              key={category.title}
              className={`rounded-md border p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)] ${
                category.highlight
                  ? 'border-primary bg-primary text-white'
                  : 'border-brand-border-gray bg-white text-brand-dark'
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-md ${
                category.highlight ? 'bg-white/10 text-brand-green-border' : 'bg-brand-light text-brand-green-medium'
              }`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-base font-black">{category.title}</h3>
              <p className={`mt-2 text-sm font-medium leading-6 ${category.highlight ? 'text-white/75' : 'text-brand-text-muted'}`}>
                {category.desc}
              </p>
              <div className="mt-5 space-y-2">
                {category.links.map((link) => (
                  <button
                    key={link}
                    className={`flex w-full items-center justify-between rounded-md py-1.5 text-left text-sm font-bold ${
                      category.highlight ? 'text-brand-green-border' : 'text-brand-green-text-alt'
                    }`}
                  >
                    {link}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_0.85fr]">
        <div className="rounded-md border border-brand-border-gray bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-brand-green-text-alt">Top Resources</p>
              <h2 className="mt-1 text-lg font-black text-brand-dark">Trending Tutorials</h2>
            </div>
            <button className="inline-flex items-center gap-2 text-sm font-black text-brand-green-text-alt">
              View all documentation
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3">
            {[
              'Mastering the audit dashboard',
              'Finding recurring subscription leaks',
              'Uploading clean PDF and CSV statements',
              'Using AI Coach for a monthly savings plan',
            ].map((item, index) => (
              <button
                key={item}
                className="grid grid-cols-[40px_1fr_auto] items-center gap-4 rounded-md border border-brand-border-light px-4 py-3 text-left"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-light text-brand-green-medium">
                  {index + 1}
                </span>
                <span className="text-sm font-black text-brand-dark">{item}</span>
                <ChevronRight className="h-5 w-5 text-brand-text-muted" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-brand-border-gray bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
          <h2 className="text-lg font-black text-brand-dark">Still need help?</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-brand-text-muted">
            Reach support or continue with the AI Coach from the existing dashboard routes.
          </p>
          <div className="mt-5 space-y-3">
            {[
              { title: 'Live Chat', desc: 'Average response time: 2 mins', icon: MessageSquare },
              { title: 'Email Support', desc: 'We reply within 24 hours', icon: Mail },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  className="grid w-full grid-cols-[42px_1fr_auto] items-center gap-3 rounded-md border border-brand-border-light px-4 py-3 text-left"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-light text-brand-green-medium">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-brand-dark">{item.title}</span>
                    <span className="mt-0.5 block text-xs font-semibold text-brand-text-muted">{item.desc}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-brand-text-muted" />
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
