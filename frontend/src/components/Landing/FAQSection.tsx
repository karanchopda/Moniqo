"use client";

import { useState } from 'react';

const faqs = [
  {
    question: "Is Moniqo an automated trader?",
    answer: "No. Moniqo is a financial analysis tool designed for audit and insights. While it provides AI-driven suggestions, you remain in full control of your financial decisions."
  },
  {
    question: "How secure is my financial data?",
    answer: "We use bank-grade encryption and security protocols. Your data is never sold to third parties and is used solely to provide you with personalized insights."
  },
  {
    question: "Can I integrate multiple accounts?",
    answer: "Yes. Moniqo supports integration with thousands of global financial institutions, providing a unified view of all your accounts."
  },
  {
    question: "What makes Moniqo different?",
    answer: "Moniqo focuses on long-term wealth building with AI-powered insights, not just transaction tracking. We help you understand patterns and make smarter financial decisions."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wide mb-3 sm:mb-4">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary px-4">
            Frequently Asked <span className="text-accent">Questions</span>
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-4 sm:p-6 flex items-center justify-between text-left group"
              >
                <span className={`text-sm sm:text-base md:text-lg font-bold transition-colors pr-4 ${openIndex === i ? 'text-accent' : 'text-primary group-hover:text-accent'}`}>
                  {faq.question}
                </span>
                <span className={`material-symbols-outlined text-xl sm:text-2xl transition-transform duration-200 flex-shrink-0 ${openIndex === i ? 'rotate-180 text-accent' : 'text-gray-400'}`}>
                  expand_more
                </span>
              </button>
              
              {openIndex === i && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
