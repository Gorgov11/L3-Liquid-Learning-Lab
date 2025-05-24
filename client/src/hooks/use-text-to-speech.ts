import { useState, useCallback, useRef } from 'react';

interface UseTextToSpeechReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  error: string | null;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        setError('Failed to play AI voice');
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audioRef.current = audio;
      await audio.play();
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
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
    }
  }, []);

  return {
    isSupported,
    isSpeaking,
    speak,
    stop,
    pause,
    resume,
    error
  };
}
