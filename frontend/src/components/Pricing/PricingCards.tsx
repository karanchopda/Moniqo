"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Feature {
  label: string;
  enabled: boolean;
}

interface Tier {
  name: string;
  desc: string;
  priceMonthly: number;
  priceYearly: number;
  badge: string | null;
  buttonText: string;
  highlight: boolean;
  features: Feature[];
}

const TIERS: Tier[] = [
  {
    name: 'Free',
    desc: 'Start your financial journey',
    priceMonthly: 0,
    priceYearly: 0,
    badge: null,
    buttonText: 'Get Started Free',
    highlight: false,
    features: [
      { label: '1 statement upload per month', enabled: true },
      { label: 'Basic AI spending summary', enabled: true },
      { label: '5 AI coach queries per month', enabled: true },
      { label: 'Basic spending categories', enabled: true },
      { label: 'Advanced leak detection', enabled: false },
      { label: 'Multi-account sync', enabled: false },
    ],
  },
  {
    name: 'Pro',
    desc: 'For serious money managers',
    priceMonthly: 149,
    priceYearly: 1490,
    badge: 'Most Popular',
    buttonText: 'Upgrade to Pro',
    highlight: true,
    features: [
      { label: '5 statement uploads per month', enabled: true },
      { label: 'Unlimited AI coach queries', enabled: true },
      { label: 'Advanced leak detection', enabled: true },
      { label: '2 account sync', enabled: true },
      { label: 'Priority support', enabled: true },
      { label: 'Tax planning insights', enabled: false },
    ],
  },
  {
    name: 'Elite',
    desc: 'Total financial sanctuary',
    priceMonthly: 349,
    priceYearly: 3490,
    badge: null,
    buttonText: 'Go Elite',
    highlight: false,
    features: [
      { label: 'Unlimited statement uploads', enabled: true },
      { label: 'Unlimited AI coach queries', enabled: true },
      { label: 'Advanced leak detection', enabled: true },
      { label: 'Unlimited multi-account sync', enabled: true },
      { label: 'Tax planning insights', enabled: true },
      { label: 'Dedicated AI financial coach', enabled: true },
    ],
  },
];

function FeatureRow({ feature, highlight }: { feature: Feature; highlight: boolean }) {
  return (
    <li className={`flex items-center gap-3 text-sm ${
      feature.enabled
        ? highlight ? 'text-white/90' : 'text-primary/80'
        : highlight ? 'text-white/25' : 'text-primary/25'
    }`}>
      <span
        className={`material-symbols-outlined flex-shrink-0 select-none ${
          feature.enabled
            ? 'text-accent'
            : highlight ? 'text-white/15' : 'text-primary/15'
        }`}
        style={{
          fontSize: '18px',
          fontVariationSettings: feature.enabled ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 300",
        }}
      >
        {feature.enabled ? 'check_circle' : 'cancel'}
      </span>
      <span className="font-medium leading-snug">{feature.label}</span>
    </li>
  );
}

