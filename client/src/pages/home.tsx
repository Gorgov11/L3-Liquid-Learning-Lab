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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/30 to-cyan-400/20 rounded-xl animate-pulse"></div>
              <div className="relative z-10">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 40 40" 
                  className="text-white"
                >
                  <defs>
                    {/* Animated Gradient */}
                    <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA">
                        <animate attributeName="stop-color" values="#60A5FA;#A855F7;#06B6D4;#60A5FA" dur="3s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="50%" stopColor="#A855F7">
                        <animate attributeName="stop-color" values="#A855F7;#06B6D4;#60A5FA;#A855F7" dur="3s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="100%" stopColor="#06B6D4">
                        <animate attributeName="stop-color" values="#06B6D4;#60A5FA;#A855F7;#06B6D4" dur="3s" repeatCount="indefinite"/>
                      </stop>
                    </linearGradient>

                    {/* Glowing Effect */}
                    <filter id="neural-glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>

                    {/* Liquid Wave Pattern */}
                    <pattern id="wave-pattern" x="0" y="0" width="40" height="8" patternUnits="userSpaceOnUse">
                      <path d="M0,4 Q10,0 20,4 T40,4 V8 H0 Z" fill="url(#brain-gradient)" opacity="0.3">
                        <animateTransform attributeName="transform" type="translate" values="0,0;-40,0;0,0" dur="4s" repeatCount="indefinite"/>
                      </path>
                    </pattern>
                  </defs>

                  {/* Background Liquid Effect */}
                  <rect x="0" y="0" width="40" height="40" fill="url(#wave-pattern)" opacity="0.2" rx="8"/>

                  {/* Neural Network Style Logo */}
                  
                  {/* Central Node - representing "Lab" */}
                  <circle cx="20" cy="20" r="4" fill="url(#brain-gradient)" filter="url(#neural-glow)">
                    <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite"/>
                  </circle>

                  {/* Left Node - "L" for Liquid */}
                  <circle cx="8" cy="12" r="2.5" fill="url(#brain-gradient)" filter="url(#neural-glow)">
                    <animate attributeName="r" values="2.5;3.2;2.5" dur="2.5s" repeatCount="indefinite" begin="0.3s"/>
                  </circle>

                  {/* Right Node - "L" for Learning */}
                  <circle cx="32" cy="12" r="2.5" fill="url(#brain-gradient)" filter="url(#neural-glow)">
                    <animate attributeName="r" values="2.5;3.2;2.5" dur="2.5s" repeatCount="indefinite" begin="0.6s"/>
                  </circle>

                  {/* Bottom Left - Knowledge */}
                  <circle cx="10" cy="30" r="2" fill="url(#brain-gradient)" filter="url(#neural-glow)">
                    <animate attributeName="r" values="2;2.8;2" dur="3s" repeatCount="indefinite" begin="0.9s"/>
                  </circle>

                  {/* Bottom Right - Intelligence */}
                  <circle cx="30" cy="30" r="2" fill="url(#brain-gradient)" filter="url(#neural-glow)">
                    <animate attributeName="r" values="2;2.8;2" dur="3s" repeatCount="indefinite" begin="1.2s"/>
                  </circle>

                  {/* Connecting Lines - Neural Pathways */}
                  <g stroke="url(#brain-gradient)" strokeWidth="1.5" fill="none" opacity="0.8">
                    {/* From center to all nodes */}
                    <line x1="20" y1="20" x2="8" y2="12">
                      <animate attributeName="stroke-dasharray" values="0,50;25,25;50,0;0,50" dur="4s" repeatCount="indefinite"/>
                    </line>
                    <line x1="20" y1="20" x2="32" y2="12">
                      <animate attributeName="stroke-dasharray" values="0,50;25,25;50,0;0,50" dur="4s" repeatCount="indefinite" begin="0.5s"/>
                    </line>
                    <line x1="20" y1="20" x2="10" y2="30">
                      <animate attributeName="stroke-dasharray" values="0,50;25,25;50,0;0,50" dur="4s" repeatCount="indefinite" begin="1s"/>
                    </line>
                    <line x1="20" y1="20" x2="30" y2="30">
                      <animate attributeName="stroke-dasharray" values="0,50;25,25;50,0;0,50" dur="4s" repeatCount="indefinite" begin="1.5s"/>
                    </line>
                    
                    {/* Cross connections */}
                    <line x1="8" y1="12" x2="32" y2="12" opacity="0.4">
                      <animate attributeName="stroke-dasharray" values="0,50;25,25;50,0;0,50" dur="5s" repeatCount="indefinite" begin="2s"/>
                    </line>
                    <line x1="10" y1="30" x2="30" y2="30" opacity="0.4">
                      <animate attributeName="stroke-dasharray" values="0,50;25,25;50,0;0,50" dur="5s" repeatCount="indefinite" begin="2.5s"/>
                    </line>
                  </g>

                  {/* Floating Particles - representing "Liquid" learning */}
                  <circle cx="15" cy="8" r="1" fill="white" opacity="0.6">
                    <animateTransform attributeName="transform" type="translate" values="0,0;5,-3;0,0" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  
                  <circle cx="25" cy="35" r="0.8" fill="white" opacity="0.5">
                    <animateTransform attributeName="transform" type="translate" values="0,0;-3,-5;0,0" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite"/>
                  </circle>

                  <circle cx="35" cy="25" r="0.6" fill="white" opacity="0.7">
                    <animateTransform attributeName="transform" type="translate" values="0,0;-2,3;0,0" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite"/>
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
