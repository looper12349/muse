// components/common/Loader.jsx
import React from 'react';

const Loader = ({ size = 'md', color = 'blue', fullScreen = false, text = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  const colorClasses = {
    blue: 'border-blue-500',
    white: 'border-white',
    gray: 'border-gray-400'
  };
  
  const spinner = (
    <div className={`border-2 rounded-full ${sizeClasses[size]} border-t-transparent animate-spin ${colorClasses[color]}`}></div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        {spinner}
        {text && <p className="mt-4 text-white">{text}</p>}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      {spinner}
      {text && <p className="mt-2 text-sm text-gray-400">{text}</p>}
    </div>
  );
};

export default Loader;