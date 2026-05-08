"use client";

import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
              </div>
              <span className="text-xl font-bold text-primary">
                MONIQO
              </span>
            </Link>
            <p className="text-muted leading-relaxed mb-6 max-w-md">
              Your AI-powered financial companion. Make smarter decisions with intelligent insights and personalized guidance.
            </p>
            <p className="text-sm text-muted">
              © 2024 Moniqo. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold text-primary mb-4">Product</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/#arboretum" className="text-sm text-muted hover:text-accent transition-colors">Features</Link>
              <Link href="/#pricing" className="text-sm text-muted hover:text-accent transition-colors">Pricing</Link>
              <Link href="/dashboard" className="text-sm text-muted hover:text-accent transition-colors">Dashboard</Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-primary mb-4">Legal</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/privacy" className="text-sm text-muted hover:text-accent transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-muted hover:text-accent transition-colors">Terms of Service</Link>
              <Link href="/contact" className="text-sm text-muted hover:text-accent transition-colors">Contact</Link>
            </nav>
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            Made with ❤️ for better financial decisions
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted hover:text-accent transition-colors">Twitter</Link>
            <Link href="#" className="text-sm text-muted hover:text-accent transition-colors">LinkedIn</Link>
            <Link href="#" className="text-sm text-muted hover:text-accent transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
