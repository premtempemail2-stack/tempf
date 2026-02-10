import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm',
        hover &&
          'cursor-pointer transition-all duration-300 hover:border-violet-500/50 hover:bg-white/10 hover:shadow-lg hover:shadow-violet-500/10',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border-b border-white/10 px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border-t border-white/10 px-6 py-4', className)}>
      {children}
    </div>
  );
}
