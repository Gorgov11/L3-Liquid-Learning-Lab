import React from 'react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating Geometric Shapes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" fill="none">
        {/* Animated Circles */}
        <circle
          cx="150"
          cy="200"
          r="60"
          fill="url(#gradient1)"
          opacity="0.1"
          className="animate-float"
        />
        <circle
          cx="850"
          cy="300"
          r="40"
          fill="url(#gradient2)"
          opacity="0.15"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <circle
          cx="300"
          cy="800"
          r="80"
          fill="url(#gradient3)"
          opacity="0.08"
          className="animate-bounce-in"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Animated Hexagons */}
        <polygon
          points="500,100 560,140 560,220 500,260 440,220 440,140"
          fill="url(#gradient4)"
          opacity="0.1"
          className="animate-rotate-pulse"
        />
        <polygon
          points="750,500 810,540 810,620 750,660 690,620 690,540"
          fill="url(#gradient5)"
          opacity="0.12"
          className="animate-float"
          style={{ animationDelay: '1.5s' }}
        />
        
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Particle Effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}