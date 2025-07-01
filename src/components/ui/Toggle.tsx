import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: { switch: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { switch: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { switch: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div className="flex-1 mr-4">
          {label && (
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      
      <button
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`relative inline-flex items-center ${currentSize.switch} rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled 
            ? 'bg-blue-500' 
            : 'bg-gray-200 dark:bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        role="switch"
        aria-checked={enabled}
      >
        <motion.div
          className={`${currentSize.thumb} bg-white rounded-full shadow-lg transform transition-transform duration-200`}
          animate={{ x: enabled ? currentSize.translate.replace('translate-x-', '') : '2px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
};