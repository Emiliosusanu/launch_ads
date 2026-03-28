
import React from 'react';

const Logo = ({ className }) => {
  const logoSrc = '/inteliads-logo.png';

  return (
    <div className={`flex items-center ${className || ''}`.trim()}>
      <img
        src={logoSrc}
        alt="Inteliads"
        className="h-8 w-auto"
        draggable={false}
      />
    </div>
  );
};

export default Logo;
