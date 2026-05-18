"use client";
import { motion } from 'framer-motion';

export default function AIPrivateMentor() {
  return (
    <div className="glass-card border border-primary/5 bg-white rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden group h-full hover:shadow-[0_0_50px_rgba(63,197,128,0.1)] transition-all duration-700">
      <div className="absolute top-0 left-0 w-2 h-full bg-accent rounded-l-2xl shadow-[0_0_20px_rgba(63,197,128,0.4)] group-hover:w-3 group-hover:shadow-[0_0_30px_rgba(63,197,128,0.6)] transition-all duration-500"></div>
      
      <div className="flex flex-col gap-8 relative z-10">
        <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center text-primary border border-accent/20 group-hover:scale-110 transition-transform duration-500">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_pin</span>
        </div>

        <div className="space-y-6">
          <div className="text-xs font-semibold text-accent uppercase bg-accent/10 px-4 py-1.5 rounded-xl inline-block border border-accent/20 tracking-wider hover:bg-accent/20 transition-colors cursor-default">
            AI Money Coach
          </div>
          <h3 className="text-3xl md:text-5xl font-headline font-bold text-primary leading-tight tracking-tight">
            A coach that <br />
            <span className="italic text-accent">actually knows</span> you.
          </h3>
          <p className="text-lg text-primary/60 leading-relaxed max-w-xl font-medium">
            Moniqo analyzes your spending patterns to offer personalized, actionable advice. It doesn't just show charts; it suggests meaningful adjustments to save more.
          </p>
        </div>

        {/* Coach Insight Floating Pill */}
        <motion.div 
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="absolute -bottom-10 -right-10 md:right-10 md:bottom-20 bg-primary/95 backdrop-blur-2xl p-8 rounded-xl shadow-3xl border border-white/10 max-w-xs z-20 cursor-default"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-accent text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Coach Insight</span>
          </div>
          <p className="font-headline font-bold text-white leading-tight mb-3 text-lg">
            "You reclaimed ₹32,000 this month."
          </p>
          <p className="text-xs text-white/60 leading-relaxed font-medium">
            That's a 22% optimization. Moniqo recommends directing this surplus into your investments.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
