import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackNavigation } from '@/components/back-navigation';
import { 
  MapPin,
  CheckCircle,
  Circle,
  Play,
  Clock,
  Star,
  Award,
  Brain,
  Target,
  BookOpen,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Lock,
  Unlock,
  Calendar,
  Flag,
  Sparkles,
  Route,
  Compass
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface LearningPathStep {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'practice' | 'assessment' | 'project';
  estimatedTime: number;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  prerequisites: string[];
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completedAt?: Date;
  score?: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  totalSteps: number;
  completedSteps: number;
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: LearningPathStep[];
  prerequisites: string[];
  outcomes: string[];
}

export default function LearningPath() {
  const [selectedPath, setSelectedPath] = useState<string>('biology-cells');

  // Mock learning paths - in real app, this would come from your backend
  const learningPaths: LearningPath[] = [
    {
      id: 'biology-cells',
      title: 'Cell Biology Fundamentals',
      description: 'Master the building blocks of life through interactive lessons and visual learning',
      category: 'Biology',
      totalSteps: 8,
      completedSteps: 3,
      estimatedDuration: 480, // in minutes
      difficulty: 'intermediate',
      prerequisites: ['basic-chemistry'],
      outcomes: [
        'Understand cell structure and organelles',
        'Explain cellular processes like photosynthesis',
        'Compare prokaryotic and eukaryotic cells',
        'Analyze cell division and reproduction'
      ],
      steps: [
        {
          id: '1',
          title: 'Introduction to Cells',
          description: 'Learn about the basic unit of life and cellular theory',
          type: 'lesson',
          estimatedTime: 45,
          isCompleted: true,
          isActive: false,
          isLocked: false,
          prerequisites: [],
          skills: ['cell-theory', 'microscopy'],
          difficulty: 'beginner',
          completedAt: new Date('2024-05-15'),
          score: 92
        },
        {
          id: '2',
          title: 'Cell Organelles',
          description: 'Explore the different parts of a cell and their functions',
          type: 'lesson',
          estimatedTime: 60,
          isCompleted: true,
          isActive: false,
          isLocked: false,
          prerequisites: ['1'],
          skills: ['organelles', 'cell-structure'],
          difficulty: 'intermediate',
          completedAt: new Date('2024-05-17'),
          score: 88
        },
        {
          id: '3',
          title: 'Photosynthesis Process',
          description: 'Understand how plants convert light into energy',
          type: 'lesson',
          estimatedTime: 55,
          isCompleted: true,
          isActive: false,
          isLocked: false,
          prerequisites: ['2'],
          skills: ['energy-conversion', 'chloroplasts'],
          difficulty: 'intermediate',
          completedAt: new Date('2024-05-20'),
          score: 95
        },
        {
          id: '4',
          title: 'Cellular Respiration',
          description: 'Explore how cells break down glucose for energy',
          type: 'lesson',
          estimatedTime: 50,
          isCompleted: false,
          isActive: true,
          isLocked: false,
          prerequisites: ['3'],
          skills: ['metabolism', 'mitochondria'],
          difficulty: 'intermediate'
        },
        {
          id: '5',
          title: 'Cell Division Lab',
          description: 'Interactive lab simulation of mitosis and meiosis',
          type: 'practice',
          estimatedTime: 75,
          isCompleted: false,
          isActive: false,
          isLocked: true,
          prerequisites: ['4'],
          skills: ['cell-division', 'chromosomes'],
          difficulty: 'intermediate'
        },
        {
          id: '6',
          title: 'Cell Transport Mechanisms',
          description: 'Learn about passive and active transport across membranes',
          type: 'lesson',
          estimatedTime: 40,
          isCompleted: false,
          isActive: false,
          isLocked: true,
          prerequisites: ['4'],
          skills: ['membrane-transport', 'diffusion'],
          difficulty: 'intermediate'
        },
        {
          id: '7',
          title: 'Cell Biology Assessment',
          description: 'Comprehensive test of your cellular knowledge',
          type: 'assessment',
          estimatedTime: 45,
          isCompleted: false,
          isActive: false,
          isLocked: true,
          prerequisites: ['5', '6'],
          skills: ['assessment'],
          difficulty: 'intermediate'
        },
        {
          id: '8',
          title: 'Cell Research Project',
          description: 'Design and present your own cellular research project',
          type: 'project',
          estimatedTime: 120,
          isCompleted: false,
          isActive: false,
          isLocked: true,
          prerequisites: ['7'],
          skills: ['research', 'presentation'],
          difficulty: 'advanced'
        }
      ]
    },
    {
      id: 'physics-quantum',
      title: 'Quantum Physics Basics',
      description: 'Journey into the strange world of quantum mechanics',
      category: 'Physics',
      totalSteps: 6,
      completedSteps: 1,
      estimatedDuration: 360,
      difficulty: 'advanced',
      prerequisites: ['calculus-basics', 'classical-physics'],
      outcomes: [
        'Understand wave-particle duality',
        'Explain quantum superposition',
        'Analyze the uncertainty principle',
        'Apply quantum concepts to real problems'
      ],
      steps: [
        {
          id: 'q1',
          title: 'Introduction to Quantum World',
          description: 'Discover the fundamental principles of quantum mechanics',
          type: 'lesson',
          estimatedTime: 60,
          isCompleted: true,
          isActive: false,
          isLocked: false,
          prerequisites: [],
          skills: ['quantum-basics', 'wave-particle-duality'],
          difficulty: 'advanced',
          completedAt: new Date('2024-05-18'),
          score: 85
        },
        {
          id: 'q2',
          title: 'Wave Functions',
          description: 'Mathematical description of quantum states',
          type: 'lesson',
          estimatedTime: 75,
          isCompleted: false,
          isActive: true,
          isLocked: false,
          prerequisites: ['q1'],
          skills: ['wave-functions', 'probability'],
          difficulty: 'advanced'
        }
      ]
    }
  ];

  const currentPath = learningPaths.find(path => path.id === selectedPath) || learningPaths[0];

  const getStepIcon = (step: LearningPathStep) => {
    if (step.isCompleted) return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (step.isActive) return <Play className="w-6 h-6 text-blue-500 animate-pulse" />;
    if (step.isLocked) return <Lock className="w-6 h-6 text-muted-foreground" />;
    return <Circle className="w-6 h-6 text-muted-foreground" />;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="w-4 h-4" />;
      case 'practice': return <Zap className="w-4 h-4" />;
      case 'assessment': return <Target className="w-4 h-4" />;
      case 'project': return <Flag className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const progressPercentage = (currentPath.completedSteps / currentPath.totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <BackNavigation title="Learning Path" showHomeButton={true} />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 gradient-animation">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center animate-float">
                <Route className="w-10 h-10 mr-4 animate-pulse" />
                Learning Path
              </h1>
              <p className="text-blue-100 text-lg">Follow your personalized journey to mastery</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{Math.round(progressPercentage)}%</div>
              <div className="text-blue-200">Complete</div>
            </div>
          </div>

          {/* Current Path Overview */}
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{currentPath.title}</h2>
                <p className="text-blue-100">{currentPath.description}</p>
              </div>
              <Badge className={getDifficultyColor(currentPath.difficulty)}>
                {currentPath.difficulty}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{currentPath.completedSteps}/{currentPath.totalSteps}</div>
                <div className="text-blue-200 text-sm">Steps Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(currentPath.estimatedDuration / 60)}h</div>
                <div className="text-blue-200 text-sm">Total Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentPath.category}</div>
                <div className="text-blue-200 text-sm">Subject</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentPath.outcomes.length}</div>
                <div className="text-blue-200 text-sm">Learning Goals</div>
              </div>
            </div>

            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current" className="flex items-center space-x-2">
              <Compass className="w-4 h-4" />
              <span>Current Path</span>
            </TabsTrigger>
            <TabsTrigger value="paths" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>All Paths</span>
            </TabsTrigger>
            <TabsTrigger value="outcomes" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Learning Outcomes</span>
            </TabsTrigger>
          </TabsList>

          {/* Current Path Tab */}
          <TabsContent value="current" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Learning Steps */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-semibold flex items-center space-x-2">
                  <Route className="w-5 h-5" />
                  <span>Learning Steps</span>
                </h3>

                {currentPath.steps.map((step, index) => (
                  <Card key={step.id} className={`animate-slide-up transition-all duration-300 ${step.isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {getStepIcon(step)}
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(step.type)}
                              <h4 className="font-semibold text-lg">{step.title}</h4>
                              {step.isCompleted && step.score && (
                                <Badge variant="secondary" className="ml-2">
                                  {step.score}% Score
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{step.estimatedTime}min</span>
                              <Badge className={getDifficultyColor(step.difficulty)}>
                                {step.difficulty}
                              </Badge>
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
                                  Prerequisites: {step.prerequisites.length} required
                                </span>
                              )}
                              {step.completedAt && (
                                <span className="text-xs text-muted-foreground">
                                  Completed: {step.completedAt.toLocaleDateString()}
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
                            
                            {step.isLocked && (
                              <Button variant="ghost" disabled>
                                <Lock className="w-4 h-4 mr-2" />
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

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Progress Summary */}
                <Card className="animate-bounce-in">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span>Progress Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{currentPath.completedSteps}</div>
                        <div className="text-green-700 dark:text-green-300">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{currentPath.totalSteps - currentPath.completedSteps}</div>
                        <div className="text-blue-700 dark:text-blue-300">Remaining</div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-sm font-medium mb-2">Estimated Time to Complete:</div>
                      <div className="text-lg font-bold text-primary">
                        {Math.round((currentPath.estimatedDuration * (100 - progressPercentage) / 100) / 60)}h remaining
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievement Preview */}
                <Card className="animate-bounce-in" style={{ animationDelay: '200ms' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span>Next Achievement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-950/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Brain className="w-8 h-8 text-yellow-600" />
                      </div>
                      <h4 className="font-semibold mb-1">Cell Master</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Complete all cell biology lessons
                      </p>
                      <Progress value={progressPercentage} className="mb-2" />
                      <div className="text-xs text-muted-foreground">
                        {currentPath.totalSteps - currentPath.completedSteps} steps remaining
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* All Paths Tab */}
          <TabsContent value="paths" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPaths.map((path, index) => (
                <Card key={path.id} className={`animate-bounce-in cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedPath === path.id ? 'ring-2 ring-blue-500' : ''}`} style={{ animationDelay: `${index * 100}ms` }} onClick={() => setSelectedPath(path.id)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{path.title}</span>
                      </CardTitle>
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{path.completedSteps}/{path.totalSteps}</div>
                        <div className="text-muted-foreground">Steps</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{Math.round(path.estimatedDuration / 60)}h</div>
                        <div className="text-muted-foreground">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{path.category}</div>
                        <div className="text-muted-foreground">Subject</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round((path.completedSteps / path.totalSteps) * 100)}%</span>
                      </div>
                      <Progress value={(path.completedSteps / path.totalSteps) * 100} />
                    </div>

                    <Button className={`w-full feature-button ${selectedPath === path.id ? '' : 'variant-outline'}`}>
                      {selectedPath === path.id ? 'Current Path' : 'Switch to This Path'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Outcomes Tab */}
          <TabsContent value="outcomes" className="space-y-6">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Learning Outcomes for {currentPath.title}</span>
                </CardTitle>
                <CardDescription>
                  What you'll be able to do after completing this learning path
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPath.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border border-border rounded-lg animate-bounce-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{outcome}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {currentPath.prerequisites.length > 0 && (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPath.prerequisites.map(prereq => (
                        <Badge key={prereq} variant="outline" className="text-yellow-700 dark:text-yellow-300">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}