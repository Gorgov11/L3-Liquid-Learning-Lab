import { useState, useCallback, useRef } from 'react';

interface UseTextToSpeechReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  error: string | null;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported = true; // AI voice is always supported

  const speak = useCallback(async (text: string) => {
    try {
      // Stop any current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      setIsSpeaking(true);
      setError(null);

      // Generate high-quality AI voice using OpenAI API
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.volume = volume;
      
      // Real-time progress tracking
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      audio.onended = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentTime(0);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setError('Failed to play AI voice');
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      audioRef.current = audio;
      await audio.play();
      setIsPaused(false);
    } catch (err) {
      setError(`AI voice generation failed: ${err}`);
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentTime(0);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPaused(false);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    currentTime,
    duration,
    volume,
    speak,
    stop,
    pause,
    resume,
    setVolume,
    seekTo,
    error
  };
}
