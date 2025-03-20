// src/components/ui/DatePicker.tsx
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = new Date(e.target.value);
      if (onChange && !isNaN(date.getTime())) {
        onChange(date);
      }
    };

    // フォーマットをYYYY-MM-DDに変換
    const formattedValue = value ? format(value, 'yyyy-MM-dd') : '';

    return (
      <input
        type="date"
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300',
          className
        )}
        value={formattedValue}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);
DatePicker.displayName = 'DatePicker';

export { DatePicker };