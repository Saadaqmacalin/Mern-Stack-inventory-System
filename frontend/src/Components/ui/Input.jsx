import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  as = 'input', // input, select, textarea
  placeholder,
  value,
  onChange,
  error,
  className = '',
  disabled = false,
  required = false,
  children,
  ...props
}) => {
  const commonClasses = `block w-full px-4 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200
    ${error 
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500/20'
    }
    ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white'}
  `;

  const renderElement = () => {
    switch (as) {
      case 'select':
        return (
          <select
            id={id}
            className={commonClasses}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            {...props}
          >
            {children}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            id={id}
            className={`${commonClasses} min-h-[100px] resize-y`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            {...props}
          />
        );
      default:
        return (
          <input
            id={id}
            type={type}
            className={commonClasses}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5 ml-0.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderElement()}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
