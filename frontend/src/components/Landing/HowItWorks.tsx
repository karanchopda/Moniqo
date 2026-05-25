"use client";

const steps = [
  {
    title: "Secure Data Import",
    description: "Upload your transaction statement (PDF/CSV) with bank-grade 256-bit encryption. We never store your raw data.",
    icon: "upload_file"
  },
  {
    title: "AI Analysis",
    description: "Our proprietary AI models deconstruct every transaction, identifying hidden patterns and recurring wealth leaks.",
    icon: "analytics"
  },
  {
    title: "Optimize & Prosper",
    description: "Receive a bespoke optimization plan to plug leaks and reallocate capital into high-yield trajectories.",
    icon: "verified_user"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block text-accent font-semibold tracking-wider text-xs sm:text-sm uppercase mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-accent/10 border border-accent/20">
            The Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6 px-4">
            Architecting Your <br />
            Financial Legacy
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {steps.map((step, i) => (
            <div
              key={i}
              className="card card-hover p-6 sm:p-8 flex flex-col items-center text-center group bg-white"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded sm:rounded bg-accent/10 flex items-center justify-center mb-4 sm:mb-6 transition-colors duration-200 group-hover:bg-accent/20">
                <span className="material-symbols-outlined text-accent text-3xl sm:text-4xl">
                  {step.icon}
                </span>
                <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded bg-primary flex items-center justify-center text-xs font-bold text-accent">
                  {i + 1}
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
