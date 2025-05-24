import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Brain, 
  Search,
  Filter,
  Download, 
  Share2,
  Play,
  Star,
  Clock,
  Tag,
  ImageIcon,
  FileText,
  Target,
  Sparkles,
  Eye,
  Heart,
  Archive,
  Trash2,
  Edit3,
  Plus,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

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
  favorite: boolean;
  archived: boolean;
  description: string;
  estimatedTime: number;
}

export default function StudyMaterials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'progress' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFavorites, setShowFavorites] = useState(false);

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
      tags: ['plants', 'energy', 'cellular-biology'],
      favorite: true,
      archived: false,
      description: 'Interactive mind map exploring the process of photosynthesis in plants',
      estimatedTime: 45
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
      tags: ['space', 'planets', 'physics'],
      favorite: false,
      archived: false,
      description: 'Beautiful visualization of our solar system with planetary details',
      estimatedTime: 30
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
      tags: ['quantum', 'theory', 'advanced'],
      favorite: true,
      archived: false,
      description: 'Comprehensive notes on quantum mechanics and wave-particle duality',
      estimatedTime: 90
    },
    {
      id: '4',
      title: 'Chemical Bonding Quiz',
      type: 'quiz',
      subject: 'Chemistry',
      difficulty: 'intermediate',
      progress: 70,
      lastAccessed: new Date('2024-05-21'),
      createdAt: new Date('2024-05-12'),
      tags: ['chemistry', 'bonds', 'molecules'],
      favorite: false,
      archived: false,
      description: 'Interactive quiz testing knowledge of ionic and covalent bonding',
      estimatedTime: 25
    },
    {
      id: '5',
      title: 'DNA Structure Model',
      type: 'image',
      subject: 'Biology',
      difficulty: 'intermediate',
      progress: 90,
      lastAccessed: new Date('2024-05-23'),
      createdAt: new Date('2024-05-20'),
      tags: ['dna', 'genetics', 'structure'],
      favorite: true,
      archived: false,
      description: '3D visualization of DNA double helix structure',
      estimatedTime: 35
    },
    {
      id: '6',
      title: 'Calculus Fundamentals',
      type: 'note',
      subject: 'Mathematics',
      difficulty: 'advanced',
      progress: 60,
      lastAccessed: new Date('2024-05-17'),
      createdAt: new Date('2024-05-08'),
      tags: ['calculus', 'derivatives', 'integrals'],
      favorite: false,
      archived: false,
      description: 'Complete guide to differential and integral calculus',
      estimatedTime: 120
    }
  ];

  const subjects = ['all', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Astronomy'];
  const types = ['all', 'mindmap', 'image', 'note', 'quiz'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  // Filter and sort materials
  const filteredMaterials = studyMaterials
    .filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
      const matchesType = selectedType === 'all' || material.type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || material.difficulty === selectedDifficulty;
      const matchesFavorites = !showFavorites || material.favorite;
      
      return matchesSearch && matchesSubject && matchesType && matchesDifficulty && matchesFavorites && !material.archived;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = a.lastAccessed.getTime() - b.lastAccessed.getTime();
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mindmap': return <Brain className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      case 'quiz': return <Target className="w-4 h-4" />;
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

  const toggleFavorite = (materialId: string) => {
    // In real app, this would make an API call
    console.log('Toggle favorite for:', materialId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 gradient-animation">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center animate-float">
                <BookOpen className="w-10 h-10 mr-4 animate-pulse" />
                Study Materials
              </h1>
              <p className="text-blue-100 text-lg">Organize, review, and master your learning content</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{filteredMaterials.length}</div>
              <div className="text-blue-200">Materials Available</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span className="text-sm">Mind Maps</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {studyMaterials.filter(m => m.type === 'mindmap').length}
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">Images</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {studyMaterials.filter(m => m.type === 'image').length}
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Notes</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {studyMaterials.filter(m => m.type === 'note').length}
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span className="text-sm">Quizzes</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {studyMaterials.filter(m => m.type === 'quiz').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Search and Filters */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search materials, descriptions, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Difficulty</label>
                <select 
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'progress' | 'title')}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                >
                  <option value="date">Last Accessed</option>
                  <option value="progress">Progress</option>
                  <option value="title">Title</option>
                </select>
              </div>

              <div className="flex items-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="icon-hover"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
                <Button
                  variant={showFavorites ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFavorites(!showFavorites)}
                  className="icon-hover"
                >
                  <Heart className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="flex items-end space-x-2">
                <Button
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="icon-hover"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="icon-hover"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material, index) => (
              <Card key={material.id} className="animate-bounce-in hover:shadow-lg transition-all duration-300 group" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(material.type)}
                      <CardTitle className="text-base">{material.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(material.id)}
                        className="icon-hover opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className={`w-4 h-4 ${material.favorite ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                      <Badge className={getDifficultyColor(material.difficulty)}>
                        {material.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{material.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{material.subject}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{material.estimatedTime}min</span>
                    </div>
                  </div>

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
                      {material.lastAccessed.toLocaleDateString()}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" className="feature-button icon-hover">
                        <Play className="w-3 h-3 mr-1" />
                        Open
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
        ) : (
          <div className="space-y-4">
            {filteredMaterials.map((material, index) => (
              <Card key={material.id} className="animate-slide-up hover:shadow-md transition-all duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(material.type)}
                        <h3 className="font-semibold text-lg">{material.title}</h3>
                        {material.favorite && <Heart className="w-4 h-4 fill-current text-red-500" />}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{material.subject}</span>
                        <Badge className={getDifficultyColor(material.difficulty)}>
                          {material.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{material.estimatedTime}min</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{material.progress}%</div>
                        <Progress value={material.progress} className="w-20" />
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button size="sm" className="feature-button icon-hover">
                          <Play className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                        <Button size="sm" variant="outline" className="icon-hover">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="icon-hover">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mt-2">{material.description}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-1">
                      {material.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Last accessed: {material.lastAccessed.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12 animate-slide-up">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No materials found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria to find more materials.
            </p>
            <Button className="feature-button">
              <Plus className="w-4 h-4 mr-2" />
              Create New Material
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}