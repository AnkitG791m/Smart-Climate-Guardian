import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'solid' | 'glass';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'solid',
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-2xl transition-all duration-200',
        variant === 'solid'
          ? 'bg-white dark:bg-[#111c19] border border-slate-200/90 dark:border-emerald-950/80 shadow-sm'
          : 'bg-white/80 dark:bg-[#111c19]/80 backdrop-blur-md border border-slate-200/80 dark:border-emerald-900/40 shadow-eco-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
