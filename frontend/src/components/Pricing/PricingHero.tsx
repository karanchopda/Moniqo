"use client";

import { motion } from 'framer-motion';

export default function PricingHero() {
  return (
    <section className="pt-32 pb-16 px-8 max-w-7xl mx-auto text-center border-b border-primary/5">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-headline font-bold text-primary tracking-tight leading-none mb-8"
      >
        Investing in your <br/>
        <span className="text-accent italic">financial freedom.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-primary/40 max-w-4xl mx-auto font-medium leading-relaxed"
      >
        Simple, transparent pricing. Choose the plan that <br/> 
        fits your journey toward wealth creation.
      </motion.p>
    </section>
  );
}
