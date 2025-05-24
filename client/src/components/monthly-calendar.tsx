import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';

interface ScheduleEvent {
  id: string;
  title: string;
  subject: string;
  type: 'study' | 'practice' | 'review' | 'assessment' | 'break';
  startTime: string;
  endTime: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  aiGenerated: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: number;
}

interface MonthlyCalendarProps {
  events: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
  onDateClick: (date: Date) => void;
}

export function MonthlyCalendar({ events, onEventClick, onDateClick }: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of the month and calculate calendar grid
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Calculate days to show from previous month
  const daysFromPrevMonth = firstDayOfWeek;
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  // Calculate total cells needed
  const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;
  const daysFromNextMonth = totalCells - (daysInMonth + firstDayOfWeek);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newDate);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date) => {
    return date.getMonth() === month && date.getFullYear() === year;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Generate calendar days
  const calendarDays = [];

  // Previous month days
  for (let i = daysFromPrevMonth; i > 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i + 1);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({ date, isCurrentMonth: true });
  }

  // Next month days
  for (let day = 1; day <= daysFromNextMonth; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold">
            {monthNames[month]} {year}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-0">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b">
            {dayNames.map((day) => (
              <div key={day} className="p-3 text-center bg-muted/50 border-r last:border-r-0">
                <div className="text-sm font-medium text-muted-foreground">{day}</div>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((dayData, index) => {
              const dayEvents = getEventsForDate(dayData.date);
              const isCurrentDay = isToday(dayData.date);
              const isInCurrentMonth = isSameMonth(dayData.date);

              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-muted/30 transition-colors ${
                    isCurrentDay ? 'bg-primary/10 border-primary/20' : ''
                  } ${!isInCurrentMonth ? 'bg-muted/20' : ''}`}
                  onClick={() => onDateClick(dayData.date)}
                >
                  <div className="space-y-1">
                    {/* Day number */}
                    <div className={`text-sm font-medium ${
                      isCurrentDay ? 'text-primary' : 
                      !isInCurrentMonth ? 'text-muted-foreground' : 
                      'text-foreground'
                    }`}>
                      {dayData.date.getDate()}
                    </div>

                    {/* Events */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity ${
                            event.priority === 'high' ? 'bg-red-500' :
                            event.priority === 'medium' ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Event indicators for mobile */}
                    {dayEvents.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {dayEvents.slice(0, 5).map((event, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(event.priority)}`}
                          />
                        ))}
                        {dayEvents.length > 5 && (
                          <div className="text-xs text-muted-foreground">...</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend and Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Low Priority</span>
          </div>
        </div>
        
        <div className="text-muted-foreground">
          {events.filter(e => {
            const eventDate = new Date(e.date);
            return eventDate.getMonth() === month && eventDate.getFullYear() === year;
          }).length} events this month
        </div>
      </div>
    </div>
  );
}