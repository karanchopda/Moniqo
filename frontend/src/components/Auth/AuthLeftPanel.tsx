import Link from 'next/link';
import MoniqoLogo from '@/components/ui/MoniqoLogo';


export default function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[48%] bg-[#031d12] p-12 flex-col justify-between relative overflow-hidden text-white select-none min-h-screen">
      {/* Premium Ambient Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0"
        style={{ backgroundImage: "url('/assets/images/auth-bg.jpg')" }}
      />
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#031d12]/90 via-[#031d12]/60 to-[#031d12]/30 pointer-events-none z-0" />

      {/* Header with Moniqo Brand Logo */}
      <div className="relative z-10">
        <Link href="/" className="inline-block group">
          <MoniqoLogo size="md" white />
        </Link>
      </div>

      {/* Brand Message and Value Proposition */}
      <div className="my-auto py-12 relative z-10 max-w-lg">
        <h2 className="text-4xl xl:text-[46px] font-black leading-[1.15] tracking-tight text-white">
          Your AI-powered <br />
          <span className="text-[#3fc580]">financial sanctuary.</span>
        </h2>
        <p className="mt-6 text-white/70 text-sm xl:text-base leading-relaxed font-medium">
          Secure your legacy with precision-engineered asset management and
          real-time private banking insights designed for the modern wealth holder.
        </p>

      </div>

      {/* Footer Branding Monospace details */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white/50 text-[10px] font-mono tracking-widest uppercase">
        <span>© 2026 Moniqo Global Private Banking</span>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Security
          </Link>
        </div>
      </div>
    </div>
  );
}
