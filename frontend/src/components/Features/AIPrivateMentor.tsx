"use client";

export default function AIPrivateMentor() {
  return (
    <div className="card card-hover h-full p-6 md:p-8 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-8 h-full">
        <div className="flex flex-col">
          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_pin</span>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-accent uppercase tracking-wide">AI Money Coach</p>
            <h3 className="text-2xl md:text-4xl font-bold text-primary leading-tight">
              Ask questions against your own ledger.
            </h3>
            <p className="text-muted leading-relaxed text-base">
              Moniqo answers with your actual transaction history, report totals, and category context instead of generic budgeting advice.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5 flex flex-col gap-4">
          <div className="rounded-xl bg-white border border-outline-variant p-4 max-w-[82%]">
            <p className="text-sm font-semibold text-primary leading-relaxed">
              How much did I spend on Swiggy this month?
            </p>
          </div>

          <div className="rounded-xl bg-primary text-white p-4 sm:p-5 ml-auto max-w-[92%]">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-accent text-lg">chat_bubble</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Coach Insight</span>
            </div>
            <p className="text-sm sm:text-base font-bold leading-relaxed">
              You spent <span className="text-accent">₹4,860</span> across 13 food delivery transactions. Four orders happened after 10 PM.
            </p>
            <p className="text-xs text-white/60 leading-relaxed mt-3">
              Cutting only the late-night orders would save roughly ₹1,420 this month.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-auto">
            {['Vendor', 'Category', 'Time range'].map((item) => (
              <div key={item} className="rounded-lg bg-white border border-outline-variant px-3 py-2 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
