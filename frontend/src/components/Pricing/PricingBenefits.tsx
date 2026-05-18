"use client";

import { motion } from 'framer-motion';

export default function PricingBenefits() {
  const benefits = [
    {
      title: 'Enterprise Grade Security',
      desc: 'Your data is encrypted with AES-256 and never sold to third parties. We use read-only access via certified account aggregators.',
      icon: 'security'
    },
    {
      title: 'Priority Support',
      desc: 'Pro members get access to 24/7 dedicated financial concierges for any sync issues or financial coaching needs.',
      icon: 'support_agent'
    }
  ];

  return (
    <section className="px-8 pb-16 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      {benefits.map((benefit, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 bg-primary/5 border border-primary/5 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-8 hover:border-accent/30 transition-all duration-700"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/5 flex-shrink-0 flex items-center justify-center text-primary border border-primary/10">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{benefit.icon}</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-2xl font-headline font-bold text-primary mb-3 tracking-tight">{benefit.title}</h4>
            <p className="text-lg text-primary/40 leading-relaxed font-medium">{benefit.desc}</p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
