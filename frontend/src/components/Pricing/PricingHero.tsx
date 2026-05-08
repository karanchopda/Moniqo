"use client";

import { motion } from 'framer-motion';

export default function PricingHero() {
  return (
    <section className="pt-56 pb-32 px-8 max-w-[1550px] mx-auto text-center border-b border-primary/5">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-[8rem] font-headline font-black text-primary tracking-tighter leading-[0.8] mb-12"
      >
        Investing in your <br/>
        <span className="text-accent italic">financial sanctuary.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl text-primary/40 max-w-4xl mx-auto font-medium leading-[1.4]"
      >
        Transparent nodes for absolute clarity. Choose the path that <br/> 
        fits your journey toward sovereign wealth.
      </motion.p>
    </section>
  );
}
