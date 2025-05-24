import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface WeeklyCalendarProps {
  events: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
}

export function WeeklyCalendar({ events, onEventClick }: WeeklyCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    return startOfWeek;
  });

  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 7; // Start from 7 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const getEventsForDateAndTime = (date: Date, timeSlot: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      if (event.date !== dateStr) return false;
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const slotHour = parseInt(timeSlot.split(':')[0]);
      return eventStartHour === slotHour;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-950/30';
      case 'medium': return 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/30';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-950/30';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-300';
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            {currentWeekStart.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          <div className="text-sm text-muted-foreground">
            {currentWeekStart.toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b">
            {/* Time column header */}
            <div className="p-3 bg-muted/50 border-r">
              <div className="text-xs font-medium text-muted-foreground">TIME</div>
            </div>
            
            {/* Day headers */}
            {weekDays.map((day, index) => (
              <div 
                key={index}
                className={`p-3 border-r last:border-r-0 text-center ${
                  isToday(day) ? 'bg-primary/10 border-primary/20' : 'bg-muted/50'
                }`}
              >
                <div className={`text-sm font-medium ${isToday(day) ? 'text-primary' : ''}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-xs ${isToday(day) ? 'text-primary' : 'text-muted-foreground'}`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="max-h-96 overflow-y-auto">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8 border-b last:border-b-0 min-h-16">
                {/* Time label */}
                <div className="p-2 border-r bg-muted/20 flex items-center">
                  <div className="text-xs font-medium text-muted-foreground">
                    {timeSlot}
                  </div>
                </div>
                
                {/* Day cells */}
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = getEventsForDateAndTime(day, timeSlot);
                  
                  return (
                    <div 
                      key={dayIndex}
                      className={`p-1 border-r last:border-r-0 min-h-16 ${
                        isToday(day) ? 'bg-primary/5' : ''
                      }`}
                    >
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 rounded-md border-l-2 cursor-pointer hover:shadow-sm transition-all duration-200 mb-1 ${getPriorityColor(event.priority)}`}
                          onClick={() => onEventClick(event)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-medium truncate">{event.title}</h4>
                              <p className="text-xs text-muted-foreground">{event.subject}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {event.startTime} - {event.endTime}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Badge className={`text-xs ${getDifficultyColor(event.difficulty)}`}>
                                {event.difficulty}
                              </Badge>
                              {!event.completed && (
                                <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                                  <Play className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
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
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary/50 rounded"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}