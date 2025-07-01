import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rectangle';
  lines?: number;
  animated?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangle',
  lines = 1,
  animated = true
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg'
  };

  const skeletonElement = (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    />
  );

  const animatedElement = animated ? (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  ) : skeletonElement;

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className={index === lines - 1 ? 'w-3/4' : 'w-full'}>
            {animatedElement}
          </div>
        ))}
      </div>
    );
  }

  return animatedElement;
};

// Specialized skeleton components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonLoader variant="circle" className="w-12 h-12" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader variant="text" className="w-1/4" />
        <SkeletonLoader variant="text" className="w-1/2" />
      </div>
    </div>
    <SkeletonLoader variant="text" lines={3} />
  </div>
);

export const SkeletonTransactionList: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <SkeletonLoader variant="circle" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader variant="text" className="w-1/3" />
          <SkeletonLoader variant="text" className="w-1/2" />
        </div>
        <div className="text-right space-y-2">
          <SkeletonLoader variant="text" className="w-16" />
          <SkeletonLoader variant="text" className="w-12" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    {/* Balance Card Skeleton */}
    <SkeletonLoader className="h-32 w-full" />
    
    {/* Quick Actions Skeleton */}
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonLoader key={index} className="h-20 w-full" />
      ))}
    </div>
    
    {/* Content Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);