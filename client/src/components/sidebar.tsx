import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Star, History, BarChart3, BookOpen, GraduationCap, X, Brain, Lightbulb, TrendingUp, Zap, Sparkles, MapPin, Archive, Settings, Globe, Users, Trophy, Calendar, Target, FileText } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { LanguageSelector } from './language-selector';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ConversationData, UserInterestData } from '@/lib/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectConversation: (conversationId: number) => void;
  onOpenDashboard: () => void;
  currentUserId: string;
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  onNewChat, 
  onSelectConversation, 
  onOpenDashboard,
  currentUserId 
}: SidebarProps) {
  const [location] = useLocation();
  const [newInterest, setNewInterest] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations = [] } = useQuery<ConversationData[]>({
    queryKey: ['/api/conversations', currentUserId],
    queryFn: async () => {
      const res = await fetch(`/api/conversations/${currentUserId}`);
      if (!res.ok) throw new Error('Failed to fetch conversations');
      return res.json();
    }
  });

  // Fetch user interests
  const { data: interests = [] } = useQuery<UserInterestData[]>({
    queryKey: ['/api/users', currentUserId, 'interests'],
    queryFn: async () => {
      const res = await fetch(`/api/users/${currentUserId}/interests`);
      if (!res.ok) throw new Error('Failed to fetch interests');
      return res.json();
    }
  });

  // Add interest mutation
  const addInterestMutation = useMutation({
    mutationFn: async (interest: string) => {
      return apiRequest('/api/users/interests', {
        method: 'POST',
        body: JSON.stringify({ userId: currentUserId, interest })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'interests'] });
      setNewInterest('');
    }
  });

  // Delete interest mutation
  const deleteInterestMutation = useMutation({
    mutationFn: async (interestId: number) => {
      return apiRequest(`/api/users/interests/${interestId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'interests'] });
    }
  });

  const handleAddInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newInterest.trim()) {
      addInterestMutation.mutate(newInterest.trim());
    }
  };

  const handleDeleteInterest = (interestId: number) => {
    deleteInterestMutation.mutate(interestId);
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper functions
  const getCategoryForConversation = (title: string): string => {
    const keywords = {
      'Science': ['physics', 'chemistry', 'biology', 'science', 'quantum', 'atom', 'molecule'],
      'Math': ['math', 'calculus', 'algebra', 'geometry', 'equation', 'number', 'formula'],
      'History': ['history', 'ancient', 'civilization', 'war', 'empire', 'culture'],
      'Literature': ['literature', 'book', 'novel', 'poem', 'story', 'author', 'writing'],
      'Technology': ['technology', 'computer', 'AI', 'programming', 'software', 'code'],
      'Language': ['language', 'english', 'spanish', 'french', 'grammar', 'vocabulary']
    };

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => title.toLowerCase().includes(word))) {
        return category;
      }
    }
    return 'General';
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      'Science': 'bg-blue-500',
      'Math': 'bg-green-500',
      'History': 'bg-amber-500',
      'Literature': 'bg-purple-500',
      'Technology': 'bg-cyan-500',
      'Language': 'bg-pink-500',
      'General': 'bg-gray-500'
    };
    return colors[category] || colors['General'];
  };

  const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return diffDays === 1 ? '1d ago' : `${diffDays}d ago`;
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 w-72 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Compact Header */}
          <div className="p-4 border-b border-border flex-shrink-0">
            <Button 
              onClick={onNewChat}
              className="w-full bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 h-8 text-sm"
            >
              <Plus className="w-3 h-3 mr-2" />
              Start Learning
            </Button>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Main Navigation */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground px-2 mb-2">NAVIGATION</div>
                
                <Link href="/">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-8 px-2 text-sm font-medium transition-all duration-200 ${
                      location === '/' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                
                <Link href="/study-materials">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-8 px-2 text-sm font-medium transition-all duration-200 ${
                      location === '/study-materials' 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Materials
                  </Button>
                </Link>
                
                <Link href="/learning-path">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-8 px-2 text-sm font-medium transition-all duration-200 ${
                      location === '/learning-path' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:from-green-600 hover:to-green-700' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Path
                  </Button>
                </Link>
              </div>
              
              {/* Features Section */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground px-2 mb-2">FEATURES</div>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 px-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  onClick={onOpenDashboard}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Achievements
                </Button>
                
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-8 px-2 text-sm font-medium transition-all duration-200 ${
                    showSuggestions 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  AI Tips
                </Button>
                
                <Link href="/schedule">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-8 px-2 text-sm font-medium transition-all duration-200 ${
                      location === '/schedule' 
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-cyan-700' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </Link>
                
                <Link href="/groups">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-8 px-2 text-sm font-medium transition-all duration-200 ${
                      location === '/groups' 
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25 hover:from-pink-600 hover:to-pink-700' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Groups
                  </Button>
                </Link>
              </div>
              
              {/* Language Selector */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground px-2 mb-2">SETTINGS</div>
                <LanguageSelector />
              </div>

              {/* Learning Interests */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground px-2 mb-2 flex items-center gap-2">
                  <Star className="w-3 h-3 text-primary" />
                  INTERESTS
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex flex-wrap gap-1">
                    {interests.map((interest) => (
                      <Badge
                        key={interest.id}
                        variant="secondary"
                        className="text-xs bg-primary/20 text-primary border-primary/30 group cursor-pointer"
                        onClick={() => handleDeleteInterest(interest.id)}
                      >
                        {interest.interest}
                        <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Input
                  type="text"
                  placeholder="Add new interest..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={handleAddInterest}
                  className="text-sm h-8 mb-4"
                />
              </div>

              {/* Learning Suggestions */}
              {showSuggestions && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground px-2 mb-2">AI SUGGESTIONS</div>
                  
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-chart-1/10 border border-chart-1/20">
                      <h4 className="text-xs font-medium text-chart-1 mb-1">Science</h4>
                      <p className="text-xs text-muted-foreground">Explore quantum physics fundamentals</p>
                    </div>
                    
                    <div className="p-2 rounded-lg bg-chart-2/10 border border-chart-2/20">
                      <h4 className="text-xs font-medium text-chart-2 mb-1">Mathematics</h4>
                      <p className="text-xs text-muted-foreground">Practice calculus problem solving</p>
                    </div>
                    
                    <div className="p-2 rounded-lg bg-chart-3/10 border border-chart-3/20">
                      <h4 className="text-xs font-medium text-chart-3 mb-1">History</h4>
                      <p className="text-xs text-muted-foreground">Learn about ancient civilizations</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Conversations */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 mb-2">
                  <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <History className="w-3 h-3" />
                    RECENT CHATS
                  </div>
                  
                  {conversations.length > 0 && (
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-20 h-6 text-xs"
                    />
                  )}
                </div>
                
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                      <Brain className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">No conversations yet</p>
                    <p className="text-xs text-muted-foreground/70">Start learning to see history</p>
                  </div>
                ) : (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {filteredConversations.map((conversation) => {
                      const category = getCategoryForConversation(conversation.title);
                      const categoryColor = getCategoryColor(category);
                      
                      return (
                        <Button
                          key={conversation.id}
                          variant="ghost"
                          className="w-full justify-start p-2 h-auto text-left"
                          onClick={() => onSelectConversation(conversation.id)}
                        >
                          <div className="flex items-start space-x-2 w-full">
                            <div 
                              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${categoryColor}`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {conversation.title}
                              </p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs h-4 px-1"
                                >
                                  {category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(conversation.updatedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}