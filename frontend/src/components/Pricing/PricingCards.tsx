"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PricingCards() {
  const tiers = [
    {
      name: 'Starter',
      desc: 'Try for free',
      price: '₹0',
      unit: '/ month',
      subPrice: 'FOREVER FREE FOR STARTERS',
      features: [
        { name: '1 Statement Upload per month', enabled: true },
        { name: 'Basic AI Spending Summary', enabled: true },
        { name: 'Limited AI Coach (5 queries)', enabled: true },
        { name: 'Advanced AI money leaks', enabled: false }
      ],
      buttonText: 'Get Started Free',
      highlight: false
    },
    {
      name: 'Personal',
      desc: 'Essential tools for individual tracking.',
      price: 'Free',
      subPrice: 'FOREVER FREE FOR STARTERS',
      features: [
        { name: 'Basic financial coach chat', enabled: true },
        { name: 'Secure bank statement parse', enabled: true },
        { name: 'Weekly spending audit', enabled: true },
        { name: 'Advanced AI money leaks', enabled: false }
      ],
      buttonText: 'Start for Free',
      highlight: false
    },
    {
      name: 'Pro',
      desc: 'The complete financial sanctuary experience.',
      price: '₹ 249',
      unit: '/ month',
      subPrice: 'BILLED MONTHLY',
      features: [
        { name: 'Priority 24/7 AI Coach access', enabled: true },
        { name: 'Unlimited bank connections', enabled: true },
        { name: 'Advanced leak detection engine', enabled: true },
        { name: 'Custom tagging & shared accounts', enabled: true }
      ],
      buttonText: 'Upgrade to Pro',
      highlight: true
    }
  ];

  return (
    <section className="px-8 pb-16 max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-stretch pt-16">
      {tiers.map((tier, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`p-8 md:p-12 rounded-2xl flex flex-col justify-between border-2 transition-all duration-700 relative group h-full ${
            tier.highlight 
              ? 'bg-primary border-primary shadow-3xl scale-105 z-10' 
              : 'bg-white border-primary/5 hover:border-accent/30'
          }`}
        >
          {tier.highlight && (
            <div className="absolute top-0 right-20 -translate-y-1/2 bg-accent px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-primary shadow-2xl">
              Recommended
            </div>
          )}
          
          <div>
            <div className="mb-10">
              <h3 className={`text-3xl font-headline font-bold mb-4 tracking-tight ${tier.highlight ? 'text-white' : 'text-primary'}`}>{tier.name}</h3>
              <p className={`text-base font-medium leading-relaxed ${tier.highlight ? 'text-white/60' : 'text-primary/40'}`}>{tier.desc}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-3">
                <span className={`text-6xl font-headline font-bold tracking-tight ${tier.highlight ? 'text-white' : 'text-primary'}`}>{tier.price}</span>
                {tier.unit && <span className={`text-xl font-semibold ${tier.highlight ? 'text-white/40' : 'text-primary/20'}`}>{tier.unit}</span>}
              </div>
              <p className={`text-xs font-semibold tracking-wider mt-4 uppercase ${tier.highlight ? 'text-white/40' : 'text-primary/20'}`}>{tier.subPrice}</p>
            </div>

            <ul className="space-y-4 mb-10">
              {tier.features.map((feature, j) => (
                <li key={j} className={`flex items-center gap-4 ${feature.enabled ? (tier.highlight ? 'text-white' : 'text-primary') : (tier.highlight ? 'text-white/20' : 'text-primary/10')}`}>
                  <span className={`material-symbols-outlined text-xl ${feature.enabled ? 'text-accent' : ''}`} style={{ fontVariationSettings: feature.enabled ? "'FILL' 1" : "'FILL' 0" }}>
                    {feature.enabled ? 'check_circle' : 'circle'}
                  </span>
                  <span className="text-sm font-medium tracking-normal normal-case">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/signup" className="w-full">
            <button className={`w-full py-4 rounded-xl font-headline font-semibold text-sm uppercase tracking-wider transition-all transform active:scale-[0.98] ${
              tier.highlight 
                ? 'bg-accent text-primary hover:bg-white' 
                : 'bg-primary text-white hover:bg-accent hover:text-primary'
            }`}>
              {tier.buttonText}
            </button>
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
