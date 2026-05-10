"use client";

export default function DeepAnalysisCard() {
  const points = [
    'Lifestyle Benchmarking',
    'Predictive Bill Forecasting',
    'Net Worth Trajectory'
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
            Venture beyond basic categorization. Understand the 'why' behind your capital flux with behavioral clustering.
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
          <div className="aspect-[4/3] bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Analysis Dashboard</span>
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
