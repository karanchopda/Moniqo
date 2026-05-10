"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PricingCards() {
  const tiers = [
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
    <section className="px-8 pb-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-stretch pt-16">
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
            <div className="absolute top-0 right-20 -translate-y-1/2 bg-accent px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] text-primary shadow-2xl">
              Recommended Protocol
            </div>
          )}
          
          <div>
            <div className="mb-10">
              <h3 className={`text-4xl font-headline font-black mb-4 tracking-tighter ${tier.highlight ? 'text-white' : 'text-primary'}`}>{tier.name}</h3>
              <p className={`text-lg font-medium leading-relaxed ${tier.highlight ? 'text-white/60' : 'text-primary/40'}`}>{tier.desc}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-3">
                <span className={`text-8xl font-headline font-black tracking-tighter ${tier.highlight ? 'text-white' : 'text-primary'}`}>{tier.price}</span>
                {tier.unit && <span className={`text-2xl font-black ${tier.highlight ? 'text-white/40' : 'text-primary/20'}`}>{tier.unit}</span>}
              </div>
              <p className={`text-[10px] font-black tracking-[0.4em] mt-6 uppercase ${tier.highlight ? 'text-white/40' : 'text-primary/20'}`}>{tier.subPrice}</p>
            </div>

            <ul className="space-y-6 mb-10">
              {tier.features.map((feature, j) => (
                <li key={j} className={`flex items-center gap-5 ${feature.enabled ? (tier.highlight ? 'text-white' : 'text-primary') : (tier.highlight ? 'text-white/20' : 'text-primary/10')}`}>
                  <span className={`material-symbols-outlined text-2xl ${feature.enabled ? 'text-accent' : ''}`} style={{ fontVariationSettings: feature.enabled ? "'FILL' 1" : "'FILL' 0" }}>
                    {feature.enabled ? 'check_circle' : 'circle'}
                  </span>
                  <span className="text-sm font-black uppercase tracking-widest">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/signup" className="w-full">
            <button className={`w-full py-6 rounded-xl font-headline font-black text-xs uppercase tracking-[0.4em] transition-all transform active:scale-[0.98] ${
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
