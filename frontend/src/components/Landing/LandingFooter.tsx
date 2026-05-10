"use client";

import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="w-full bg-primary text-white border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-10">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-primary">
                <span className="material-symbols-outlined text-2xl font-black">shield_with_heart</span>
              </div>
              <span className="text-2xl font-headline font-black tracking-tighter text-white">
                MONIQO
              </span>
            </Link>
            <p className="text-white/60 leading-relaxed mb-8 max-w-md font-medium">
              The elite financial sanctuary for high-potential professionals. Auditing your capital flows with neural intelligence to accelerate wealth creation.
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              © 2024 MONIQO PROTOCOLS. ALL RIGHTS RESERVED.
            </p>
          </div>
 
          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">Product Ecosystem</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/features" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Features & Intelligence</Link>
              <Link href="/pricing" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Elite Access & Pricing</Link>
              <Link href="/dashboard" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Private Dashboard</Link>
            </nav>
          </div>
 
          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">Security & Governance</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/privacy" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Privacy Protocol</Link>
              <Link href="/terms" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/contact" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Direct Support</Link>
            </nav>
          </div>
        </div>
 
        {/* Social Links */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            ENGINEERED FOR WEALTH ACCELERATION
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-sm font-bold text-white/40 hover:text-accent transition-colors">Twitter</Link>
            <Link href="#" className="text-sm font-bold text-white/40 hover:text-accent transition-colors">LinkedIn</Link>
            <Link href="#" className="text-sm font-bold text-white/40 hover:text-accent transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
