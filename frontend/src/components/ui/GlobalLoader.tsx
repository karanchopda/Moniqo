import AuthLeftPanel from '@/components/Auth/AuthLeftPanel';

function MoniqoPulse({ size = 48 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer pulse ring */}
      <span
        className="absolute inset-0 rounded-full bg-[#3fc580]/20 animate-ping"
        style={{ animationDuration: '1.6s' }}
      />
      {/* Middle ring */}
      <span className="absolute inset-[6px] rounded-full bg-[#3fc580]/10" />
      {/* Core dot */}
      <span
        className="relative rounded-full bg-[#3fc580]"
        style={{ width: size * 0.42, height: size * 0.42 }}
      />
    </div>
  );
}

/* Three animated dots (used inside buttons / inline contexts) */
function DotSpinner({ color = '#3fc580' }: { color?: string }) {
  return (
    <span className="flex items-center gap-[4px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-[6px] w-[6px] rounded-full animate-bounce"
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.12}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </span>
  );
}

interface LoaderProps {
  /** Visual label shown beneath the animation */
  label?: string;
}

/**
 * Full-page loader — matches the split-screen auth layout.
 * Use for: OAuth callback, verify-email, reset-password Suspense fallbacks.
 */
export function PageLoader({ label = 'Loading…' }: LoaderProps) {
  return (
    <div className="min-h-screen flex bg-white font-sans">
      <AuthLeftPanel />
      <main className="w-full lg:w-[52%] flex flex-col justify-center items-center gap-6 px-6">
        <MoniqoPulse size={56} />
        <div className="text-center">
          <p className="text-sm font-black text-[#121c2d] tracking-tight">{label}</p>
          <p className="mt-1 text-[11px] font-semibold text-[#8a98a4] tracking-wide font-mono uppercase">
            Moniqo
          </p>
        </div>
      </main>
    </div>
  );
}

/**
 * Section loader — centered inside a card / panel.
 * Use for: dashboard, transactions table, sync page.
 */
export function SectionLoader({ label = 'Fetching data…' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 w-full">
      <MoniqoPulse size={44} />
      <p className="text-xs font-black text-[#526176] tracking-wide uppercase font-mono">{label}</p>
    </div>
  );
}

/**
 * Table-row loader — spans all columns in a <tbody>.
 * Use for: transactions table, any data table.
 */
export function TableRowLoader({ colSpan = 6, label = 'Loading…' }: { colSpan?: number; label?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-7 py-14">
        <div className="flex flex-col items-center gap-3">
          <MoniqoPulse size={36} />
          <span className="text-xs font-black text-[#526176] tracking-wide uppercase font-mono">{label}</span>
        </div>
      </td>
    </tr>
  );
}

/**
 * Inline loader — tiny spinner + dots for button states.
 * Use for: submit buttons (Google OAuth, form submits).
 */
export function InlineLoader({ label, light = false }: { label?: string; light?: boolean }) {
  const dotColor = light ? '#ffffff' : '#3fc580';
  return (
    <span className="flex items-center gap-2">
      <DotSpinner color={dotColor} />
      {label && (
        <span className={`text-sm font-black ${light ? 'text-white' : 'text-[#121c2d]'}`}>{label}</span>
      )}
    </span>
  );
}

/**
 * Full-viewport overlay loader — semi-transparent dark curtain.
 * Use for: file upload processing, long async operations.
 */
export function OverlayLoader({ label = 'Processing…' }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[#031d12]/80 backdrop-blur-sm">
      <MoniqoPulse size={64} />
      <div className="text-center">
        <p className="text-base font-black text-white tracking-tight">{label}</p>
        <p className="mt-1 text-[11px] font-semibold text-[#3fc580]/80 tracking-[0.2em] font-mono uppercase">
          Please wait
        </p>
      </div>
    </div>
  );
}

/**
 * Dashboard corner toast indicator.
 * Use for: background data refresh on dashboard page.
 */
export function CornerLoader({ label = 'Refreshing…' }: LoaderProps) {
  return (
    <div className="fixed bottom-5 right-5 z-40 hidden lg:flex items-center gap-3 rounded-lg border border-[#3fc580]/30 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(9,61,39,0.08)]">
      <MoniqoPulse size={20} />
      <span className="text-xs font-black text-[#526176] tracking-wide">{label}</span>
    </div>
  );
}

/* Default export is SectionLoader for convenience */
export default SectionLoader;
