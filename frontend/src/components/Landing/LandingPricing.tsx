"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const plans = [
  {
    name: "Free",
    price: "0",
    desc: "Start your financial journey",
    features: [
      "1 statement upload / month",
      "Basic AI spending summary",
      "5 AI coach queries / month",
    ],
    button: "Get Started Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "149",
    desc: "For serious money managers",
    features: [
      "5 statement uploads / month",
      "Unlimited AI coach queries",
      "Advanced leak detection",
      "2 account sync",
      "Priority support",
    ],
    button: "Upgrade to Pro",
    featured: true,
  },
  {
    name: "Elite",
    price: "349",
    desc: "Total financial sanctuary",
    features: [
      "Unlimited statement uploads",
      "Unlimited AI coach queries",
      "Advanced leak detection",
      "Unlimited multi-account sync",
      "Tax planning insights",
      "Dedicated AI financial coach",
    ],
    button: "Go Elite",
    featured: false,
  },
];

export default function LandingPricing() {
  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">

      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-3 sm:mb-4 px-4">
          Simple, Transparent <span className="text-accent">Pricing</span>
        </h2>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto px-4">
          Choose the plan that fits your financial journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`card card-hover p-6 sm:p-8 md:p-10 flex flex-col relative ${
              plan.featured
                ? 'bg-primary text-white border-2 border-accent shadow-[0_0_30px_rgba(63,197,128,0.18)] md:scale-105 z-10'
                : 'bg-white'
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent text-primary font-bold text-xs rounded uppercase tracking-wider shadow-md whitespace-nowrap">
                Most Popular
              </span>
            )}

            <div className="mb-6 sm:mb-8 mt-2">
              <h3 className={`text-2xl sm:text-3xl font-bold mb-2 ${plan.featured ? 'text-accent' : 'text-primary'}`}>
                {plan.name}
              </h3>
              <p className={`text-xs sm:text-sm ${plan.featured ? 'text-gray-300' : 'text-muted'}`}>
                {plan.desc}
              </p>
            </div>

            <div className="mb-6 sm:mb-8 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold">&#8377;{plan.price}</span>
              <span className={`text-xs sm:text-sm ${plan.featured ? 'text-gray-300' : 'text-muted'}`}>
                / month
              </span>
            </div>

            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span
                    className="material-symbols-outlined text-base sm:text-lg text-accent"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className={plan.featured ? 'text-gray-100' : 'text-gray-700'}>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/pricing"
              className={`btn w-full text-center justify-center ${
                plan.featured
                  ? 'bg-accent text-primary hover:bg-white'
                  : 'btn-primary'
              }`}
            >
              {plan.button}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/pricing" className="text-sm font-semibold text-accent hover:underline underline-offset-4">
          View full pricing details &amp; yearly savings →
        </Link>
      </div>
    </section>
  );
}
