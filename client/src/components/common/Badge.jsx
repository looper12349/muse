// components/common/Badge.jsx
import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-gray-800 text-gray-300',
    primary: 'bg-blue-900 text-blue-300',
    success: 'bg-green-900 text-green-300',
    warning: 'bg-yellow-900 text-yellow-300',
    danger: 'bg-red-900 text-red-300',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5',
  };
  
  const classes = `
    inline-flex items-center font-medium rounded-full
    ${variantClasses[variant] || variantClasses.default}
    ${sizeClasses[size] || sizeClasses.md}
    ${className}
  `;
  
  return <span className={classes}>{children}</span>;
};

export default Badge;