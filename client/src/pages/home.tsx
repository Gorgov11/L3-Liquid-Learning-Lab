import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Menu, GraduationCap } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { VisualPanel } from '@/components/visual-panel';
import { DashboardModal } from '@/components/dashboard-modal';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ChatMessage, ConversationData } from '@/lib/types';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [currentUserId] = useState('user-1'); // Simplified user management
  const queryClient = useQueryClient();

  // Get current conversation messages to extract latest visual content
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: [`/api/conversations/${currentConversationId}/messages`],
    enabled: !!currentConversationId,
  });

  // Create new conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/conversations', {
        userId: currentUserId,
        title: 'New Learning Session',
      });
      return response.json();
    },
    onSuccess: (conversation: ConversationData) => {
      setCurrentConversationId(conversation.id);
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${currentUserId}`] });
    },
  });

  // Get latest visual content from messages
  const latestImageMessage = messages
    .filter(msg => msg.imageUrl)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  
  const latestMindMapMessage = messages
    .filter(msg => msg.mindMapData)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const handleNewChat = () => {
    createConversationMutation.mutate();
    setSidebarOpen(false);
  };

  const handleSelectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId);
    setSidebarOpen(false);
  };

  const handleOpenDashboard = () => {
    setDashboardOpen(true);
    setSidebarOpen(false);
  };

  // Auto-create first conversation on mount
  useEffect(() => {
    if (!currentConversationId) {
      createConversationMutation.mutate();
    }
  }, []);

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between relative z-50">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Liquid Learning Lab: AI Tutor
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full pulse-animation" />
            <span>AI Tutor Online</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDashboardOpen(true)}
          >
            <Settings className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Settings</span>
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onOpenDashboard={handleOpenDashboard}
          currentUserId={currentUserId}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-w-0">
          {/* Chat Interface */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatInterface
              conversationId={currentConversationId}
              currentUserId={currentUserId}
            />
          </div>

          {/* Visual Panel */}
          <VisualPanel
            currentImage={latestImageMessage?.imageUrl}
            currentMindMap={latestMindMapMessage?.mindMapData}
          />
        </div>
      </div>

      {/* Dashboard Modal */}
      <DashboardModal
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
