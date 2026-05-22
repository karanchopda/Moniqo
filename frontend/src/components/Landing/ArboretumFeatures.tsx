"use client";

export default function ArboretumFeatures() {
  const features = [
    {
      title: "Forensic Statement Audit",
      desc: "Upload bank statements or UPI ledger exports. Our system parses and matches transactions, grouping fragmented merchant handles instantly.",
      icon: "manage_search"
    },
    {
      title: "Leak Detection",
      desc: "Pinpoint micro-transactions, subscription loops, and impulse lifestyle spending that quietly drain your wealth potential.",
      icon: "troubleshoot"
    },
    {
      title: "Strict AI Advisor",
      desc: "Receive blunt, data-driven audits pointing out structural waste and proposing direct high-yield SIP reinvestment plans.",
      icon: "psychology"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 md:px-8 max-w-7xl mx-auto" id="arboretum">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
            The Audit Suite
          </h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed">
            Plugging financial leaks requires more than standard spreadsheet budgeting. Moniqo analyzes your actual transaction behavior to protect your hard-earned capital.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, i) => (
          <div 
            key={i}
            className="card card-hover p-8 md:p-10 group"
          >
            <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-6 transition-colors duration-200 group-hover:bg-accent/20">
              <span className="material-symbols-outlined text-3xl text-accent">
                {feature.icon}
              </span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
              {feature.title}
            </h3>
            <p className="text-muted leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
