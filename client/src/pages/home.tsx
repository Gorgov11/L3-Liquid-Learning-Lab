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
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-chart-2 to-chart-3 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <div className="relative">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 32 32" 
                  className="text-primary-foreground"
                >
                  {/* Animated L3 Logo */}
                  <defs>
                    <linearGradient id="l3-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
                      <stop offset="50%" stopColor="currentColor" stopOpacity="1"/>
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.8"/>
                    </linearGradient>
                    <filter id="glow-effect">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* First L */}
                  <path 
                    d="M4 4 L4 24 L12 24 L12 20 L8 20 L8 4 Z" 
                    fill="url(#l3-gradient)"
                    filter="url(#glow-effect)"
                    className="animate-pulse"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="1;1.1;1"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>
                  
                  {/* Stylized 3 */}
                  <path 
                    d="M14 4 L24 4 L24 8 L18 8 L22 12 L24 12 L24 16 L18 16 L22 20 L24 20 L24 24 L14 24 L14 20 L20 20 L16 16 L14 16 L14 12 L20 12 L16 8 L14 8 Z" 
                    fill="url(#l3-gradient)"
                    filter="url(#glow-effect)"
                    className="animate-bounce"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0 19 14;5 19 14;0 19 14"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                  
                  {/* Liquid drops animation */}
                  <circle cx="6" cy="2" r="1" fill="currentColor" opacity="0.6">
                    <animate attributeName="cy" values="2;26;2" dur="1.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                  
                  <circle cx="20" cy="2" r="1" fill="currentColor" opacity="0.4">
                    <animate attributeName="cy" values="2;26;2" dur="2s" repeatCount="indefinite" begin="0.3s"/>
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" begin="0.3s"/>
                  </circle>
                  
                  <circle cx="26" cy="2" r="1" fill="currentColor" opacity="0.5">
                    <animate attributeName="cy" values="2;26;2" dur="1.8s" repeatCount="indefinite" begin="0.6s"/>
                    <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1.8s" repeatCount="indefinite" begin="0.6s"/>
                  </circle>
                </svg>
              </div>
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
