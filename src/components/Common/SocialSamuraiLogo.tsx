import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SocialSamuraiLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textStyles = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
    >
      {/* Metallic & Purple Samurai 'S' Blade Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions[size]}`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-xl bg-[#9333EA]/30 blur-md group-hover:bg-[#A855F7]/50 transition-all duration-300" />
        
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic Silver-to-Purple Gradient */}
            <linearGradient id="blade-silver" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#D4D4D8" />
              <stop offset="70%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#581C87" />
            </linearGradient>

            {/* Neon Purple Energy Edge */}
            <linearGradient id="blade-purple" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Top Katana Blade Curve */}
          <path
            d="M 85,15 C 65,12 35,28 32,45 C 30,55 38,62 48,60 C 58,58 68,50 72,42 C 78,30 70,22 85,15 Z"
            fill="url(#blade-purple)"
          />

          {/* Main S Katana Body with Metallic Edge */}
          <path
            d="M 85,15 C 60,18 20,32 18,52 C 16,72 38,82 58,82 C 78,82 85,68 84,54 C 83,42 68,44 58,48 C 45,53 32,54 32,64 C 32,72 45,76 56,74 C 70,72 82,60 84,48 C 88,32 80,22 85,15 Z"
            fill="url(#blade-silver)"
          />

          {/* Lower Blade Slash Tail */}
          <path
            d="M 15,85 C 35,88 65,72 68,55 C 70,45 62,38 52,40 C 42,42 32,50 28,58 C 22,70 30,78 15,85 Z"
            fill="url(#blade-purple)"
          />

          {/* Central Katana Slit / Glint */}
          <path
            d="M 46,36 L 54,64 L 52,66 L 44,38 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Typography: "Social Samurai" with Oswald Heading styling */}
      {showText && (
        <div className="flex items-baseline tracking-tight font-heading">
          <span className={`font-bold text-white uppercase ${textStyles[size]}`}>
            Social
          </span>
          <span
            className={`font-extrabold uppercase bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#E9D5FF] bg-clip-text text-transparent ml-1.5 ${textStyles[size]} drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]`}
          >
            Samurai
          </span>
        </div>
      )}
    </div>
  );
};
