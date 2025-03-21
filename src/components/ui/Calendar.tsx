// src/components/ui/Calendar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { cn } from '@/lib/utils';

// Event type definition
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type?: string;
  amount?: number;
  isPaid?: boolean;
  category?: string;
  isRecurring?: boolean;
  metadata?: Record<string, any>;
}

// Calendar props
interface CalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onMonthChange?: (month: Date) => void;
  className?: string;
  highlightToday?: boolean;
  initialDate?: Date;
}

// Day object for calendar
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
}

// Calendar component
export function Calendar({
  events = [],
  onDateSelect,
  onEventClick,
  onMonthChange,
  className,
  highlightToday = true,
  initialDate,
}: CalendarProps) {
  // Current month view
  const [currentMonth, setCurrentMonth] = useState(initialDate || new Date());
  // Selected date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Animation direction
  const [direction, setDirection] = useState(0);

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date, events: CalendarEvent[]): CalendarEvent[] => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  // Generate calendar days for the current month view
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Add days from previous month
    const prevMonthDays = firstDayOfWeek;
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        events: getEventsForDate(date, events)
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        events: getEventsForDate(date, events)
      });
    }
    
    // Add days from next month until we have a complete calendar (6 rows = 42 days)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        events: getEventsForDate(date, events)
      });
    }
    
    return days;
  };

  // Handle month navigation
  const navigateMonth = (increment: number) => {
    setDirection(increment);
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1);
    setCurrentMonth(newDate);
    if (onMonthChange) {
      onMonthChange(newDate);
    }
  };

  // Handle date selection
  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    if (onDateSelect) {
      onDateSelect(day.date);
    }
  };

  // Handle event click
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Format month and year
  const formatMonthYear = (): string => {
    return currentMonth.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Days of week for header
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  // Generate calendar days
  const calendarDays = generateCalendarDays();

  // Update calendar days when events or current month changes
  useEffect(() => {
    // This effect will run when events or currentMonth change.
    // The generateCalendarDays function is called on every render,
    // so this useEffect is optional unless side effects are needed.
  }, [events, currentMonth]);

  // Animation variants for month transition
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0
    })
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth(-1)}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold">
          {formatMonthYear()}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth(1)}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day, index) => (
          <div
            key={day}
            className={cn(
              "text-center text-sm font-medium py-2",
              index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentMonth.toISOString()}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.3 }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarDays.map((day) => (
            <div
              key={day.date.toISOString()}
              className={cn(
                "min-h-24 p-1 border rounded-md transition-colors relative",
                day.isCurrentMonth
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600",
                day.isToday && highlightToday && "ring-2 ring-blue-400 dark:ring-blue-600",
                day.isSelected && "bg-blue-50 dark:bg-blue-900/20",
                "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "text-sm font-medium inline-block w-6 h-6 text-center leading-6 rounded-full",
                    day.isToday && highlightToday && "bg-blue-600 text-white"
                  )}
                >
                  {day.date.getDate()}
                </span>
              </div>
              {/* Event indicators */}
              {day.isCurrentMonth && day.events.length > 0 && (
                <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1">
                  {day.events.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(event, e)}
                      className="w-2 h-2 rounded-full bg-green-500 cursor-pointer"
                      title={event.title}
                    />
                  ))}
                  {day.events.length > 2 && (
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      +{day.events.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
