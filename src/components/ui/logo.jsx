
import React from 'react';

const Logo = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-[#6A00FF]"
      >
        <path 
          d="M16 2L2 9L16 16L30 9L16 2Z" 
          fill="currentColor"
          fillOpacity="0.8"
        />
        <path 
          d="M2 23L16 30L30 23" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M2 16L16 23L30 16" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="opacity-50"
        />
      </svg>
      <span className="font-bold text-lg tracking-tight text-white">
        AdsAutoPilot
      </span>
    </div>
  );
};

export default Logo;
