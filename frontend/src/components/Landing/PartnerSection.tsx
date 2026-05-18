"use client";

export default function PartnerSection() {
  const partners = [
    { name: "HDFC Bank" },
    { name: "ICICI Bank" },
    { name: "SBI" },
    { name: "Zerodha" },
    { name: "Axis Bank" },
  ];

  return (
    <section className="py-10 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-center text-sm font-semibold text-muted uppercase tracking-wide mb-8">
          Integrated with Leading Financial Institutions
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-40">
          {partners.map((partner, i) => (
            <div
              key={i}
              className="text-2xl font-bold text-gray-400"
            >
              {partner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
