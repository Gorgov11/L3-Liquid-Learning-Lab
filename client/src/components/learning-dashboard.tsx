import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  Play, 
  Download, 
  Share2,
  Calendar,
  Award,
  Zap,
  Eye,
  Heart,
  CheckCircle,
  Circle,
  ArrowRight,
  Sparkles,
  ImageIcon,
  MapPin,
  Users,
  Flame
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UserStats, LearningProgressData, UserInterestData } from '@/lib/types';

interface LearningDashboardProps {
  currentUserId: string;
}

interface StudyMaterial {
  id: string;
  title: string;
  type: 'mindmap' | 'image' | 'note' | 'quiz';
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  lastAccessed: Date;
  createdAt: Date;
  thumbnail?: string;
  tags: string[];
}

interface LearningPathStep {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'practice' | 'assessment' | 'project';
  estimatedTime: number;
  isCompleted: boolean;
  isActive: boolean;
  prerequisites: string[];
  skills: string[];
}

export function LearningDashboard({ currentUserId }: LearningDashboardProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  // Fetch user stats
  const { data: userStats } = useQuery<UserStats>({
    queryKey: [`/api/users/${currentUserId}/stats`],
    enabled: !!currentUserId,
  });

  // Fetch learning progress
  const { data: progressData } = useQuery<{ progress: LearningProgressData[] }>({
    queryKey: [`/api/users/${currentUserId}/progress`],
    enabled: !!currentUserId,
  });

  // Fetch user interests
  const { data: interests } = useQuery<UserInterestData[]>({
    queryKey: [`/api/users/${currentUserId}/interests`],
    enabled: !!currentUserId,
  });

  // Mock study materials - in real app, this would come from your backend
  const studyMaterials: StudyMaterial[] = [
    {
      id: '1',
      title: 'Photosynthesis Mind Map',
      type: 'mindmap',
      subject: 'Biology',
      difficulty: 'intermediate',
      progress: 85,
      lastAccessed: new Date('2024-05-20'),
      createdAt: new Date('2024-05-15'),
      tags: ['plants', 'energy', 'cellular-biology']
    },
    {
      id: '2',
      title: 'Solar System Visualization',
      type: 'image',
      subject: 'Astronomy',
      difficulty: 'beginner',
      progress: 100,
      lastAccessed: new Date('2024-05-22'),
      createdAt: new Date('2024-05-18'),
      tags: ['space', 'planets', 'physics']
    },
    {
      id: '3',
      title: 'Quantum Physics Notes',
      type: 'note',
      subject: 'Physics',
      difficulty: 'advanced',
      progress: 45,
      lastAccessed: new Date('2024-05-19'),
      createdAt: new Date('2024-05-10'),
      tags: ['quantum', 'theory', 'advanced']
    }
  ];

  // Mock learning path
  const learningPath: LearningPathStep[] = [
    {
      id: '1',
      title: 'Introduction to Cell Biology',
      description: 'Learn the basics of cellular structure and function',
      type: 'lesson',
      estimatedTime: 45,
      isCompleted: true,
      isActive: false,
      prerequisites: [],
      skills: ['cell-structure', 'organelles']
    },
    {
      id: '2',
      title: 'Photosynthesis Process',
      description: 'Understand how plants convert light into energy',
      type: 'lesson',
      estimatedTime: 60,
      isCompleted: true,
      isActive: false,
      prerequisites: ['1'],
      skills: ['energy-conversion', 'chloroplasts']
    },
    {
      id: '3',
      title: 'Cellular Respiration',
      description: 'Explore how cells break down glucose for energy',
      type: 'lesson',
      estimatedTime: 55,
      isCompleted: false,
      isActive: true,
      prerequisites: ['2'],
      skills: ['metabolism', 'mitochondria']
    },
    {
      id: '4',
      title: 'Practice Quiz: Energy Processes',
      description: 'Test your knowledge of cellular energy systems',
      type: 'assessment',
      estimatedTime: 30,
      isCompleted: false,
      isActive: false,
      prerequisites: ['3'],
      skills: ['assessment']
    }
  ];

  const subjects = ['all', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science'];

  const filteredMaterials = selectedSubject === 'all' 
    ? studyMaterials 
    : studyMaterials.filter(material => material.subject === selectedSubject);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mindmap': return <Brain className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'note': return <BookOpen className="w-4 h-4" />;
      case 'quiz': return <Target className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStepIcon = (type: string, isCompleted: boolean, isActive: boolean) => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (isActive) return <Play className="w-5 h-5 text-blue-500 animate-pulse" />;
    return <Circle className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white gradient-animation">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center animate-float">
              <Sparkles className="w-8 h-8 mr-3 animate-pulse" />
              Learning Dashboard
            </h1>
            <p className="text-blue-100 mb-4">Track your progress and explore your learning journey</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{userStats?.learningStreak || 0}</div>
            <div className="text-blue-200 flex items-center">
              <Flame className="w-4 h-4 mr-1" />
              Day Streak
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Progress</span>
            </div>
            <div className="text-2xl font-bold mt-1">{userStats?.overallProgress || 0}%</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span className="text-sm">Visuals</span>
            </div>
            <div className="text-2xl font-bold mt-1">{userStats?.visualsGenerated || 0}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span className="text-sm">Topics</span>
            </div>
            <div className="text-2xl font-bold mt-1">{userStats?.topicsExplored || 0}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span className="text-sm">Achievements</span>
            </div>
            <div className="text-2xl font-bold mt-1">12</div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Study Materials</span>
          </TabsTrigger>
          <TabsTrigger value="path" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Learning Path</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Progress</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="animate-bounce-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {studyMaterials.slice(0, 3).map((material) => (
                  <div key={material.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    {getTypeIcon(material.type)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{material.title}</div>
                      <div className="text-xs text-muted-foreground">{material.subject}</div>
                    </div>
                    <Progress value={material.progress} className="w-12" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Current Interests */}
            <Card className="animate-bounce-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Your Interests</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interests?.map((interest) => (
                  <div key={interest.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{interest.interest}</span>
                    <Badge variant="secondary">{interest.progress}%</Badge>
                  </div>
                ))}
                {(!interests || interests.length === 0) && (
                  <p className="text-muted-foreground text-sm">No interests added yet. Start exploring topics to build your learning profile!</p>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="animate-bounce-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Quick Learner</div>
                    <div className="text-xs text-muted-foreground">Completed 5 topics in one day</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Mind Map Master</div>
                    <div className="text-xs text-muted-foreground">Created 10 interactive mind maps</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Study Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Study Materials</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Filter by:</span>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-1 border border-border rounded-md text-sm bg-background"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material, index) => (
              <Card key={material.id} className="animate-bounce-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(material.type)}
                      <CardTitle className="text-base">{material.title}</CardTitle>
                    </div>
                    <Badge variant={material.difficulty === 'advanced' ? 'destructive' : material.difficulty === 'intermediate' ? 'default' : 'secondary'}>
                      {material.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{material.subject}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{material.progress}%</span>
                    </div>
                    <Progress value={material.progress} />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {material.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Last accessed: {material.lastAccessed.toLocaleDateString()}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" className="icon-hover">
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="icon-hover">
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="icon-hover">
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Learning Path Tab */}
        <TabsContent value="path" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Personalized Learning Path</h3>
              <p className="text-muted-foreground">Cell Biology Fundamentals</p>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              2/4 Complete
            </Badge>
          </div>

          <div className="space-y-4">
            {learningPath.map((step, index) => (
              <Card key={step.id} className={`animate-slide-up transition-all duration-300 ${step.isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {getStepIcon(step.type, step.isCompleted, step.isActive)}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">{step.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{step.estimatedTime}min</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {step.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {step.prerequisites.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              Prerequisites: {step.prerequisites.length} completed
                            </span>
                          )}
                        </div>
                        
                        {step.isActive && (
                          <Button className="feature-button icon-hover">
                            <Play className="w-4 h-4 mr-2" />
                            Continue Learning
                          </Button>
                        )}
                        
                        {step.isCompleted && (
                          <Button variant="outline" className="icon-hover">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        )}
                        
                        {!step.isCompleted && !step.isActive && (
                          <Button variant="ghost" disabled>
                            <Circle className="w-4 h-4 mr-2" />
                            Locked
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <h3 className="text-lg font-semibold">Detailed Progress</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progressData?.progress.map((progress, index) => (
              <Card key={progress.id} className="animate-bounce-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{progress.topic}</span>
                    <Badge>{progress.progressPercentage}%</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={progress.progressPercentage} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Visuals Created:</span>
                      <div className="font-semibold">{progress.visualsGenerated}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Activity:</span>
                      <div className="font-semibold">{new Date(progress.lastActivity).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <Button className="w-full feature-button">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}