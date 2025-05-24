import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Star, History, BarChart3, BookOpen, GraduationCap, X } from 'lucide-react';
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
  const [newInterest, setNewInterest] = useState('');
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
            
            <Button 
              onClick={onNewChat}
              className="w-full bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Learning Session
            </Button>
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

            {/* Recent Sessions */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-muted-foreground flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>Recent Sessions</span>
              </h3>
              <div className="space-y-2">
                {conversations.slice(0, 5).map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm truncate">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))}
                {conversations.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent sessions
                  </p>
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
