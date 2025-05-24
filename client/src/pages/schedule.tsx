import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Plus, Bot, Target, BookOpen, Users, Zap, TrendingUp, Star, CheckCircle2, AlertCircle, Play, Pause, MoreHorizontal, ArrowLeft, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { WeeklyCalendar } from '@/components/weekly-calendar';
import { useLocation } from 'wouter';

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
  actualDuration?: number;
}

interface StudyGoal {
  id: string;
  title: string;
  subject: string;
  targetHours: number;
  completedHours: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export default function Schedule() {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);

  // Mock data for demonstration
  const [scheduleEvents] = useState<ScheduleEvent[]>([
    {
      id: '1',
      title: 'Quantum Physics Fundamentals',
      subject: 'Physics',
      type: 'study',
      startTime: '09:00',
      endTime: '10:30',
      date: new Date().toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      aiGenerated: true,
      difficulty: 'hard',
      estimatedDuration: 90
    },
    {
      id: '2',
      title: 'Calculus Practice Problems',
      subject: 'Mathematics',
      type: 'practice',
      startTime: '11:00',
      endTime: '12:00',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
      completed: true,
      aiGenerated: true,
      difficulty: 'medium',
      estimatedDuration: 60,
      actualDuration: 55
    },
    {
      id: '3',
      title: 'History Review Session',
      subject: 'History',
      type: 'review',
      startTime: '14:00',
      endTime: '15:00',
      date: new Date().toISOString().split('T')[0],
      priority: 'low',
      completed: false,
      aiGenerated: false,
      difficulty: 'easy',
      estimatedDuration: 60
    }
  ]);

  const [studyGoals] = useState<StudyGoal[]>([
    {
      id: '1',
      title: 'Master Quantum Mechanics',
      subject: 'Physics',
      targetHours: 40,
      completedHours: 24,
      deadline: '2025-06-30',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Complete Calculus Course',
      subject: 'Mathematics',
      targetHours: 30,
      completedHours: 18,
      deadline: '2025-07-15',
      priority: 'medium'
    }
  ]);

