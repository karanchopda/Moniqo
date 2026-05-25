"use client";

export default function MoneyLeaksCard() {
  const leaks = [
    { name: 'Streaming Hub', amount: '₹899', icon: 'dvr' },
    { name: 'Pro Gym Pass', amount: '₹2,400', icon: 'fitness_center' }
  ];

  return (
    <div className="card card-hover flex flex-col items-start gap-6 h-full p-6 md:p-8">
      
      <div className="w-14 h-14 rounded bg-accent/10 flex items-center justify-center text-accent">
        <span className="material-symbols-outlined text-2xl">heart_broken</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl md:text-3xl font-bold text-primary">Leak Detection</h3>
        <p className="text-muted leading-relaxed text-base">
          Find repeat payments, subscription loops, and impulse spends before they become normal.
        </p>
      </div>

      <div className="w-full space-y-3 mt-auto">
        {leaks.map((leak, i) => (
          <div 
            key={i}
            className="bg-gray-50 p-4 rounded flex items-center justify-between border border-gray-100 transition-colors duration-200 hover:border-accent/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-white flex items-center justify-center border border-gray-100">
                <span className="material-symbols-outlined text-gray-600 text-lg">{leak.icon}</span>
              </div>
              <span className="text-sm font-semibold text-gray-700">{leak.name}</span>
            </div>
            <span className="text-sm font-bold text-accent">-{leak.amount}</span>
          </div>
        ))}
      </div>

      <div className="w-full rounded bg-accent/10 border border-accent/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary/50 mb-1">Monthly leakage</p>
        <p className="text-2xl font-bold text-primary">₹3,299</p>
      </div>
    </div>
  );
}
