"use client";

export default function DeepAnalysisCard() {
  const points = [
    'Category and merchant clustering',
    'Monthly burn-rate projection',
    'Actionable savings recommendations'
  ];

  return (
    <div className="card card-hover flex flex-col md:flex-row gap-8 md:gap-12 items-center h-full p-6 md:p-8">
      
      {/* Content Section */}
      <div className="flex-1 space-y-6 order-2 md:order-1">
        <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <span className="material-symbols-outlined text-2xl">analytics</span>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-3xl md:text-4xl font-bold text-primary">Deep Audit</h3>
          <p className="text-muted text-base leading-relaxed">
            Go beyond basic categories. Moniqo groups messy merchant names, separates transfers from real expenses, and explains the biggest changes.
          </p>
        </div>

        <ul className="space-y-3 pt-2">
          {points.map((point, i) => (
            <li 
              key={i}
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <span className="material-symbols-outlined text-accent text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Visual Section */}
      <div className="flex-1 relative order-1 md:order-2 w-full">
        <div className="relative">
          <div className="aspect-[4/3] bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-bold text-primary">Spending Mix</p>
                <span className="text-xs font-semibold text-accent">May</span>
              </div>
              <div className="space-y-4">
                {[
                  ['Essentials', '64%'],
                  ['Lifestyle', '48%'],
                  ['Transfers', '32%'],
                ].map(([label, width]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-semibold text-muted mb-2">
                      <span>{label}</span>
                      <span>{width}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white border border-gray-100 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Transactions</p>
                <p className="text-lg font-bold text-primary mt-1">182</p>
              </div>
              <div className="rounded-lg bg-white border border-gray-100 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Confidence</p>
                <p className="text-lg font-bold text-primary mt-1">94%</p>
              </div>
            </div>
          </div>
          
          {/* Info Badge */}
          <div className="absolute -bottom-4 -right-4 md:right-6 md:bottom-6 bg-primary p-5 rounded-xl shadow-lg max-w-[180px]">
            <span className="text-xs font-bold text-accent uppercase tracking-wide block mb-2">Audit Alert</span>
            <p className="text-sm font-semibold text-white leading-snug">
              Savings velocity is <span className="text-accent">12% above</span> benchmark.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
