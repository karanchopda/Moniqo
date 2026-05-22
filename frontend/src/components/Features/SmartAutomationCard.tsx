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
          Turn audit findings into simple rules: spending limits, bill reminders, and saving targets.
        </p>
      </div>

      <div className="w-full mt-auto pt-6">
        <div className="w-full bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
          {[
            { label: 'Food delivery cap', value: '₹5,000/mo', active: true },
            { label: 'Rent reminder', value: '1st of month', active: true },
            { label: 'Move surplus to SIP', value: '₹8,000', active: false },
          ].map(({ label, value, active }) => (
            <div key={label} className="flex items-center justify-between gap-3 rounded-lg bg-white border border-gray-100 px-3 py-3">
              <div>
                <p className="text-sm font-bold text-primary">{label}</p>
                <p className="text-xs text-muted mt-1">{value}</p>
              </div>
              <div className={`w-9 h-5 rounded-full p-0.5 ${active ? 'bg-accent' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-4' : ''}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
