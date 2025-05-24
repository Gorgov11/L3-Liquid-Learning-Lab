import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, MicOff, Send, Bot, User, Loader2, Brain, BookOpen, ImageIcon, Volume2, VolumeX, Tag, Sparkles, HelpCircle, Settings } from 'lucide-react';
import { SettingsModal } from './settings-modal';
import { DynamicVisualPanel } from './dynamic-visual-panel';
import { VoiceControlPanel } from './voice-control-panel';
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
  const [showHelp, setShowHelp] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  // Feature toggle states
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState(true);
  const [autoImageEnabled, setAutoImageEnabled] = useState(true);
  const [autoMindMapEnabled, setAutoMindMapEnabled] = useState(true);
  const [addEmojisEnabled, setAddEmojisEnabled] = useState(true);
  const [learningCategory, setLearningCategory] = useState('general');

  const {
    isSupported: speechSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError
  } = useSpeechRecognition();

  const { 
    speak, 
    stop: stopSpeaking, 
    pause: pauseSpeaking, 
    resume: resumeSpeaking, 
    isSpeaking, 
    isPaused, 
    currentTime, 
    duration, 
    volume, 
    setVolume, 
    seekTo 
  } = useTextToSpeech();

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
      
      // Auto-speak AI response if enabled
      if (autoVoiceEnabled && data.aiMessage?.content) {
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

    // Generate visuals based on user preferences
    if (autoImageEnabled) setIsGeneratingImage(true);
    if (autoMindMapEnabled) setIsGeneratingMindMap(true);

    try {
      await sendMessageMutation.mutateAsync({
        content: messageContent,
        generateImage: autoImageEnabled,
        generateMindMap: autoMindMapEnabled,

        learningCategory: learningCategory,
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

      {/* Feature Control Panel - Below Input */}
      <div className="bg-card border-t border-border p-2">
        <div className="max-w-4xl mx-auto">
          <TooltipProvider>
            <div className="flex items-center justify-center gap-1">
              
              {/* Voice Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={autoVoiceEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoVoiceEnabled(!autoVoiceEnabled)}
                    className={`h-8 w-8 p-0 rounded-full feature-button icon-hover transition-all duration-300 ${
                      autoVoiceEnabled ? 'animate-pulse-glow' : ''
                    }`}
                  >
                    {autoVoiceEnabled ? (
                      <Volume2 className="w-4 h-4 svg-animate" />
                    ) : (
                      <VolumeX className="w-4 h-4 svg-animate opacity-60" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {autoVoiceEnabled ? "Auto Voice: ON" : "Auto Voice: OFF"}
                    <br />
                    <span className="text-muted-foreground">AI will read responses aloud</span>
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Image Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={autoImageEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoImageEnabled(!autoImageEnabled)}
                    className={`h-8 w-8 p-0 rounded-full feature-button icon-hover transition-all duration-300 ${
                      autoImageEnabled ? 'animate-float' : ''
                    }`}
                  >
                    <ImageIcon className={`w-4 h-4 svg-animate ${autoImageEnabled ? '' : 'opacity-60'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {autoImageEnabled ? "Auto Images: ON" : "Auto Images: OFF"}
                    <br />
                    <span className="text-muted-foreground">Generate visual aids automatically</span>
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Mind Map Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={autoMindMapEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoMindMapEnabled(!autoMindMapEnabled)}
                    className={`h-8 w-8 p-0 rounded-full feature-button icon-hover transition-all duration-300 ${
                      autoMindMapEnabled ? 'animate-rotate-pulse' : ''
                    }`}
                  >
                    <Brain className={`w-4 h-4 svg-animate ${autoMindMapEnabled ? '' : 'opacity-60'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {autoMindMapEnabled ? "Mind Maps: ON" : "Mind Maps: OFF"}
                    <br />
                    <span className="text-muted-foreground">Create interactive mind maps</span>
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Emoji Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={addEmojisEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAddEmojisEnabled(!addEmojisEnabled)}
                    className={`h-8 w-8 p-0 rounded-full feature-button icon-hover transition-all duration-300 ripple ${
                      addEmojisEnabled ? 'animate-bounce-in' : ''
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 svg-animate ${addEmojisEnabled ? '' : 'opacity-60'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {addEmojisEnabled ? "Emojis: ON" : "Emojis: OFF"}
                    <br />
                    <span className="text-muted-foreground">Add emojis to responses</span>
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Divider */}
              <div className="w-px h-6 bg-border mx-2" />

              {/* Learning Category */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <select 
                      value={learningCategory}
                      onChange={(e) => setLearningCategory(e.target.value)}
                      className="h-8 w-8 appearance-none bg-background border border-border rounded-full text-center text-xs focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <option value="general">📚</option>
                      <option value="science">🔬</option>
                      <option value="math">📐</option>
                      <option value="history">🏛️</option>
                      <option value="language">🗣️</option>
                      <option value="programming">💻</option>
                      <option value="art">🎨</option>
                    </select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Learning Category
                    <br />
                    <span className="text-muted-foreground">
                      {learningCategory === 'general' && 'General Learning'}
                      {learningCategory === 'science' && 'Science & Biology'}
                      {learningCategory === 'math' && 'Mathematics'}
                      {learningCategory === 'history' && 'History'}
                      {learningCategory === 'language' && 'Language Arts'}
                      {learningCategory === 'programming' && 'Programming'}
                      {learningCategory === 'art' && 'Art & Design'}
                    </span>
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Settings */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <SettingsModal
                      autoVoiceEnabled={autoVoiceEnabled}
                      setAutoVoiceEnabled={setAutoVoiceEnabled}
                      autoImageEnabled={autoImageEnabled}
                      setAutoImageEnabled={setAutoImageEnabled}
                      autoMindMapEnabled={autoMindMapEnabled}
                      setAutoMindMapEnabled={setAutoMindMapEnabled}
                      addEmojisEnabled={addEmojisEnabled}
                      setAddEmojisEnabled={setAddEmojisEnabled}
                      learningCategory={learningCategory}
                      setLearningCategory={setLearningCategory}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Advanced Settings
                    <br />
                    <span className="text-muted-foreground">Configure voice speed, image styles, etc.</span>
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Help */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHelp(!showHelp)}
                    className={`h-8 w-8 p-0 rounded-full feature-button icon-hover transition-all duration-300 ${
                      showHelp ? 'animate-pulse-glow' : ''
                    }`}
                  >
                    <HelpCircle className={`w-4 h-4 svg-animate ${showHelp ? 'animate-rotate-pulse' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Help & Tutorial
                    <br />
                    <span className="text-muted-foreground">Learn how to use all features</span>
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Help Panel */}
          {showHelp && (
            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 animate-in slide-in-from-top duration-300">
              <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                How to Use Liquid Learning Lab
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-800 dark:text-blue-200">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Volume2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Auto Voice:</strong> AI reads responses aloud automatically. Use voice controls to pause/resume.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ImageIcon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Auto Images:</strong> Generate visual aids for better understanding. Click to download or zoom.
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Brain className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Mind Maps:</strong> Interactive topic maps you can click to explore deeper.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Emojis:</strong> Add relevant emojis to make learning more engaging and fun.
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  💡 <strong>Tip:</strong> Hover over any icon to see what it does. Use the category selector to organize your learning sessions by subject.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Voice Control Panel */}
      <VoiceControlPanel
        isVisible={isSpeaking || isPaused}
        isSpeaking={isSpeaking}
        isPaused={isPaused}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onPlay={resumeSpeaking}
        onPause={pauseSpeaking}
        onStop={stopSpeaking}
        onVolumeChange={setVolume}
        onSeek={seekTo}
      />
    </div>
  );
}
