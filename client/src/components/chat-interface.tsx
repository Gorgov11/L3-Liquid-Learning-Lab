import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Send, Bot, User, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ChatMessage } from '@/lib/types';

interface ChatInterfaceProps {
  conversationId: number | null;
  currentUserId: string;
}

export function ChatInterface({ conversationId, currentUserId }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const {
    isSupported: speechSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError
  } = useSpeechRecognition();

  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();

  // Fetch messages for current conversation
  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: [`/api/conversations/${conversationId}/messages`],
    enabled: !!conversationId,
    refetchInterval: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      content, 
      generateImage = false, 
      generateMindMap = false 
    }: { 
      content: string; 
      generateImage?: boolean; 
      generateMindMap?: boolean; 
    }) => {
      if (!conversationId) throw new Error('No active conversation');
      
      const response = await apiRequest('POST', `/api/conversations/${conversationId}/messages`, {
        content,
        generateImage,
        generateMindMap,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${conversationId}/messages`] });
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${currentUserId}`] });
      
      // Speak the AI response
      if (data.aiMessage?.content) {
        speak(data.aiMessage.content);
      }
    },
  });

  // Handle voice input
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId) return;

    const messageContent = message.trim();
    setMessage('');
    resetTranscript();

    // Check if user wants visual aids
    const lowerContent = messageContent.toLowerCase();
    const wantsImage = lowerContent.includes('image') || lowerContent.includes('picture') || lowerContent.includes('diagram') || lowerContent.includes('show me');
    const wantsMindMap = lowerContent.includes('mind map') || lowerContent.includes('mindmap') || lowerContent.includes('structure') || lowerContent.includes('organize');

    if (wantsImage) setIsGeneratingImage(true);
    if (wantsMindMap) setIsGeneratingMindMap(true);

    try {
      await sendMessageMutation.mutateAsync({
        content: messageContent,
        generateImage: wantsImage,
        generateMindMap: wantsMindMap,
      });
    } finally {
      setIsGeneratingImage(false);
      setIsGeneratingMindMap(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const welcomeMessage: ChatMessage = {
    id: 0,
    role: 'assistant',
    content: `Welcome to Liquid Learning Lab! I'm your AI visual tutor, ready to help you explore any topic through interactive conversations and dynamic visualizations.

Try asking me to:
• Explain complex concepts with visual aids
• Generate mind maps for better understanding  
• Create educational images and diagrams
• Answer questions about your learning interests`,
    createdAt: new Date(),
  };

  const displayMessages = conversationId && messages.length > 0 ? messages : [welcomeMessage];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <h2 className="font-semibold text-lg">AI Learning Session</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions, request visualizations, or explore topics
        </p>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading messages...</span>
            </div>
          ) : (
            displayMessages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble p-4 ${
                  msg.role === 'user' ? 'user-bubble' : 'ai-bubble'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-primary to-chart-2' 
                      : 'bg-gradient-to-br from-chart-2 to-primary'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.imageUrl && (
                      <div className="mt-3">
                        <img 
                          src={msg.imageUrl} 
                          alt="AI-generated visual aid" 
                          className="max-w-full h-auto rounded-lg border border-border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading indicators */}
          {sendMessageMutation.isPending && (
            <div className="ai-bubble chat-bubble p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-chart-2 to-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {isGeneratingImage && (
            <div className="text-center text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Generating educational image...
            </div>
          )}

          {isGeneratingMindMap && (
            <div className="text-center text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Creating mind map...
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-6">
        <div className="flex items-center space-x-4">
          {speechSupported && (
            <Button
              size="lg"
              className={`flex-shrink-0 w-12 h-12 rounded-full ${
                isListening 
                  ? 'bg-destructive hover:bg-destructive voice-recording' 
                  : 'bg-gradient-to-br from-primary to-chart-2 hover:opacity-90'
              }`}
              onClick={toggleVoiceRecording}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          )}

          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Type your question or use voice input..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pr-12"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0"
              onClick={handleSendMessage}
              disabled={!message.trim() || !conversationId || sendMessageMutation.isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Voice feedback */}
        {isListening && (
          <div className="mt-3 flex items-center space-x-2 text-destructive text-sm">
            <div className="w-3 h-3 bg-destructive rounded-full pulse-animation" />
            <span>Recording... <span className="loading-dots"></span></span>
          </div>
        )}

        {speechError && (
          <div className="mt-2 text-sm text-destructive">
            {speechError}
          </div>
        )}

        {isSpeaking && (
          <div className="mt-2 flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={stopSpeaking}
            >
              Stop Speaking
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
