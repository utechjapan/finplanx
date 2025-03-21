// src/components/ui/Progress.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indicatorColor?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indicatorColor, ...props }, ref) => {
    // 値が0〜100の範囲内に収まるようにする
    const clampedValue = Math.min(Math.max(value, 0), max);
    const percentage = (clampedValue / max) * 100;
    
    return (
      <div
        ref={ref}
        className={cn(
          'h-2 w-full overflow-hidden rounded-full bg-gray-200',
          className
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clampedValue}
        {...props}
      >
        <div
          className="h-full transition-all"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: indicatorColor || '#3b82f6' // デフォルトはblue-500
          }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };