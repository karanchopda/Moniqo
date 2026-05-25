interface MoniqoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full';
  className?: string;
}

export default function MoniqoLogo({ size = 'md', variant = 'full', className = '' }: MoniqoLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} flex items-center justify-center relative overflow-hidden group`}>
        <img 
          src="/logo.png" 
          alt="Moniqo Logo" 
          className="w-full h-full object-contain rounded hover:scale-105 transition-transform duration-300 shadow-sm"
        />
      </div>

      {/* Logo Text */}
      {variant === 'full' && (
        <span className={`${textSizeClasses[size]} font-bold text-primary`}>
          MONIQO
        </span>
      )}
    </div>
  );
}
