import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, MicOff, Send, Bot, User, Loader2, Brain, BookOpen, ImageIcon, Volume2, VolumeX, Tag, Sparkles, HelpCircle, Settings } from 'lucide-react';
import { SettingsModal } from './settings-modal';
import { DynamicVisualPanel } from './dynamic-visual-panel';
import { VoiceControlPanel } from './voice-control-panel';
import { InteractiveMindMap } from './interactive-mindmap';
import { ThinkingAnimation } from './thinking-animation';
import { AnimatedBackground } from './animated-background';
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
                    
                    {/* Enhanced Interactive Mind Map - Prominently displayed */}
                    {msg.mindMapData && (
                      <div className="mt-4 animate-slide-up">
                        <InteractiveMindMap 
                          data={msg.mindMapData} 
                          className="w-full"
                        />
                      </div>
                    )}
                    
                    {msg.imageUrl && (
                      <div className="mt-3 animate-slide-up">
                        <img 
                          src={msg.imageUrl} 
                          alt="AI-generated visual aid" 
                          className="max-w-full h-auto rounded-lg border border-border hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Enhanced Loading Animation */}
          {sendMessageMutation.isPending && <ThinkingAnimation />}

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

      {/* Smart Feature Control Panel */}
      <div className="bg-gradient-to-r from-card via-card/95 to-card border-t border-border/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <TooltipProvider>
            <div className="flex items-center justify-between">
              
              {/* Left: AI Features Group */}
              <div className="flex items-center gap-2">
                <div className="text-xs font-medium text-muted-foreground mr-2">AI Features</div>
                
                {/* Voice Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={autoVoiceEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAutoVoiceEnabled(!autoVoiceEnabled)}
                      className={`h-9 w-9 p-0 rounded-xl transition-all duration-300 ${
                        autoVoiceEnabled 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 animate-pulse-glow' 
                          : 'hover:bg-muted/80 hover:scale-105'
                      }`}
                    >
                      {autoVoiceEnabled ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4 opacity-60" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="text-center">
                      <p className="font-medium text-sm">Voice Assistant</p>
                      <p className="text-xs text-muted-foreground">
                        {autoVoiceEnabled ? "✅ Auto-reading enabled" : "❌ Voice disabled"}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>

                {/* Visual Features Group */}
                <div className="flex items-center gap-1 px-2 py-1 bg-muted/30 rounded-lg">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAutoImageEnabled(!autoImageEnabled)}
                        className={`h-7 w-7 p-0 rounded-lg transition-all duration-300 ${
                          autoImageEnabled 
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' 
                            : 'hover:bg-background/80'
                        }`}
                      >
                        <ImageIcon className={`w-3.5 h-3.5 ${autoImageEnabled ? '' : 'opacity-50'}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">
                        <span className="font-medium">Visual Aids</span>
                        <br />
                        {autoImageEnabled ? "✅ Auto-generate images" : "❌ Images disabled"}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAutoMindMapEnabled(!autoMindMapEnabled)}
                        className={`h-7 w-7 p-0 rounded-lg transition-all duration-300 ${
                          autoMindMapEnabled 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' 
                            : 'hover:bg-background/80'
                        }`}
                      >
                        <Brain className={`w-3.5 h-3.5 ${autoMindMapEnabled ? '' : 'opacity-50'}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">
                        <span className="font-medium">Mind Maps</span>
                        <br />
                        {autoMindMapEnabled ? "✅ Interactive maps" : "❌ Maps disabled"}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddEmojisEnabled(!addEmojisEnabled)}
                        className={`h-7 w-7 p-0 rounded-lg transition-all duration-300 ${
                          addEmojisEnabled 
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md' 
                            : 'hover:bg-background/80'
                        }`}
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${addEmojisEnabled ? '' : 'opacity-50'}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">
                        <span className="font-medium">Emojis</span>
                        <br />
                        {addEmojisEnabled ? "✅ Fun emojis added" : "❌ Plain text only"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Center: Learning Category Selector */}
              <div className="flex items-center gap-3">
                <div className="text-xs font-medium text-muted-foreground">Subject</div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group">
                      <select 
                        value={learningCategory}
                        onChange={(e) => setLearningCategory(e.target.value)}
                        className="h-10 w-16 appearance-none bg-gradient-to-r from-background to-muted/50 border border-border rounded-xl text-center text-lg hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all duration-200 group-hover:shadow-md"
                      >
                        <option value="general">📚</option>
                        <option value="science">🔬</option>
                        <option value="math">📐</option>
                        <option value="history">🏛️</option>
                        <option value="language">🗣️</option>
                        <option value="programming">💻</option>
                        <option value="art">🎨</option>
                      </select>
                      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground font-medium">
                        {learningCategory === 'general' && 'General'}
                        {learningCategory === 'science' && 'Science'}
                        {learningCategory === 'math' && 'Math'}
                        {learningCategory === 'history' && 'History'}
                        {learningCategory === 'language' && 'Language'}
                        {learningCategory === 'programming' && 'Code'}
                        {learningCategory === 'art' && 'Art'}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="text-center">
                      <p className="font-medium text-sm">Learning Category</p>
                      <p className="text-xs text-muted-foreground">
                        Current: {learningCategory === 'general' && 'General Learning'}
                        {learningCategory === 'science' && 'Science & Biology'}
                        {learningCategory === 'math' && 'Mathematics'}
                        {learningCategory === 'history' && 'History'}
                        {learningCategory === 'language' && 'Language Arts'}
                        {learningCategory === 'programming' && 'Programming'}
                        {learningCategory === 'art' && 'Art & Design'}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Right: Quick Actions */}
              <div className="flex items-center gap-2">
                <div className="text-xs font-medium text-muted-foreground mr-2">Quick Actions</div>
                
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
                  <TooltipContent side="top">
                    <p className="text-xs">
                      <span className="font-medium">Advanced Settings</span>
                      <br />
                      Configure voice, images, and more
                    </p>
                  </TooltipContent>
                </Tooltip>

                {/* Help Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHelp(!showHelp)}
                      className={`h-9 w-9 p-0 rounded-xl transition-all duration-300 ${
                        showHelp 
                          ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25' 
                          : 'hover:bg-muted/80 hover:scale-105'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">
                      <span className="font-medium">Help & Tutorial</span>
                      <br />
                      {showHelp ? "Hide tutorial" : "Show learning guide"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Enhanced Help Panel */}
            {showHelp && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50 animate-in slide-in-from-top duration-300 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-base text-blue-900 dark:text-blue-100 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Liquid Learning Lab Guide
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHelp(false)}
                    className="h-6 w-6 p-0 rounded-lg hover:bg-blue-200/50 dark:hover:bg-blue-800/50"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {/* AI Features */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 border-b border-blue-200 dark:border-blue-700 pb-1">🤖 AI Features</h4>
                    <div className="space-y-2 text-blue-700 dark:text-blue-300">
                      <div className="flex items-start gap-2">
                        <Volume2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                        <div>
                          <strong>Voice Assistant:</strong> AI reads all responses aloud with natural speech
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <ImageIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                        <div>
                          <strong>Visual Aids:</strong> Automatically generate diagrams and illustrations
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                        <div>
                          <strong>Mind Maps:</strong> Interactive topic exploration with clickable nodes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Learning Categories */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 border-b border-blue-200 dark:border-blue-700 pb-1">📚 Subject Categories</h4>
                    <div className="space-y-1 text-blue-700 dark:text-blue-300">
                      <div>🔬 <strong>Science:</strong> Physics, Chemistry, Biology</div>
                      <div>📐 <strong>Math:</strong> Algebra, Calculus, Geometry</div>
                      <div>🏛️ <strong>History:</strong> World events, civilizations</div>
                      <div>🗣️ <strong>Language:</strong> Grammar, literature, writing</div>
                      <div>💻 <strong>Programming:</strong> Code, algorithms, tech</div>
                      <div>🎨 <strong>Art:</strong> Design, creativity, aesthetics</div>
                    </div>
                  </div>

                  {/* Pro Tips */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 border-b border-blue-200 dark:border-blue-700 pb-1">💡 Pro Tips</h4>
                    <div className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                      <div>• Click mind map nodes to explore deeper</div>
                      <div>• Use voice controls to pause/resume audio</div>
                      <div>• Right-click images to download or zoom</div>
                      <div>• Switch subjects for specialized responses</div>
                      <div>• Enable all features for maximum learning</div>
                      <div>• Ask follow-up questions for clarification</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Try asking: "Explain quantum physics with visuals and mind maps"</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                      New to AI learning? Start here! 🚀
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </TooltipProvider>
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
