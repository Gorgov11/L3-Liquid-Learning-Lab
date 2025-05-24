import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Menu, GraduationCap, Brain, Eye, Mic, Image } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { VisualPanel } from '@/components/visual-panel';
import { DashboardModal } from '@/components/dashboard-modal-new';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ChatMessage, ConversationData } from '@/lib/types';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [currentUserId] = useState('user-1'); // Simplified user management
  const [showVisualPanel, setShowVisualPanel] = useState(false);
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

  // Show visual panel when there are visual assets
  useEffect(() => {
    if (latestImageMessage || latestMindMapMessage) {
      setShowVisualPanel(true);
    }
  }, [latestImageMessage, latestMindMapMessage]);

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden">
      {/* Enhanced Header with AI Features */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between relative z-50">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
              <svg width="16" height="16" viewBox="0 0 24 24" className="text-white">
                <defs>
                  <linearGradient id="simple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.7"/>
                  </linearGradient>
                </defs>
                {/* Simple L³ monogram */}
                <text x="2" y="16" fontSize="12" fontWeight="bold" fill="url(#simple-gradient)">L</text>
                <text x="12" y="10" fontSize="8" fontWeight="bold" fill="url(#simple-gradient)">3</text>
                {/* Subtle liquid drop */}
                <circle cx="18" cy="6" r="2" fill="currentColor" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                Liquid Learning Lab
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI Visual Tutor</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* AI Features Indicators */}
          <div className="hidden sm:flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 rounded-full">
              <Mic className="w-3 h-3 text-primary" />
              <span className="text-primary font-medium">Voice</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 bg-chart-2/10 rounded-full">
              <Image className="w-3 h-3 text-chart-2" />
              <span className="text-chart-2 font-medium">Images</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 bg-chart-3/10 rounded-full">
              <Brain className="w-3 h-3 text-chart-3" />
              <span className="text-chart-3 font-medium">Mind Maps</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full pulse-animation" />
              <span>AI Online</span>
            </div>
            
            {/* Visual Panel Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVisualPanel(!showVisualPanel)}
              className={showVisualPanel ? 'bg-primary/10 text-primary' : ''}
            >
              <Eye className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">Visuals</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDashboardOpen(true)}
            >
              <Settings className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">Dashboard</span>
            </Button>
          </div>
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

        {/* Main Content - ChatGPT-like Layout */}
        <div className="flex-1 flex min-w-0">
          {/* Chat Interface - Full width when visual panel hidden */}
          <div className={`flex flex-col min-w-0 transition-all duration-300 ${
            showVisualPanel ? 'flex-1' : 'w-full'
          }`}>
            <ChatInterface
              conversationId={currentConversationId}
              currentUserId={currentUserId}
            />
          </div>

          {/* Collapsible Visual Panel */}
          {showVisualPanel && (
            <div className="w-96 border-l border-border bg-card/50 backdrop-blur-sm transition-all duration-300">
              <VisualPanel
                currentImage={latestImageMessage?.imageUrl}
                currentMindMap={latestMindMapMessage?.mindMapData}
                onClose={() => setShowVisualPanel(false)}
              />
            </div>
          )}
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
