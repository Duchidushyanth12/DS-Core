import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 40, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div style={{ width: size, height: size }} className="relative flex-shrink-0">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" /> {/* Deep Blue */}
              <stop offset="100%" stopColor="#9333ea" /> {/* Purple */}
            </linearGradient>
          </defs>
          
          {/* Mortarboard / Graduation Cap */}
          <path
            d="M100 20L40 50L100 80L160 50L100 20Z"
            fill="url(#logo-gradient)"
          />
          <path
            d="M60 65V90C60 90 80 105 100 105C120 105 140 90 140 90V65L100 85L60 65Z"
            fill="url(#logo-gradient)"
          />
          <path
            d="M150 55V95"
            stroke="url(#logo-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="150" cy="95" r="5" fill="url(#logo-gradient)" />

          {/* Open Book with DS */}
          <path
            d="M50 110C50 110 70 105 100 105C130 105 150 110 150 110V170C150 170 130 165 100 165C70 165 50 170 50 170V110Z"
            fill="white"
            stroke="url(#logo-gradient)"
            strokeWidth="4"
          />
          <line x1="100" y1="105" x2="100" y2="165" stroke="url(#logo-gradient)" strokeWidth="2" />
          
          {/* DS Text inside book */}
          <text
            x="75"
            y="145"
            fill="url(#logo-gradient)"
            fontSize="35"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
          >
            D
          </text>
          <text
            x="125"
            y="145"
            fill="url(#logo-gradient)"
            fontSize="35"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
          >
            S
          </text>

          {/* Circuit / Node lines */}
          <path
            d="M40 120H30V150H40"
            stroke="url(#logo-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="25" cy="120" r="4" fill="url(#logo-gradient)" />
          <circle cx="25" cy="150" r="4" fill="url(#logo-gradient)" />
          
          <path
            d="M160 120H170V150H160"
            stroke="url(#logo-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="175" cy="120" r="4" fill="url(#logo-gradient)" />
          <circle cx="175" cy="150" r="4" fill="url(#logo-gradient)" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-black leading-none bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DSC
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground leading-none mt-1">
            LMS PORTAL
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
