import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Search, MessageCircle, Video, Calendar, Trophy, Star, BookOpen, Target, Clock, TrendingUp, Zap, Crown, UserPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  isPrivate: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  nextSession: string;
  members: GroupMember[];
  achievements: string[];
  studyStreak: number;
  totalHours: number;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'moderator' | 'member';
  studyHours: number;
  joinDate: string;
  isOnline: boolean;
  level: number;
  badges: string[];
}

interface StudySession {
  id: string;
  groupId: string;
  title: string;
  description: string;
  startTime: string;
  duration: number;
  participantCount: number;
  maxParticipants: number;
  type: 'study' | 'discussion' | 'quiz' | 'project';
  subject: string;
  isLive: boolean;
}

export default function Groups() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Mock data for demonstration
  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'Quantum Physics Masters',
      subject: 'Physics',
      description: 'Advanced quantum mechanics study group for serious learners',
      memberCount: 12,
      maxMembers: 20,
      isPrivate: false,
      level: 'advanced',
      nextSession: '2025-05-25T10:00:00',
      studyStreak: 15,
      totalHours: 240,
      achievements: ['Study Streak Champion', 'Quiz Master', 'Collaboration Expert'],
      members: [
        {
          id: '1',
          name: 'Alice Chen',
          avatar: '👩‍🔬',
          role: 'owner',
          studyHours: 85,
          joinDate: '2025-01-15',
          isOnline: true,
          level: 28,
          badges: ['Leader', 'Expert', 'Mentor']
        },
        {
          id: '2',
          name: 'Bob Wilson',
          avatar: '👨‍🎓',
          role: 'moderator',
          studyHours: 72,
          joinDate: '2025-02-01',
          isOnline: false,
          level: 24,
          badges: ['Helper', 'Consistent']
        }
      ]
    },
    {
      id: '2',
      name: 'Calculus Study Circle',
      subject: 'Mathematics',
      description: 'Collaborative learning for calculus concepts and problem solving',
      memberCount: 8,
      maxMembers: 15,
      isPrivate: false,
      level: 'intermediate',
      nextSession: '2025-05-24T14:00:00',
      studyStreak: 8,
      totalHours: 156,
      achievements: ['Problem Solvers', 'Team Players'],
      members: [
        {
          id: '3',
          name: 'Emma Davis',
          avatar: '👩‍💻',
          role: 'owner',
          studyHours: 65,
          joinDate: '2025-02-10',
          isOnline: true,
          level: 22,
          badges: ['Organizer', 'Mathematical']
        }
      ]
    },
    {
      id: '3',
      name: 'History Enthusiasts',
      subject: 'History',
      description: 'Exploring world history through discussions and collaborative research',
      memberCount: 15,
      maxMembers: 25,
      isPrivate: false,
      level: 'beginner',
      nextSession: '2025-05-26T16:00:00',
      studyStreak: 12,
      totalHours: 180,
      achievements: ['Research Champions', 'Discussion Masters'],
      members: []
    }
  ]);

  const [liveSessions] = useState<StudySession[]>([
    {
      id: '1',
      groupId: '1',
      title: 'Quantum Entanglement Deep Dive',
      description: 'Exploring the mysteries of quantum entanglement',
      startTime: '2025-05-24T15:00:00',
      duration: 90,
      participantCount: 8,
      maxParticipants: 12,
      type: 'study',
      subject: 'Physics',
      isLive: true
    },
    {
      id: '2',
      groupId: '2',
      title: 'Integration Techniques Workshop',
      description: 'Mastering advanced integration methods',
      startTime: '2025-05-24T16:30:00',
      duration: 60,
      participantCount: 5,
      maxParticipants: 8,
      type: 'study',
      subject: 'Mathematics',
      isLive: false
    }
  ]);

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300';
      case 'intermediate': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-300';
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Physics': 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
      'Mathematics': 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
      'History': 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20',
      'Chemistry': 'border-l-purple-500 bg-purple-50 dark:bg-purple-950/20',
      'Biology': 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
    };
    return colors[subject as keyof typeof colors] || 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
  };

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0) return 'Started';
    if (diffHours === 0) return `in ${diffMins}min`;
    if (diffHours < 24) return `in ${diffHours}h ${diffMins}min`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Study Groups
            </h1>
            <p className="text-muted-foreground mt-2">
              Join collaborative learning communities and study together
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-primary to-chart-2">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
            <Button variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Friends
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search groups by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="groups" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="groups">Browse Groups</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Browse Groups */}
        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Groups List */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-4">
                {filteredGroups.map((group) => (
                  <Card 
                    key={group.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${getSubjectColor(group.subject)}`}
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{group.name}</h3>
                            <Badge className={getLevelColor(group.level)}>
                              {group.level}
                            </Badge>
                            {group.isPrivate && (
                              <Badge variant="secondary">Private</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {group.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{group.memberCount}/{group.maxMembers} members</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{group.totalHours}h studied</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              <span>{group.studyStreak} day streak</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2">
                            {group.subject}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Next: {formatSessionTime(group.nextSession)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {group.achievements.slice(0, 2).map((achievement, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Trophy className="w-3 h-3 mr-1" />
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                          <Button size="sm">
                            Join Group
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Groups */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Featured Groups
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
                    <h4 className="font-medium mb-1">AI Learning Circle</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Explore machine learning concepts together
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">24 members</span>
                      <Button size="sm" variant="outline">Join</Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                    <h4 className="font-medium mb-1">Chemistry Lab Partners</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Virtual lab experiments and discussions
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">18 members</span>
                      <Button size="sm" variant="outline">Join</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Group Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Subjects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {['Physics', 'Mathematics', 'Chemistry', 'Biology', 'History', 'Literature'].map((subject) => (
                    <div key={subject} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <span className="text-sm font-medium">{subject}</span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.floor(Math.random() * 20) + 5} groups
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Video className="w-4 h-4 mr-2" />
                    Start Video Session
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Study Time
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Find Study Partner
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* My Groups */}
        <TabsContent value="my-groups">
          <Card>
            <CardHeader>
              <CardTitle>Your Study Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Join your first study group to start collaborative learning
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Groups
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Sessions */}
        <TabsContent value="sessions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveSessions.map((session) => (
              <Card key={session.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{session.title}</span>
                    {session.isLive && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300">
                        🔴 Live
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {session.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Subject:</span>
                      <div className="font-medium">{session.subject}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <div className="font-medium">{session.duration} min</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Participants:</span>
                      <div className="font-medium">{session.participantCount}/{session.maxParticipants}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <div className="font-medium capitalize">{session.type}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {session.isLive ? (
                      <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600">
                        <Video className="w-4 h-4 mr-2" />
                        Join Live Session
                      </Button>
                    ) : (
                      <Button className="flex-1" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Set Reminder
                      </Button>
                    )}
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                Study Groups Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyGroups
                  .sort((a, b) => b.totalHours - a.totalHours)
                  .map((group, index) => (
                    <div key={group.id} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                      <div className="flex-1">
                        <h4 className="font-semibold">{group.name}</h4>
                        <p className="text-sm text-muted-foreground">{group.subject}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{group.totalHours}h</div>
                        <div className="text-sm text-muted-foreground">{group.memberCount} members</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}