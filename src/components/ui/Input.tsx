import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'block w-full border-2 rounded-lg shadow-soft transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-white';
  
  const sizeClasses = {
    sm: 'px-md py-sm text-sm min-h-[36px]',
    md: 'px-lg py-md text-base min-h-[44px]',
    lg: 'px-xl py-lg text-lg min-h-[52px]'
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const getInputStyles = () => {
  //   const baseStyles = {
  //     borderColor: error ? 'var(--error-300)' : 'var(--gray-200)',
  //     boxShadow: 'var(--shadow-soft)',
  //   };

  //   return {
  //     ...baseStyles,
  //     ':focus': {
  //       borderColor: error ? 'var(--error-400)' : 'var(--primary-900)',
  //       boxShadow: error ? 'var(--shadow-error)' : 'var(--shadow-primary)',
  //     },
  //     ':hover': {
  //       borderColor: 'var(--gray-300)',
  //     }
  //   };
  // };
  
  const inputClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;
  
  return (
    <div className="space-y-sm">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-secondary-700 mb-xs"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={inputClasses}
          style={{
            borderColor: error ? 'var(--error-300)' : 'var(--gray-200)',
            boxShadow: 'var(--shadow-soft)',
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = error ? 'var(--error-400)' : 'var(--primary-900)';
            (e.target as HTMLInputElement).style.boxShadow = error ? 'var(--shadow-error)' : 'var(--shadow-primary)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = error ? 'var(--error-300)' : 'var(--gray-200)';
            (e.target as HTMLInputElement).style.boxShadow = 'var(--shadow-soft)';
          }}
          onMouseEnter={(e) => {
            if (document.activeElement !== e.target) {
              (e.target as HTMLInputElement).style.borderColor = 'var(--gray-300)';
            }
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.target) {
              (e.target as HTMLInputElement).style.borderColor = error ? 'var(--error-300)' : 'var(--gray-200)';
            }
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error-600 mt-xs">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-secondary-500 mt-xs">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input; 