"use client";

export default function LandingFeatures() {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide">
                Our Approach
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-primary">
              More Than Just Numbers
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-muted leading-relaxed mb-8 sm:mb-10 md:mb-12 max-w-xl">
              We don't believe in spreadsheets that overwhelm you. We believe in <span className="text-primary font-bold">intelligent insights</span> that reveal the true trajectory of your wealth.
            </p>

            <div className="space-y-4 sm:space-y-6">
              {[
                { icon: 'psychology', title: 'Behavioral Analysis', desc: 'Understand your spending patterns through advanced AI analysis.' },
                { icon: 'auto_graph', title: 'Smart Forecasting', desc: 'Real-time projections that adjust as your goals evolve.' },
                { icon: 'content_paste_search', title: 'Personalized Insights', desc: 'Investment strategies tailored to your financial situation.' }
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent text-xl sm:text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-primary">{item.title}</h4>
                    <p className="text-sm sm:text-base text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Feature Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 auto-rows-fr">
            
            {/* Card 1: Global Sync */}
            <div className="card card-hover p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">language</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-primary">Global Sync</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted">Secure integration with 10,000+ banks worldwide.</p>
              </div>
            </div>

            {/* Card 2: Clean Design */}
            <div className="bg-primary rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-white text-xl sm:text-2xl">spa</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-white">Clean Design</h3>
                <p className="text-xs sm:text-sm md:text-base text-white/90">Simple interface for total clarity.</p>
              </div>
            </div>

            {/* Card 3: India Focus - Spans 2 columns */}
            <div className="card card-hover col-span-2 p-4 sm:p-6 md:p-8">
              <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3 sm:mb-4">
                <span className="text-[10px] sm:text-xs font-semibold text-accent uppercase tracking-wide">
                  India Focused
                </span>
              </div>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-primary">
                Built for Indian Users
              </h3>
              
              <p className="text-muted text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6">
                Seamlessly integrated with UPI, NetBanking, Mutual Funds, and Indian asset classes.
              </p>
              
              <div className="flex gap-2 sm:gap-3">
                {[ 'currency_rupee', 'show_chart', 'account_balance_wallet' ].map((icon, i) => (
                  <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent text-lg sm:text-xl">{icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
