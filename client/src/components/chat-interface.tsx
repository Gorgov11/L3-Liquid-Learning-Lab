import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Send, Bot, User, Loader2, Brain, BookOpen, ImageIcon } from 'lucide-react';
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

    // Always generate visuals automatically for educational content
    setIsGeneratingImage(true);
    setIsGeneratingMindMap(true);

    try {
      await sendMessageMutation.mutateAsync({
        content: messageContent,
        generateImage: true, // Always generate image
        generateMindMap: true, // Always generate mind map
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
    <div className="flex flex-col h-full bg-background">
      {/* Minimal Chat Header - ChatGPT style */}
      {conversationId && messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary via-chart-2 to-chart-3 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">What can I help with?</h2>
              <p className="text-muted-foreground mb-6">
                I'm your AI visual tutor. Ask me anything and I'll explain it with images, mind maps, and interactive content.
              </p>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <Button 
                variant="outline" 
                className="p-6 h-auto text-left space-y-2"
                onClick={() => setMessage("Explain photosynthesis with an image")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">🖼️ Create an image</div>
                    <div className="text-sm text-muted-foreground">Visual explanations</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="p-6 h-auto text-left space-y-2"
                onClick={() => setMessage("Create a mind map of the solar system")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-chart-3/10 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-chart-3" />
                  </div>
                  <div>
                    <div className="font-medium">🧠 Make a mind map</div>
                    <div className="text-sm text-muted-foreground">Organize knowledge</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="p-6 h-auto text-left space-y-2"
                onClick={() => setMessage("Teach me about quantum physics")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-chart-2/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-chart-2" />
                  </div>
                  <div>
                    <div className="font-medium">📚 Explain a topic</div>
                    <div className="text-sm text-muted-foreground">Deep dive learning</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="p-6 h-auto text-left space-y-2"
                onClick={() => {
                  if (speechSupported) {
                    toggleVoiceRecording();
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <Mic className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <div className="font-medium">🗣️ Use voice input</div>
                    <div className="text-sm text-muted-foreground">Talk to learn</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages - Only show when there are messages */}
      {messages.length > 0 && (
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading messages...</span>
              </div>
            ) : (
              messages.map((msg) => (
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
      )}

      {/* Input Area - ChatGPT Style - Fixed positioning */}
      <div className="bg-background border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 bg-card rounded-2xl p-3 border border-border">
            {/* Voice Button */}
            {speechSupported && (
              <Button
                size="sm"
                variant="ghost"
                className={`flex-shrink-0 w-10 h-10 rounded-full ${
                  isListening 
                    ? 'bg-destructive text-destructive-foreground voice-recording' 
                    : 'hover:bg-muted'
                }`}
                onClick={toggleVoiceRecording}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Message Input */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Message Liquid Learning Lab..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                disabled={sendMessageMutation.isPending}
              />
            </div>

            {/* Send Button */}
            <Button
              size="sm"
              className="flex-shrink-0 w-10 h-10 rounded-full bg-primary hover:bg-primary/90"
              onClick={handleSendMessage}
              disabled={!message.trim() || !conversationId || sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Voice feedback */}
          {isListening && (
            <div className="mt-3 flex items-center justify-center space-x-2 text-destructive text-sm">
              <div className="w-2 h-2 bg-destructive rounded-full pulse-animation" />
              <span>Listening... speak your question</span>
            </div>
          )}

          {speechError && (
            <div className="mt-2 text-center text-sm text-destructive">
              {speechError}
            </div>
          )}

          {isSpeaking && (
            <div className="mt-2 flex items-center justify-center">
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
    </div>
  );
}
