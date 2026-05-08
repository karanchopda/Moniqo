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
      <div className={`${sizeClasses[size]} rounded-lg bg-accent/10 flex items-center justify-center relative overflow-hidden group`}>
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icon SVG */}
        <svg 
          className={`${sizeClasses[size]} relative z-10`}
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* M shape with chart */}
          <path 
            d="M4 22 L4 10 L10 16 L16 8 L22 16 L28 10 L28 22" 
            className="stroke-accent group-hover:stroke-white transition-colors duration-300"
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Accent dot */}
          <circle 
            cx="16" 
            cy="8" 
            r="2" 
            className="fill-accent group-hover:fill-white transition-colors duration-300"
          />
          {/* Base line */}
          <line 
            x1="4" 
            y1="25" 
            x2="28" 
            y2="25" 
            className="stroke-primary group-hover:stroke-white transition-colors duration-300"
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
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
