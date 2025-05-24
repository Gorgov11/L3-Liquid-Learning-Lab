import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useLocation } from 'wouter';

interface BackNavigationProps {
  title?: string;
  showHomeButton?: boolean;
  customBackPath?: string;
  className?: string;
}

export function BackNavigation({ 
  title = "Back to Chat", 
  showHomeButton = false, 
  customBackPath = "/",
  className = ""
}: BackNavigationProps) {
  const [, setLocation] = useLocation();

  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setLocation(customBackPath)}
        className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-200 svg-animate"
      >
        <ArrowLeft className="w-4 h-4 svg-pulse" />
        {title}
      </Button>
      
      {showHomeButton && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-200 svg-animate"
        >
          <Home className="w-4 h-4 svg-bounce" />
          Home
        </Button>
      )}
    </div>
  );
}