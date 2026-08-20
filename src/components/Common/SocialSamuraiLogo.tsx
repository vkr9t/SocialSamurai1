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
  // Height presets for the full logo banner
  const logoHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  // Dimensions for icon-only mode
  const iconDimensions = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none cursor-pointer group transition-transform duration-200 active:scale-95 ${className}`}
    >
      {showText ? (
        /* Exact Full Logo Banner provided by user */
        <div className="relative flex items-center">
          <div className="absolute inset-0 bg-[#9333EA]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <img
            src="/social_samurai_logo.png"
            alt="Social Samurai"
            className={`${logoHeights[size]} w-auto object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]`}
          />
        </div>
      ) : (
        /* Exact S Mark Icon provided by user */
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[#9333EA]/30 blur-md group-hover:bg-[#A855F7]/50 transition-all duration-300 pointer-events-none" />
          <img
            src="/social_samurai_mark.png"
            alt="Social Samurai Mark"
            className={`${iconDimensions[size]} object-contain mix-blend-screen drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]`}
          />
        </div>
      )}
    </div>
  );
};
