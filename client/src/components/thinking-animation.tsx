import React from 'react';
import { Bot, Brain, Sparkles } from 'lucide-react';

export function ThinkingAnimation() {
  return (
    <div className="flex justify-start mb-4 animate-slide-up">
      <div className="max-w-[70%] ai-bubble chat-bubble message-bubble p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-gradient-to-br from-chart-2 to-primary text-primary-foreground gradient-animation animate-pulse-glow">
            <Bot className="w-4 h-4 svg-animate" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-primary animate-rotate-pulse" />
              <span className="text-sm font-medium text-muted-foreground animate-typing">
                AI is thinking...
              </span>
              <Sparkles className="w-4 h-4 text-primary animate-float" />
            </div>
            
            {/* Animated Thinking Dots */}
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s',
                  }}
                />
              ))}
            </div>
            
            {/* Processing Animation */}
            <div className="mt-3 relative">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-chart-2 rounded-full animate-shimmer" />
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center space-x-2">
                <span>Processing your question</span>
                <svg
                  className="w-3 h-3 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="32"
                    strokeDashoffset="32"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    className="opacity-75"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 text-muted-foreground">
      <Bot className="w-4 h-4 animate-pulse" />
      <span className="text-sm">AI is typing</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.3}s`,
              animationDuration: '0.8s',
            }}
          />
        ))}
      </div>
    </div>
  );
}