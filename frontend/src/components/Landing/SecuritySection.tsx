"use client";

export default function SecuritySection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="card p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-6 bg-accent/10 border border-accent/20 rounded-xl px-4 py-2">
              <span className="material-symbols-outlined text-accent text-sm">enhanced_encryption</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Bank-Grade Security</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
              Your Privacy is <span className="text-accent">Our Priority</span>
            </h2>
            
            <p className="text-lg text-muted mb-8 leading-relaxed">
              Your financial data is protected with industry-leading encryption. We never sell your data to third parties.
            </p>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-primary font-bold text-lg mb-2">256-Bit Encryption</h4>
                <p className="text-sm text-muted">Bank-grade security for all your data.</p>
              </div>
              <div>
                <h4 className="text-primary font-bold text-lg mb-2">Zero Access</h4>
                <p className="text-sm text-muted">Your data is private and secure.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-[120px] text-primary opacity-80">security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