  const getTypeIcon = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'practice': return <Target className="w-4 h-4" />;
      case 'review': return <TrendingUp className="w-4 h-4" />;
      case 'assessment': return <CheckCircle2 className="w-4 h-4" />;
      case 'break': return <Pause className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-950/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Monthly Calendar Component (inline)
  const MonthlyCalendar = ({ events, onEventClick, onDateClick }: {
    events: ScheduleEvent[];
    onEventClick: (event: ScheduleEvent) => void;
    onDateClick: (date: Date) => void;
  }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const navigateMonth = (direction: 'prev' | 'next') => {
      const newDate = new Date(currentMonth);
      newDate.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
      setCurrentMonth(newDate);
    };

    const isToday = (date: Date) => date.toDateString() === today.toDateString();
    const isSameMonth = (date: Date) => date.getMonth() === month && date.getFullYear() === year;

    const getEventsForDate = (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return events.filter(event => event.date === dateStr);
    };

    // Generate calendar days
    const calendarDays = [];
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;
    const daysFromNextMonth = totalCells - (daysInMonth + firstDayOfWeek);

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

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{monthNames[month]} {year}</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>‹</Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>Today</Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>›</Button>
          </div>
        </div>

        {/* Calendar */}
        <div className="border rounded-lg overflow-hidden">
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
                    <div className={`text-sm font-medium ${
                      isCurrentDay ? 'text-primary' : 
                      !isInCurrentMonth ? 'text-muted-foreground' : 'text-foreground'
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
                            event.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
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
                        <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
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
  };

  const todayEvents = scheduleEvents.filter(event => event.date === selectedDate);
  const upcomingEvents = scheduleEvents.filter(event => new Date(event.date) > new Date(selectedDate));

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                Study Schedule
              </h1>
              <p className="text-muted-foreground mt-2">
                AI-powered scheduling to optimize your learning journey
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              className="bg-gradient-to-r from-primary to-chart-2"
              onClick={async () => {
                setIsGeneratingSchedule(true);
                // Simulate AI schedule generation
                await new Promise(resolve => setTimeout(resolve, 2000));
                setIsGeneratingSchedule(false);
                // Here you would typically call your AI service
                alert('AI Schedule Generated! Check your calendar for new optimized study sessions.');
              }}
              disabled={isGeneratingSchedule}
            >
              {isGeneratingSchedule ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Generate Schedule
                </>
              )}
            </Button>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Study Time</p>
                  <p className="text-lg font-semibold">4.5 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-950/30 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Tasks</p>
                  <p className="text-lg font-semibold">8 / 12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/30 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Goal</p>
                  <p className="text-lg font-semibold">85% Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Study Streak</p>
                  <p className="text-lg font-semibold">12 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="today">Today's Schedule</TabsTrigger>
          <TabsTrigger value="week">Weekly View</TabsTrigger>
          <TabsTrigger value="month">Monthly View</TabsTrigger>
          <TabsTrigger value="goals">Study Goals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Today's Schedule */}
        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Schedule Timeline */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Today's Schedule</span>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-auto"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {todayEvents.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">No events scheduled for this day</p>
                          <Button variant="outline" className="mt-3">
                            <Bot className="w-4 h-4 mr-2" />
                            Generate AI Schedule
                          </Button>
                        </div>
                      ) : (
                        todayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-4 rounded-lg border-l-4 ${getPriorityColor(event.priority)} transition-all duration-200 hover:shadow-md`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="mt-1">
                                  {getTypeIcon(event.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold">{event.title}</h3>
                                    {event.aiGenerated && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Bot className="w-3 h-3 mr-1" />
                                        AI
                                      </Badge>
                                    )}
                                    <Badge className={getDifficultyColor(event.difficulty)}>
                                      {event.difficulty}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {event.subject} • {event.startTime} - {event.endTime}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>Est. {event.estimatedDuration}min</span>
                                    {event.actualDuration && (
                                      <span>• Actual: {event.actualDuration}min</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {event.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Button
                                    size="sm"
                                    variant={activeSession === event.id ? "destructive" : "default"}
                                    onClick={() => {
                                      if (activeSession === event.id) {
                                        setActiveSession(null);
                                      } else {
                                        setActiveSession(event.id);
                                        setSessionTime(0);
                                      }
                                    }}
                                  >
                                    {activeSession === event.id ? (
                                      <>
                                        <Pause className="w-4 h-4 mr-1" />
                                        Stop
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-4 h-4 mr-1" />
                                        Start
                                      </>
                                    )}
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Active Session Timer */}
              {activeSession && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Session</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold mb-2">
                        {formatTime(sessionTime)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {todayEvents.find(e => e.id === activeSession)?.title}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1">
                          Stop
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Optimal Study Time</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Based on your patterns, you're most productive at 9-11 AM and 2-4 PM
                    </p>
                  </div>
                  
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-700">
                    <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">Break Reminder</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Schedule a 15-min break after your Physics session
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-700">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">Subject Balance</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Add more History sessions to maintain subject balance
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.date} • {event.startTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Weekly View */}
        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Weekly Schedule Overview</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Previous Week
                  </Button>
                  <Button variant="outline" size="sm">
                    Next Week
                    <Calendar className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyCalendar events={scheduleEvents} onEventClick={(event) => console.log('Event clicked:', event)} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly View */}
        <TabsContent value="month">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Monthly Calendar Overview</span>
                <div className="flex items-center gap-2">
                  <Button>
                    <Bot className="w-4 h-4 mr-2" />
                    Generate Monthly Schedule
                  </Button>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyCalendar 
                events={scheduleEvents} 
                onEventClick={(event) => console.log('Event clicked:', event)}
                onDateClick={(date) => console.log('Date clicked:', date)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Goals */}
        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {studyGoals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{goal.title}</span>
                    <Badge variant="outline">{goal.subject}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{goal.completedHours}/{goal.targetHours} hours</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(goal.completedHours / goal.targetHours) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Deadline: {goal.deadline}</span>
                      <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
                        {goal.priority} priority
                      </Badge>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      <Target className="w-4 h-4 mr-2" />
                      Update Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Learning Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Study Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed insights into your learning patterns and progress
                </p>
                <Button>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}