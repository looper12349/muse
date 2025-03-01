// components/common/Input.jsx
import React, { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  label,
  name,
  id,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  required = false,
  disabled = false,
  ...rest
}, ref) => {
  const inputId = id || name;
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-2 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none transition-colors
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          text-white placeholder-gray-400
        `}
        {...rest}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;