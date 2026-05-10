"use client";

import { motion } from 'framer-motion';

export default function PricingFAQ() {
  const faqs = [
    {
      q: 'Can I cancel my subscription anytime?',
      a: 'Yes, you can cancel your subscription at any point. Your Pro features will remain active until the end of your current billing period.'
    },
    {
      q: 'Is my financial data safe?',
      a: 'Moniqo uses read-only access through RBI-licensed Account Aggregators. We cannot move money or change any settings in your bank accounts.'
    },
    {
      q: 'Which banks do you support?',
      a: 'We support all major Indian private and public sector banks including HDFC, ICICI, SBI, and Axis through our secure integration partners.'
    }
  ];

  return (
    <section className="px-8 pb-16 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-headline font-black text-primary tracking-tighter">Protocol FAQ</h2>
      </div>
      
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-2xl bg-primary/5 border border-primary/5 hover:border-accent/30 transition-all duration-700 group cursor-default"
          >
            <h4 className="text-xl font-black text-primary mb-4 flex items-center gap-4">
              <span className="material-symbols-outlined text-accent text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
              {faq.q}
            </h4>
            <p className="text-lg text-primary/40 leading-relaxed font-medium">
              {faq.a}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
