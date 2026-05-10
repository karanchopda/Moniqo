"use client";

export default function ArboretumFeatures() {
  const features = [
    {
      title: "Mind Maps",
      desc: "Navigate through financial noise with AI-generated visual patterns of your assets, liabilities, and potential trajectories.",
      icon: "query_stats"
    },
    {
      title: "Leak Detection",
      desc: "Identify biological and behavioral leaks in your spending and receive precision-targeted adjustments that compound.",
      icon: "tips_and_updates"
    },
    {
      title: "Smart Agents",
      desc: "Deploy intelligent agents to handle tedious rebalancing and tax-harvesting tasks autonomously.",
      icon: "rocket_launch"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 md:px-8 max-w-7xl mx-auto" id="arboretum">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
            The Arboretum
          </h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed">
            Cultivating wealth requires more than just numbers; it requires a tailored ecosystem of intelligent tools designed to grow with your unique financial journey.
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
