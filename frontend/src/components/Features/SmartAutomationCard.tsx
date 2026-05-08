"use client";

export default function SmartAutomationCard() {
  return (
    <div className="card card-hover flex flex-col items-start gap-6 h-full p-6 md:p-8">
      
      <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl md:text-3xl font-bold text-primary">Smart Automation</h3>
        <p className="text-muted leading-relaxed text-base">
          Wealth creation on autopilot. Set your intent, and let our autonomous agents handle the micro-flux.
        </p>
      </div>

      <div className="w-full mt-auto pt-6">
        <div className="w-full h-40 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Automation Dashboard</span>
        </div>
      </div>
    </div>
  );
}
