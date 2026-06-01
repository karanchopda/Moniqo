interface MoniqoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full';
  className?: string;
}

export default function MoniqoLogo({ size = 'md', variant = 'full', className = '' }: MoniqoLogoProps) {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-24'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} flex items-center justify-center relative overflow-hidden group`}>
        <img 
          src="/logo.png" 
          alt="Moniqo Logo" 
          className="h-full w-auto object-contain rounded hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
}
