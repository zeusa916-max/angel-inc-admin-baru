'use client';

interface BrandLogoProps {
  dark?: boolean;
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function BrandLogo({
  dark = false,
  className = '',
  showSubtitle = false,
  size = 'md',
}: BrandLogoProps) {
  // Size mapping for flexible usage
  const sizeClasses = {
    sm: 'w-32',
    md: 'w-44',
    lg: 'w-64',
    xl: 'w-80 sm:w-96',
  };

  const activeSize = className ? className : sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${activeSize}`}>
      {/* SVG Vector Logo matching ANGEL INC. Emblem */}
      <svg
        viewBox="0 0 400 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-auto drop-shadow-sm transition-all duration-300 ${
          dark ? 'text-white' : 'text-neutral-900'
        }`}
      >
        {/* Emblem Wing Monogram (Left & Right Wings + Central Column) */}
        <g fill="currentColor">
          {/* Central Column Serif Top */}
          <path d="M185 75 H215 V79 H205 V115 H215 V119 H185 V115 H195 V79 H185 Z" />
          
          {/* Left Wing (Angled Chevron) */}
          <path d="M152 113 L180 73 H192 L164 113 Z" />
          <path d="M165 113 L186 83 H196 L175 113 Z" />
          
          {/* Right Wing (Angled Chevron) */}
          <path d="M248 113 L220 73 H208 L236 113 Z" />
          <path d="M235 113 L214 83 H204 L225 113 Z" />
        </g>

        {/* Brand Text: ANGEL INC. */}
        <text
          x="200"
          y="152"
          textAnchor="middle"
          fill="currentColor"
          style={{
            fontFamily: "var(--font-display), 'Cinzel', 'Playfair Display', serif",
            fontWeight: 800,
            fontSize: '32px',
            letterSpacing: '0.18em',
          }}
        >
          ANGEL INC.
        </text>

        {/* Subtitle Text: MADE IN PARADISE */}
        <text
          x="200"
          y="178"
          textAnchor="middle"
          fill="currentColor"
          style={{
            fontFamily: "var(--font-sans), 'Inter', sans-serif",
            fontWeight: 600,
            fontSize: '12px',
            letterSpacing: '0.36em',
            opacity: dark ? 0.75 : 0.65,
          }}
        >
          MADE IN PARADISE
        </text>
      </svg>

      {showSubtitle && (
        <div
          className={`mt-2 text-[10px] font-bold tracking-[0.3em] uppercase ${
            dark ? 'text-amber-300' : 'text-neutral-600'
          }`}
        >
          Admin Portal
        </div>
      )}
    </div>
  );
}
