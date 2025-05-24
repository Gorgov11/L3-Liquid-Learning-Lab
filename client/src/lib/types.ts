export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string | null;
  mindMapData?: MindMapData | null;
  createdAt: Date;
}

export interface MindMapData {
  centralTopic: string;
  branches: {
    label: string;
    children: string[];
  }[];
}

export interface UserStats {
  overallProgress: number;
  learningStreak: number;
  visualsGenerated: number;
  topicsExplored: number;
}

export interface LearningProgressData {
  id: number;
  userId: string;
  topic: string;
  progressPercentage: number;
  visualsGenerated: number;
  lastActivity: Date;
}

export interface UserInterestData {
  id: number;
  userId: string;
  interest: string;
  progress: number;
  createdAt: Date;
}

export interface ConversationData {
  id: number;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
