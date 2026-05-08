"use client";

export default function ComparisonSection() {
  const comparison = [
    { label: "Speed", traditional: "3-5 Business Days", moniqo: "Instant Analysis" },
    { label: "Insights", traditional: "Manual Review", moniqo: "AI-Powered Patterns" },
    { label: "Guidance", traditional: "Static Reports", moniqo: "Proactive Recommendations" },
    { label: "Privacy", traditional: "Shared with Advisors", moniqo: "Encrypted & Private" },
    { label: "Cost", traditional: "High Advisory Fees", moniqo: "Affordable Subscription" },
  ];

  return (
    <section className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
            Why Choose <span className="text-accent">Moniqo</span>
          </h2>
          <p className="text-lg text-muted">
            Modern AI-powered insights vs traditional methods
          </p>
        </div>

        <div className="card overflow-hidden max-w-5xl mx-auto">
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
            <div className="p-4 text-sm font-semibold text-muted"></div>
            <div className="p-4 text-sm font-semibold text-muted">Traditional</div>
            <div className="p-4 text-sm font-semibold text-accent">Moniqo</div>
          </div>

          {comparison.map((item, i) => (
            <div 
              key={i}
              className="grid grid-cols-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <div className="p-4 text-sm font-semibold text-gray-700">{item.label}</div>
              <div className="p-4 text-sm text-muted">{item.traditional}</div>
              <div className="p-4 text-sm font-semibold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                {item.moniqo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
