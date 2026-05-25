"use client";

export default function FeaturesHero() {
  return (
    <section className="pt-32 sm:pt-36 md:pt-40 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-14 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded border border-accent/20 bg-accent/10 mb-6 sm:mb-8">
            <span className="w-2 h-2 rounded bg-accent"></span>
            <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide">Product Features</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8 leading-tight">
            See where your money goes, then fix what leaks.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Upload a bank statement and Moniqo turns messy transactions into a clear audit: categories, recurring spends, money leaks, and practical next steps.
          </p>
        </div>

        <div className="bg-white border border-outline-variant rounded shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant bg-surface-container-low">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary/50">Latest Audit</p>
              <h2 className="text-lg font-bold text-primary">May Statement</h2>
            </div>
            <div className="px-3 py-1.5 rounded bg-accent/10 text-accent text-xs font-bold uppercase tracking-wide">
              Processed
            </div>
          </div>

          <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ['External Spend', '₹48,920'],
              ['Daily Burn', '₹1,631'],
              ['Potential Saving', '₹8,400'],
            ].map(([label, value]) => (
              <div key={label} className="rounded border border-outline-variant bg-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-2">{label}</p>
                <p className="text-xl font-bold text-primary">{value}</p>
              </div>
            ))}
          </div>

          <div className="px-5 sm:px-6 pb-6 grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-4">
            <div className="rounded border border-outline-variant p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-primary">Top Categories</p>
                <span className="material-symbols-outlined text-accent text-xl">query_stats</span>
              </div>
              <div className="space-y-4">
                {[
                  ['Food Delivery', '78%'],
                  ['Shopping', '56%'],
                  ['Transport', '38%'],
                ].map(([label, width]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-semibold text-muted mb-2">
                      <span>{label}</span>
                      <span>{width}</span>
                    </div>
                    <div className="h-2 rounded bg-surface-container-high overflow-hidden">
                      <div className="h-full rounded bg-accent" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded bg-primary text-white p-4 flex flex-col justify-between gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">Leak Alert</p>
                <p className="text-xl font-bold leading-snug">₹6,780 in repeat convenience spends.</p>
              </div>
              <p className="text-sm text-white/65 leading-relaxed">
                18 small transactions created the largest preventable outflow this month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
