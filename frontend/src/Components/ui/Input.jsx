import React, { isValidElement, cloneElement } from 'react';

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
  const { helperText, icon: Icon, ...restProps } = props;
  
  const commonClasses = `block w-full ${Icon ? 'pl-11 pr-4' : 'px-4'} py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200
    ${error 
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500/20'
    }
    ${disabled ? 'bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-60' : 'bg-white dark:bg-gray-800'}
  `;

  // ... (renderElement remains same, can be abbreviated if tools allow but I will replace the start)
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
            {...restProps}
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
            {...restProps}
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
            {...restProps}
          />
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-0.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isValidElement(Icon) ? (
                cloneElement(Icon, { className: `h-5 w-5 ${Icon.props.className || ''}` })
            ) : (
                <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
            )}
          </div>
        )}
        {renderElement()}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
