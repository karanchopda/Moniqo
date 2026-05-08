"use client";

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Equity Strategist",
    quote: "Moniqo identified a 15% leakage in my currency conversion strategy that I had missed for years.",
    avatar: "AS"
  },
  {
    name: "Priya Patel",
    role: "Tech Entrepreneur",
    quote: "The first financial tool that understands my long-term vision, not just my monthly spend.",
    avatar: "PP"
  },
  {
    name: "Vikram Malhotra",
    role: "Retired Architect",
    quote: "Mindful wealth management at its finest. I actually look forward to checking my dashboard every morning.",
    avatar: "VM"
  }
];

export default function TestimonialSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wide mb-3 sm:mb-4">
            Testimonials
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-3 sm:mb-4 px-4">
            Trusted by <span className="text-accent">Smart Users</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="card card-hover p-6 sm:p-8 bg-white"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-primary text-sm sm:text-base truncate">{t.name}</h4>
                  <p className="text-[10px] sm:text-xs font-semibold text-accent uppercase tracking-wide truncate">{t.role}</p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
