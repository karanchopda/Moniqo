"use client";

import Link from 'next/link';

export default function FeaturesCTA() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-primary rounded-3xl p-12 md:p-16 lg:p-20 text-center shadow-lg">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            <span className="text-xs font-semibold text-white uppercase tracking-wide">
              Get Started
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Take Control of <br />
            <span className="text-accent">Your Finances?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who are managing their wealth with clarity and confidence using Moniqo's intelligent financial tools.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <button className="btn bg-accent text-primary hover:bg-accent/90 border-0 shadow-md hover:shadow-lg">
                Create Free Account
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </Link>
            <Link href="/features">
              <button className="btn bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm">
                Explore Features
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
