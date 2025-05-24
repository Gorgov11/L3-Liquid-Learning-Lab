import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';

interface VoiceControlPanelProps {
  isVisible: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
}

export function VoiceControlPanel({
  isVisible,
  isSpeaking,
  isPaused,
  currentTime,
  duration,
  volume,
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
  onSeek
}: VoiceControlPanelProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!isVisible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
      <Card className="bg-card/95 backdrop-blur-sm border border-border shadow-xl p-4 min-w-80">
        <div className="space-y-3">
          {/* Voice Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">AI Voice Playing</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="relative">
              <div className="w-full h-2 bg-muted rounded-full">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-3">
            {/* Play/Pause */}
            <Button
              size="sm"
              onClick={isPaused ? onPlay : onPause}
              className="h-10 w-10 rounded-full p-0"
            >
              {isPaused ? (
                <Play className="w-4 h-4 ml-0.5" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </Button>

            {/* Stop */}
            <Button
              size="sm"
              variant="outline"
              onClick={onStop}
              className="h-10 w-10 rounded-full p-0"
            >
              <Square className="w-3 h-3" />
            </Button>

            {/* Volume Control */}
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="h-10 w-10 rounded-full p-0"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>

              {/* Volume Slider */}
              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-card border border-border rounded-lg p-3 shadow-lg min-w-32">
                  <div className="flex items-center space-x-2">
                    <VolumeX className="w-3 h-3 text-muted-foreground" />
                    <Slider
                      value={[volume * 100]}
                      onValueChange={(value) => onVolumeChange(value[0] / 100)}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <Volume2 className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div className="text-center text-xs text-muted-foreground mt-1">
                    {Math.round(volume * 100)}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSeek(Math.max(0, currentTime - 10))}
              className="text-xs h-6 px-2"
            >
              -10s
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onVolumeChange(0.5)}
              className="text-xs h-6 px-2"
            >
              50%
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSeek(Math.min(duration, currentTime + 10))}
              className="text-xs h-6 px-2"
            >
              +10s
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}