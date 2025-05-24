import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Star, History, BarChart3, BookOpen, GraduationCap, X, Brain, Lightbulb, TrendingUp, Zap, Sparkles } from 'lucide-react';
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

// Smart topic detection and categorization
const detectTopicFromTitle = (title: string): { topic: string; category: string; color: string; icon: any } => {
  const keywords = title.toLowerCase();
  
  // Science topics
  if (keywords.includes('physics') || keywords.includes('chemistry') || keywords.includes('biology') || keywords.includes('atom') || keywords.includes('molecule')) {
    return { topic: 'Science Exploration', category: 'Science', color: 'bg-blue-500', icon: Zap };
  }
  
  // Math topics
  if (keywords.includes('math') || keywords.includes('algebra') || keywords.includes('geometry') || keywords.includes('calculus') || keywords.includes('equation')) {
    return { topic: 'Mathematics', category: 'Math', color: 'bg-green-500', icon: TrendingUp };
  }
  
  // Technology topics
  if (keywords.includes('programming') || keywords.includes('code') || keywords.includes('computer') || keywords.includes('software') || keywords.includes('ai')) {
    return { topic: 'Tech Learning', category: 'Technology', color: 'bg-purple-500', icon: Brain };
  }
  
  // History topics
  if (keywords.includes('history') || keywords.includes('ancient') || keywords.includes('war') || keywords.includes('civilization')) {
    return { topic: 'History Study', category: 'History', color: 'bg-amber-500', icon: BookOpen };
  }
  
  // Language topics
  if (keywords.includes('language') || keywords.includes('english') || keywords.includes('spanish') || keywords.includes('grammar')) {
    return { topic: 'Language Arts', category: 'Language', color: 'bg-pink-500', icon: Sparkles };
  }
  
  // Default for general learning
  return { topic: 'General Learning', category: 'General', color: 'bg-slate-500', icon: Lightbulb };
};

// AI-suggested learning topics
const getAISuggestedTopics = () => [
  { topic: '🧬 DNA & Genetics', color: 'bg-blue-500', category: 'Science' },
  { topic: '🚀 Space Exploration', color: 'bg-indigo-500', category: 'Science' },
  { topic: '💻 AI & Machine Learning', color: 'bg-purple-500', category: 'Technology' },
  { topic: '🏛️ Ancient Civilizations', color: 'bg-amber-500', category: 'History' },
  { topic: '🎨 Digital Art Creation', color: 'bg-pink-500', category: 'Art' },
  { topic: '📊 Data Visualization', color: 'bg-green-500', category: 'Math' },
];

export function Sidebar({ 
  isOpen, 
  onClose, 
  onNewChat, 
  onSelectConversation, 
  onOpenDashboard,
  currentUserId 
}: SidebarProps) {
  const [newInterest, setNewInterest] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations = [] } = useQuery<ConversationData[]>({
    queryKey: [`/api/conversations/${currentUserId}`],
    enabled: !!currentUserId,
  });

  // Fetch user interests
  const { data: interests = [] } = useQuery<UserInterestData[]>({
    queryKey: [`/api/users/${currentUserId}/interests`],
    enabled: !!currentUserId,
  });

  // Add interest mutation
  const addInterestMutation = useMutation({
    mutationFn: async (interest: string) => {
      const response = await apiRequest('POST', `/api/users/${currentUserId}/interests`, {
        interest,
        progress: 0,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/interests`] });
      setNewInterest('');
    },
  });

  // Delete interest mutation
  const deleteInterestMutation = useMutation({
    mutationFn: async (interestId: number) => {
      await apiRequest('DELETE', `/api/users/${currentUserId}/interests/${interestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/interests`] });
    },
  });

  const handleAddInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newInterest.trim()) {
      addInterestMutation.mutate(newInterest.trim());
    }
  };

  const handleDeleteInterest = (interestId: number) => {
    deleteInterestMutation.mutate(interestId);
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
        fixed lg:relative inset-y-0 left-0 w-80 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  L³ Menu
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={onNewChat}
                className="w-full bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="w-full text-xs"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                AI Suggestions
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            {/* Learning Interests */}
            <div className="gradient-border mb-6">
              <div className="gradient-border-inner">
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span>Learning Interests</span>
                </h3>
                
                <div className="space-y-2 mb-3">
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest.id}
                        variant="secondary"
                        className="bg-primary/20 text-primary border-primary/30 group cursor-pointer"
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
                  className="text-sm"
                />
              </div>
            </div>

            {/* AI Suggestions Panel */}
            {showSuggestions && (
              <div className="mb-6 animate-in slide-in-from-top duration-300">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center space-x-2">
                    <Brain className="w-4 h-4" />
                    <span>AI Learning Suggestions</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {getAISuggestedTopics().slice(0, 4).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start p-2 h-auto text-left hover:bg-white/50 dark:hover:bg-black/20"
                        onClick={onNewChat}
                      >
                        <div className={`w-2 h-2 rounded-full ${suggestion.color} mr-2`} />
                        <div>
                          <div className="font-medium text-xs">{suggestion.topic}</div>
                          <div className="text-xs text-muted-foreground">{suggestion.category}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Smart Recent Sessions */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-muted-foreground flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>Learning History</span>
              </h3>
              <div className="space-y-2">
                {conversations.slice(0, 6).map((conversation) => {
                  const topicData = detectTopicFromTitle(conversation.title);
                  const IconComponent = topicData.icon;
                  
                  return (
                    <Button
                      key={conversation.id}
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto group hover:bg-muted/50 transition-all duration-200"
                      onClick={() => onSelectConversation(conversation.id)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className={`w-8 h-8 rounded-lg ${topicData.color} flex items-center justify-center text-white flex-shrink-0`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {topicData.topic}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {topicData.category}
                            </Badge>
                            <span>•</span>
                            <span>{new Date(conversation.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                      </div>
                    </Button>
                  );
                })}
                {conversations.length === 0 && (
                  <div className="text-center py-6">
                    <Lightbulb className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Start your first learning session!</p>
                    <p className="text-xs text-muted-foreground mt-1">AI will automatically categorize your topics</p>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Navigation */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={onOpenDashboard}
              >
                <BarChart3 className="w-4 h-4 mr-3 text-primary" />
                Learning Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-3 text-primary" />
                Study Materials
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <GraduationCap className="w-4 h-4 mr-3 text-primary" />
                Learning Path
              </Button>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