export default function PricingCards() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-7xl mx-auto pt-4">

      {/* ── Billing Toggle ───────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 mb-16">

        {/* Save badge above the toggle */}
        <div className={`transition-all duration-300 ${isYearly ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
          <span className="inline-flex items-center gap-1.5 bg-accent/15 text-accent border border-accent/25 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded bg-accent animate-pulse inline-block" />
            2 months free with yearly billing
          </span>
        </div>

        {/* Toggle pill — equal-width buttons */}
        <div
          role="group"
          aria-label="Billing period"
          className="relative flex bg-primary/[0.06] border border-primary/10 rounded p-1"
        >
          {/* Sliding background */}
          <span
            aria-hidden="true"
            className="absolute inset-y-1 rounded bg-primary transition-all duration-300 shadow-sm"
            style={{
              left: isYearly ? '50%' : '4px',
              right: isYearly ? '4px' : '50%',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />

          <button
            id="toggle-monthly"
            type="button"
            aria-pressed={!isYearly}
            onClick={() => setIsYearly(false)}
            className="relative z-10 w-32 py-2.5 rounded text-sm font-semibold focus:outline-none cursor-pointer transition-colors duration-200"
            style={{ color: isYearly ? 'rgba(0,51,28,0.45)' : '#ffffff' }}
          >
            Monthly
          </button>

          <button
            id="toggle-yearly"
            type="button"
            aria-pressed={isYearly}
            onClick={() => setIsYearly(true)}
            className="relative z-10 w-32 py-2.5 rounded text-sm font-semibold focus:outline-none cursor-pointer transition-colors duration-200"
            style={{ color: isYearly ? '#ffffff' : 'rgba(0,51,28,0.45)' }}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* ── Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
        {TIERS.map((tier, i) => {
          const price = isYearly ? tier.priceYearly : tier.priceMonthly;
          const unit = isYearly ? '/yr' : '/mo';
          const subText =
            price === 0
              ? 'Forever free'
              : isYearly
              ? 'Billed once yearly'
              : 'Billed monthly';

          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={[
                'relative flex flex-col rounded border-2 transition-colors duration-300',
                tier.highlight
                  ? [
                      'bg-primary border-accent/60 z-10',
                      'shadow-[0_0_0_1px_rgba(63,197,128,0.15),0_8px_40px_rgba(0,51,28,0.35),0_0_60px_rgba(63,197,128,0.12)]',
                      'md:-translate-y-2',
                    ].join(' ')
                  : 'bg-white border-gray-100 shadow-sm hover:border-accent/20 hover:shadow-md',
              ].join(' ')}
            >
              {/* Most Popular badge */}
              {tier.badge && (
                <div className="absolute -top-px left-0 right-0 flex justify-center">
                  <span className="bg-accent text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-b shadow-sm">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className={`p-7 lg:p-9 flex flex-col flex-1 ${tier.badge ? 'pt-9' : ''}`}>

                {/* Plan header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className={`text-xl font-bold tracking-tight ${tier.highlight ? 'text-accent' : 'text-primary'}`}>
                      {tier.name}
                    </h3>
                  </div>
                  <p className={`text-sm font-medium ${tier.highlight ? 'text-white/50' : 'text-primary/45'}`}>
                    {tier.desc}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-7 pb-7 border-b border-dashed border-current/10" style={{ borderColor: tier.highlight ? 'rgba(255,255,255,0.1)' : 'rgba(0,51,28,0.08)' }}>
                  <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${tier.name}-${price}`}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className={`text-5xl font-extrabold tracking-tight tabular-nums ${tier.highlight ? 'text-white' : 'text-primary'}`}
                      >
                        &#8377;{price.toLocaleString('en-IN')}
                      </motion.span>
                    </AnimatePresence>
                    <span className={`text-sm font-semibold ml-0.5 ${tier.highlight ? 'text-white/40' : 'text-primary/30'}`}>
                      {unit}
                    </span>
                  </div>
                  <p className={`text-[11px] font-semibold uppercase tracking-widest mt-2 ${tier.highlight ? 'text-accent/70' : 'text-primary/35'}`}>
                    {subText}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3.5 flex-1 mb-8">
                  {tier.features.map((f) => (
                    <FeatureRow key={f.label} feature={f} highlight={tier.highlight} />
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/signup" className="block w-full">
                  <button
                    type="button"
                    className={[
                      'w-full py-3.5 rounded text-sm font-bold uppercase tracking-widest',
                      'transition-all duration-250 active:scale-[0.98] cursor-pointer focus:outline-none',
                      tier.highlight
                        ? 'bg-accent text-primary hover:bg-[#56d696] shadow-[0_4px_16px_rgba(63,197,128,0.35)]'
                        : 'bg-primary text-white hover:bg-primary/90 shadow-sm',
                    ].join(' ')}
                  >
                    {tier.buttonText}
                  </button>
                </Link>

              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
