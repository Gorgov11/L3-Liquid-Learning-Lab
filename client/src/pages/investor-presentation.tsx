
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Target, Users, Globe, Zap, BookOpen, Star, TrendingUp, Award } from 'lucide-react';

export default function InvestorPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "L³ - Liquid Learning Lab",
      subtitle: "Norway's First AI-Powered Educational Experience Platform",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl font-bold">L³</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The Future of Learning is Liquid
            </h2>
          </div>
          <p className="text-xl text-center text-muted-foreground">
            Revolutionizing education with AI-powered visual learning, personalized paths, and interactive mind maps
          </p>
        </div>
      )
    },
    {
      title: "Market Opportunity",
      content: (
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <h3 className="text-2xl font-bold mb-4">Norwegian Market</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>First AI education platform in Norway</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>5.4M potential users</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-green-500" />
                <span>Leading digital education adoption</span>
              </li>
            </ul>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <h3 className="text-2xl font-bold mb-4">Global Potential</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span>$342B EdTech market by 2025</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>17.8% CAGR growth</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-red-500" />
                <span>First-mover advantage in visual AI learning</span>
              </li>
            </ul>
          </Card>
        </div>
      )
    },
    {
      title: "Unique Features",
      content: (
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-blue-50 dark:bg-blue-950/30">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold">AI Visual Tutor</h3>
            </div>
            <p className="text-sm">Interactive AI that generates visual aids and mind maps in real-time</p>
          </Card>
          
          <Card className="p-4 bg-purple-50 dark:bg-purple-950/30">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold">Learning Paths</h3>
            </div>
            <p className="text-sm">Personalized learning journeys with adaptive difficulty</p>
          </Card>
          
          <Card className="p-4 bg-green-50 dark:bg-green-950/30">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold">Study Groups</h3>
            </div>
            <p className="text-sm">Collaborative learning with AI-facilitated group sessions</p>
          </Card>
        </div>
      )
    },
    {
      title: "Competitive Advantages",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 border-2 border-primary">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-primary" />
                VS Traditional E-learning
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Badge>✓</Badge>
                  <span>Real-time visual learning aids</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Badge>✓</Badge>
                  <span>Interactive mind mapping</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Badge>✓</Badge>
                  <span>AI-powered personalization</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6 border-2 border-primary">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-primary" />
                VS ChatGPT
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Badge>✓</Badge>
                  <span>Education-specific AI model</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Badge>✓</Badge>
                  <span>Progress tracking & analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Badge>✓</Badge>
                  <span>Collaborative learning features</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Growth Strategy",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
              <h3 className="font-bold mb-2">Phase 1: Norway</h3>
              <ul className="text-sm space-y-2">
                <li>• Launch in major cities</li>
                <li>• Partner with universities</li>
                <li>• Build brand awareness</li>
              </ul>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30">
              <h3 className="font-bold mb-2">Phase 2: Nordics</h3>
              <ul className="text-sm space-y-2">
                <li>• Expand to Sweden & Denmark</li>
                <li>• Localize content</li>
                <li>• Strategic partnerships</li>
              </ul>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30">
              <h3 className="font-bold mb-2">Phase 3: Europe</h3>
              <ul className="text-sm space-y-2">
                <li>• EU market entry</li>
                <li>• Enterprise solutions</li>
                <li>• AI model expansion</li>
              </ul>
            </Card>
          </div>
          
          <div className="text-center">
            <p className="text-xl font-semibold text-primary">
              Projected user growth: 100K → 1M → 5M
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation Dots */}
        <div className="fixed top-1/2 right-8 transform -translate-y-1/2 space-y-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? 'bg-primary scale-125'
                  : 'bg-muted hover:bg-primary/50'
              }`}
            />
          ))}
        </div>

        {/* Current Slide */}
        <div className="min-h-[80vh] flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">{slides[currentSlide].title}</h1>
            {slides[currentSlide].subtitle && (
              <p className="text-xl text-muted-foreground mt-2">
                {slides[currentSlide].subtitle}
              </p>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            {slides[currentSlide].content}
          </div>
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
