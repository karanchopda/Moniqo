"use client";
import Link from 'next/link';
import MoniqoLogo from '@/components/ui/MoniqoLogo';

export default function LandingFooter() {
  return (
    <footer className="relative z-10 w-full bg-primary text-white border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-10">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group hover:scale-105 transition-transform duration-300">
              <MoniqoLogo size="md" variant="full" className="text-white" />
            </Link>
            <p className="text-white/60 leading-relaxed mb-8 max-w-md font-medium">
              The personal wealth analyzer and tracker for modern professionals. Analyze your statement with AI to discover spending leaks and secure your path to wealth.
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/30">
              © 2026 MONIQO. ALL RIGHTS RESERVED.
            </p>
          </div>
 
          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent mb-6">Product Features</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/#arboretum" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Features & Pricing</Link>
              <Link href="/#pricing" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Plans & Access</Link>
              <Link href="/dashboard" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Dashboard</Link>
            </nav>
          </div>
 
          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent mb-6">Privacy & Security</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/privacy" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/contact" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Support</Link>
            </nav>
          </div>
        </div>
 
        {/* Social Links */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            SECURE. INTELLIGENT. SIMPLIFIED.
          </p>
          <div className="flex gap-8">
            <Link href="https://x.com/moniqoai" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/40 hover:text-accent transition-colors">Twitter</Link>
            <Link href="https://linkedin.com/company/moniqo" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/40 hover:text-accent transition-colors">LinkedIn</Link>
            <Link href="https://instagram.com/moniqoai" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/40 hover:text-accent transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
