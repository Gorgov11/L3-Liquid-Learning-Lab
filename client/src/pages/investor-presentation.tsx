
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Sparkles, Target, Users, Globe, Zap, BookOpen, Star, TrendingUp, Award,
  MessageSquare, ImageIcon, Volume2, MapPin, Calendar, FileText, Gamepad2,
  Trophy, Shield, Rocket, Database, Smartphone, Cloud, BarChart3, Settings,
  HeadphonesIcon, Mic, Eye, CheckCircle, PlayCircle, GraduationCap, Building,
  Home, Heart, Lightbulb, Timer, Coffee, Puzzle, Medal, Crown, Gift
} from 'lucide-react';

export default function InvestorPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "L³ - Liquid Learning Lab",
      subtitle: "Norway's First AI-Powered Educational Experience Platform",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-white text-4xl font-bold">L³</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              The Future of Learning is Liquid
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionizing education with AI-powered visual learning, personalized paths, 
              gamified experiences, and comprehensive progress tracking for individuals, families, and companies
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Individuals</h3>
                <p className="text-sm text-blue-600">Personal Learning Journeys</p>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30">
              <div className="text-center">
                <Home className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800 dark:text-purple-300">Families</h3>
                <p className="text-sm text-purple-600">Collaborative Learning</p>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30">
              <div className="text-center">
                <Building className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 dark:text-green-300">Companies</h3>
                <p className="text-sm text-green-600">Corporate Training</p>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Live Demo - Core Features",
      subtitle: "Fully Functional Platform Connected to Real Database",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-emerald-600" />
                Live Database Integration
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Real-time conversation storage
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  User progress tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Learning analytics & insights
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Subject categorization
                </li>
              </ul>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-blue-600" />
                AI-Powered Features
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  GPT-4 powered conversations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  DALL-E 3 image generation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Text-to-speech (TTS-1-HD)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Dynamic mind mapping
                </li>
              </ul>
            </Card>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 rounded-lg border-2 border-amber-200 dark:border-amber-800">
            <PlayCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300">Ready for Live Demo</h3>
            <p className="text-amber-700 dark:text-amber-400">
              Platform is fully operational with real database connections and AI integrations
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Current Functional Features",
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Card className="p-4 bg-blue-50 dark:bg-blue-950/30">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">AI Chat Interface</h3>
              </div>
              <p className="text-sm">Conversational learning with GPT-4, auto-categorization, and intelligent responses</p>
            </Card>
            
            <Card className="p-4 bg-purple-50 dark:bg-purple-950/30">
              <div className="flex items-center space-x-2 mb-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Visual Learning</h3>
              </div>
              <p className="text-sm">Auto-generated educational diagrams and illustrations using DALL-E 3</p>
            </Card>
            
            <Card className="p-4 bg-green-50 dark:bg-green-950/30">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Interactive Mind Maps</h3>
              </div>
              <p className="text-sm">Dynamic topic exploration with clickable, expandable knowledge trees</p>
            </Card>
            
            <Card className="p-4 bg-amber-50 dark:bg-amber-950/30">
              <div className="flex items-center space-x-2 mb-2">
                <Volume2 className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold">Voice Assistant</h3>
              </div>
              <p className="text-sm">High-quality AI narration with natural speech synthesis</p>
            </Card>
          </div>
          
          <div className="space-y-3">
            <Card className="p-4 bg-indigo-50 dark:bg-indigo-950/30">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold">Learning Paths</h3>
              </div>
              <p className="text-sm">Structured learning journeys with progress tracking and prerequisites</p>
            </Card>
            
            <Card className="p-4 bg-pink-50 dark:bg-pink-950/30">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-pink-600" />
                <h3 className="font-semibold">Study Materials</h3>
              </div>
              <p className="text-sm">Organized content library with search, filtering, and categorization</p>
            </Card>
            
            <Card className="p-4 bg-teal-50 dark:bg-teal-950/30">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold">Study Groups</h3>
              </div>
              <p className="text-sm">Collaborative learning spaces with AI-facilitated group sessions</p>
            </Card>
            
            <Card className="p-4 bg-orange-50 dark:bg-orange-950/30">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold">Progress Analytics</h3>
              </div>
              <p className="text-sm">Comprehensive learning insights and performance tracking</p>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Technical Infrastructure",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950/30">
              <h3 className="font-bold mb-3 flex items-center">
                <Database className="w-5 h-5 mr-2 text-violet-600" />
                Database Layer
              </h3>
              <ul className="text-sm space-y-1">
                <li>• PostgreSQL (Neon)</li>
                <li>• Drizzle ORM</li>
                <li>• Real-time sync</li>
                <li>• Auto-scaling</li>
              </ul>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/30">
              <h3 className="font-bold mb-3 flex items-center">
                <Cloud className="w-5 h-5 mr-2 text-blue-600" />
                AI Integration
              </h3>
              <ul className="text-sm space-y-1">
                <li>• OpenAI GPT-4</li>
                <li>• DALL-E 3</li>
                <li>• TTS-1-HD</li>
                <li>• Custom prompting</li>
              </ul>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30">
              <h3 className="font-bold mb-3 flex items-center">
                <Rocket className="w-5 h-5 mr-2 text-emerald-600" />
                Platform Stack
              </h3>
              <ul className="text-sm space-y-1">
                <li>• React + TypeScript</li>
                <li>• Node.js + Express</li>
                <li>• Tailwind CSS</li>
                <li>• Replit deployment</li>
              </ul>
            </Card>
          </div>
          
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-950/50">
            <h3 className="text-lg font-bold mb-4">Current Database Schema</h3>
            <div className="grid grid-cols-5 gap-4 text-sm">
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <h4 className="font-semibold text-blue-600">Conversations</h4>
                <p className="text-xs">User sessions, titles, timestamps</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <h4 className="font-semibold text-purple-600">Messages</h4>
                <p className="text-xs">Chat history, images, mind maps</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <h4 className="font-semibold text-green-600">User Interests</h4>
                <p className="text-xs">Subject preferences, progress</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <h4 className="font-semibold text-amber-600">Learning Progress</h4>
                <p className="text-xs">Topic mastery, visual count</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <h4 className="font-semibold text-indigo-600">Analytics</h4>
                <p className="text-xs">Usage patterns, insights</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: "Market Opportunity & Competitive Edge",
      content: (
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <h3 className="text-2xl font-bold mb-4">Norwegian Market Leadership</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span><strong>First AI education platform</strong> in Norway</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span><strong>5.4M potential users</strong> across all demographics</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-green-500" />
                <span><strong>95% digital adoption</strong> rate in education</span>
              </li>
              <li className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span><strong>Government support</strong> for EdTech innovation</span>
              </li>
            </ul>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <h3 className="text-2xl font-bold mb-4">Global Market Potential</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span><strong>$342B EdTech market</strong> by 2025</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span><strong>17.8% CAGR</strong> growth rate</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-red-500" />
                <span><strong>First-mover advantage</strong> in visual AI learning</span>
              </li>
              <li className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-indigo-500" />
                <span><strong>Unique position</strong> for rapid expansion</span>
              </li>
            </ul>
          </Card>
          
          <Card className="p-6 border-2 border-primary col-span-2">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-primary" />
              What Makes L³ Unique vs. Competitors
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-primary mb-2">vs. Traditional LMS</h4>
                <ul className="text-sm space-y-1">
                  <li>✓ AI-powered personalization</li>
                  <li>✓ Real-time visual generation</li>
                  <li>✓ Gamified progression</li>
                  <li>✓ Multi-modal learning</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">vs. ChatGPT/Claude</h4>
                <ul className="text-sm space-y-1">
                  <li>✓ Education-specific AI</li>
                  <li>✓ Progress tracking</li>
                  <li>✓ Visual learning tools</li>
                  <li>✓ Collaborative features</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">vs. Khan Academy/Coursera</h4>
                <ul className="text-sm space-y-1">
                  <li>✓ Conversational AI tutor</li>
                  <li>✓ Dynamic content creation</li>
                  <li>✓ Personalized paths</li>
                  <li>✓ Family/corporate solutions</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: "Future Roadmap - Gamification & Advanced Features",
      subtitle: "Recommended enhancements for maximum educational impact",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/30">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Gamepad2 className="w-6 h-6 mr-2 text-amber-600" />
                Gamification Engine
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-amber-500" />
                  Achievement system with badges & trophies
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  Experience points (XP) and level progression
                </li>
                <li className="flex items-center">
                  <Crown className="w-4 h-4 mr-2 text-purple-500" />
                  Leaderboards for healthy competition
                </li>
                <li className="flex items-center">
                  <Gift className="w-4 h-4 mr-2 text-pink-500" />
                  Daily challenges and streak rewards
                </li>
                <li className="flex items-center">
                  <Medal className="w-4 h-4 mr-2 text-blue-500" />
                  Skill mastery certifications
                </li>
              </ul>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
                Advanced Analytics
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-green-500" />
                  Learning pattern analysis & insights
                </li>
                <li className="flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-purple-500" />
                  AI-powered learning recommendations
                </li>
                <li className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                  Predictive performance modeling
                </li>
                <li className="flex items-center">
                  <Target className="w-4 h-4 mr-2 text-red-500" />
                  Adaptive difficulty adjustment
                </li>
                <li className="flex items-center">
                  <Timer className="w-4 h-4 mr-2 text-orange-500" />
                  Optimal learning time suggestions
                </li>
              </ul>
            </Card>
          </div>
          
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-100 dark:from-indigo-950/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2 text-indigo-600" />
              Next-Generation Features
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Enhanced Interactions</h4>
                <ul className="text-sm space-y-1">
                  <li>• AR/VR learning environments</li>
                  <li>• Voice-to-voice conversations</li>
                  <li>• Gesture-based navigation</li>
                  <li>• Multi-language real-time translation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Social Learning</h4>
                <ul className="text-sm space-y-1">
                  <li>• Family learning challenges</li>
                  <li>• Corporate team competitions</li>
                  <li>• Peer-to-peer tutoring marketplace</li>
                  <li>• Expert-led masterclasses</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Smart Integrations</h4>
                <ul className="text-sm space-y-1">
                  <li>• Calendar-based learning reminders</li>
                  <li>• Wearable device sync</li>
                  <li>• Smart home integration</li>
                  <li>• Educational IoT ecosystem</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: "Target Markets & Use Cases",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30">
              <div className="text-center mb-4">
                <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">Individuals</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Students (K-12, University)</li>
                <li>• Professional development</li>
                <li>• Skill acquisition & hobbies</li>
                <li>• Language learning</li>
                <li>• Certification preparation</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
                <p className="text-xs font-medium">Pricing: $9.99/month individual</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/30">
              <div className="text-center mb-4">
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">Families</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Parent-child learning together</li>
                <li>• Homeschooling support</li>
                <li>• Family knowledge competitions</li>
                <li>• Multi-generational learning</li>
                <li>• Educational family time</li>
              </ul>
              <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded">
                <p className="text-xs font-medium">Pricing: $19.99/month (up to 6 users)</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30">
              <div className="text-center mb-4">
                <Building className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">Companies</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Employee training programs</li>
                <li>• Onboarding & skill development</li>
                <li>• Compliance training</li>
                <li>• Leadership development</li>
                <li>• Team building challenges</li>
              </ul>
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded">
                <p className="text-xs font-medium">Pricing: $49.99/month per 10 users</p>
              </div>
            </Card>
          </div>
          
          <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-100 dark:from-amber-950/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Puzzle className="w-6 h-6 mr-2 text-amber-600" />
              Real-World Implementation Examples
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Education Sector</h4>
                <ul className="text-sm space-y-1">
                  <li>• Universities: Supplementary AI tutoring</li>
                  <li>• Schools: Interactive homework assistance</li>
                  <li>• Training centers: Skill certification programs</li>
                  <li>• Libraries: Public learning resources</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Corporate Training</h4>
                <ul className="text-sm space-y-1">
                  <li>• Tech companies: Programming & technical skills</li>
                  <li>• Healthcare: Medical knowledge updates</li>
                  <li>• Finance: Compliance & regulation training</li>
                  <li>• Manufacturing: Safety & process training</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: "Revenue Model & Growth Projections",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-emerald-600" />
                Revenue Streams
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border">
                  <span className="font-medium">Individual Subscriptions</span>
                  <span className="text-emerald-600 font-bold">$9.99/mo</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border">
                  <span className="font-medium">Family Plans</span>
                  <span className="text-purple-600 font-bold">$19.99/mo</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border">
                  <span className="font-medium">Corporate Licenses</span>
                  <span className="text-blue-600 font-bold">$49.99/mo</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border">
                  <span className="font-medium">Premium AI Features</span>
                  <span className="text-amber-600 font-bold">+$4.99/mo</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                3-Year Projections
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Year 1: Norway Launch</span>
                    <span className="text-sm">10K users</span>
                  </div>
                  <Progress value={33} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Revenue: $1.2M</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Year 2: Nordic Expansion</span>
                    <span className="text-sm">50K users</span>
                  </div>
                  <Progress value={66} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Revenue: $6.8M</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Year 3: European Market</span>
                    <span className="text-sm">200K users</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Revenue: $28.5M</p>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-950/30">
            <h3 className="text-xl font-bold mb-4">Investment Requirements & Use of Funds</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">$2.5M</div>
                <div className="text-sm font-medium">Seed Round</div>
                <div className="text-xs text-muted-foreground mt-1">18 months runway</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">40%</div>
                <div className="text-sm font-medium">Development</div>
                <div className="text-xs text-muted-foreground mt-1">AI & platform features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">35%</div>
                <div className="text-sm font-medium">Marketing</div>
                <div className="text-xs text-muted-foreground mt-1">User acquisition</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">25%</div>
                <div className="text-sm font-medium">Operations</div>
                <div className="text-xs text-muted-foreground mt-1">Team & infrastructure</div>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: "Implementation Timeline & Next Steps",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30">
              <h3 className="font-bold mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Q1 2025: Current Status
              </h3>
              <ul className="text-sm space-y-1">
                <li>✅ Core platform functional</li>
                <li>✅ AI integrations complete</li>
                <li>✅ Database infrastructure</li>
                <li>✅ Demo ready for investors</li>
                <li>✅ Norwegian market research</li>
              </ul>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30">
              <h3 className="font-bold mb-3 flex items-center">
                <Rocket className="w-5 h-5 mr-2 text-blue-600" />
                Q2-Q3 2025: Launch Phase
              </h3>
              <ul className="text-sm space-y-1">
                <li>• Gamification engine</li>
                <li>• Advanced analytics</li>
                <li>• Family/corporate features</li>
                <li>• Norwegian beta launch</li>
                <li>• User feedback integration</li>
              </ul>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/30">
              <h3 className="font-bold mb-3 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-purple-600" />
                Q4 2025: Expansion
              </h3>
              <ul className="text-sm space-y-1">
                <li>• Nordic market entry</li>
                <li>• Mobile app launch</li>
                <li>• Enterprise partnerships</li>
                <li>• Series A preparation</li>
                <li>• International scaling</li>
              </ul>
            </Card>
          </div>
          
          <Card className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">Ready to Transform Education Together?</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <h4 className="font-semibold">First Mover</h4>
                <p className="text-sm opacity-90">Norway's first AI education platform</p>
              </div>
              <div>
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <h4 className="font-semibold">Proven Tech</h4>
                <p className="text-sm opacity-90">Functional platform with real users</p>
              </div>
              <div>
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <h4 className="font-semibold">Huge Market</h4>
                <p className="text-sm opacity-90">$342B global opportunity</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-lg font-medium">Join us in making learning liquid, visual, and limitless</p>
              <p className="text-sm opacity-90 mt-2">Contact: team@liquidlearninglab.no | +47 xxx xxx xxx</p>
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">L³</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Liquid Learning Lab</h1>
              <p className="text-sm text-muted-foreground">Investor Presentation - {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Slide {currentSlide + 1} of {slides.length}
          </div>
        </div>

        {/* Slide Navigation Dots */}
        <div className="fixed top-1/2 right-8 transform -translate-y-1/2 space-y-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'bg-primary scale-125 shadow-lg'
                  : 'bg-muted hover:bg-primary/50 hover:scale-110'
              }`}
              title={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Current Slide Content */}
        <div className="min-h-[70vh] flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {slides[currentSlide].title}
            </h1>
            {slides[currentSlide].subtitle && (
              <p className="text-xl text-muted-foreground mt-3 max-w-4xl mx-auto">
                {slides[currentSlide].subtitle}
              </p>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="flex items-center space-x-2"
          >
            <span>← Previous</span>
          </Button>
          
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <Button
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next →</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
