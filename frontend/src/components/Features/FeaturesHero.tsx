"use client";

export default function FeaturesHero() {
  return (
    <section className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto text-center md:text-left">
      
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-accent/20 bg-accent/10 mb-6 sm:mb-8">
        <span className="w-2 h-2 rounded-xl bg-accent"></span>
        <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide">Editorial Protocol Active</span>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
        Master your capital with <br/>
        <span className="text-accent">unrivaled clarity</span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted max-w-3xl leading-relaxed px-4 sm:px-0">
        Moniqo transforms raw complexity into a bespoke journey. <br className="hidden sm:block"/>
        Less noise, absolute sanctuary.
      </p>
    </section>
  );
}
