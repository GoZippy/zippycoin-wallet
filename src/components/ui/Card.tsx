import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  const hoverClasses = hover ? 'hover:scale-105 hover:-translate-y-1 transition-transform duration-200' : '';

  return (
    <div
      className={`card ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};