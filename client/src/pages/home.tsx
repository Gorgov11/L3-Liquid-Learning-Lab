import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Menu, GraduationCap, Brain, Eye, Mic, Image } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { VisualPanel } from '@/components/visual-panel';
import { DashboardModal } from '@/components/dashboard-modal-new';
import { KnowledgeTestModal } from '@/components/knowledge-test-modal';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ChatMessage, ConversationData } from '@/lib/types';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [currentUserId] = useState('user-1'); // Simplified user management
  const [showVisualPanel, setShowVisualPanel] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testData, setTestData] = useState(null);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
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
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left side - Menu and Logo */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">L³</span>
              </div>
              <span className="font-semibold text-foreground hidden sm:block">Liquid Learning Lab</span>
            </div>
          </div>

          {/* Center - Generate Test Button */}
          <div className="flex-1 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 hover:from-primary/20 hover:to-purple-500/20 transition-all duration-200"
              onClick={async () => {
                try {
                  const response = await fetch('/api/generate-knowledge-test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUserId }),
                  });
                  
                  if (response.ok) {
                    const testData = await response.json();
                    console.log('Knowledge test generated:', testData);
                  }
                } catch (error) {
                  console.error('Failed to generate test:', error);
                }
              }}
            >
              <Brain className="w-4 h-4 mr-2" />
              Generate Test
            </Button>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVisualPanel(!showVisualPanel)}
              className={`p-2 ${showVisualPanel ? 'bg-primary/10 text-primary' : ''}`}
              title="Toggle Visual Panel"
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDashboardOpen(true)}
              className="p-2"
              title="Open Dashboard"
            >
              <Settings className="w-4 h-4" />
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
