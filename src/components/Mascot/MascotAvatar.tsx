import React from 'react';

interface MascotAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  statusDot?: boolean;
  className?: string;
}

const AVATAR_SIZES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  size = 'md',
  statusDot = true,
  className = '',
}) => {
  const sizeClass = AVATAR_SIZES[size];

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeClass} rounded-full overflow-hidden border-2 border-[#9333EA]/60 shadow-lg shadow-[#9333EA]/20 bg-[#080808] transition-transform hover:scale-105`}
      >
        <img
          src="/avatars/hunter.png"
          alt="SocialSamurai Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      {statusDot && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#9333EA] border-2 border-[#080808] rounded-full animate-pulse" />
      )}
    </div>
  );
};
