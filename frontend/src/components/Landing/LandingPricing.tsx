"use client";

import Link from 'next/link';

export default function LandingPricing() {
  const plans = [
    {
      name: "Personal",
      price: "1,500",
      desc: "For individuals",
      features: [
        "AI Spending Insights",
        "Single Portfolio Sync",
        "Standard AI Coach"
      ],
      button: "Start Free",
      featured: false
    },
    {
      name: "Professional",
      price: "4,000",
      desc: "For power users",
      features: [
        "Unlimited Account Sync",
        "Advanced Tax Planning",
        "Priority AI Support",
        "Multi-Currency Support"
      ],
      button: "Go Pro",
      featured: true
    }
  ];

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-3 sm:mb-4 px-4">
          Simple, Transparent <span className="text-accent">Pricing</span>
        </h2>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto px-4">
          Choose the plan that fits your financial journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <div 
            key={i}
            className={`card card-hover p-6 sm:p-8 md:p-10 flex flex-col relative ${
              plan.featured 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white'
            }`}
          >
            {plan.featured && (
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 px-3 sm:px-4 py-1 bg-accent text-primary font-bold text-xs rounded-full">
                Popular
              </div>
            )}

            <div className="mb-6 sm:mb-8">
              <h3 className={`text-2xl sm:text-3xl font-bold mb-2 ${plan.featured ? 'text-accent' : 'text-primary'}`}>
                {plan.name}
              </h3>
              <p className={`text-xs sm:text-sm ${plan.featured ? 'text-gray-300' : 'text-muted'}`}>
                {plan.desc}
              </p>
            </div>

            <div className="mb-6 sm:mb-8 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold">₹{plan.price}</span>
              <span className={`text-xs sm:text-sm ${plan.featured ? 'text-gray-300' : 'text-muted'}`}>
                / month
              </span>
            </div>

            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className={`material-symbols-outlined text-base sm:text-lg ${plan.featured ? 'text-accent' : 'text-accent'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span className={plan.featured ? 'text-gray-100' : 'text-gray-700'}>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className={`btn w-full text-center justify-center ${
                plan.featured 
                  ? 'bg-accent text-primary hover:bg-white' 
                  : 'btn-primary'
              }`}
            >
              {plan.button}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
