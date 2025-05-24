import { 
  users, 
  conversations, 
  messages, 
  userInterests, 
  learningProgress,
  type User, 
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type UserInterest,
  type InsertUserInterest,
  type LearningProgress,
  type InsertLearningProgress
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Conversations
  getConversationsByUserId(userId: string): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversationById(id: number): Promise<Conversation | undefined>;
  updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  
  // Messages
  getMessagesByConversationId(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // User Interests
  getUserInterests(userId: string): Promise<UserInterest[]>;
  createUserInterest(interest: InsertUserInterest): Promise<UserInterest>;
  updateUserInterest(id: number, updates: Partial<UserInterest>): Promise<UserInterest | undefined>;
  deleteUserInterest(id: number): Promise<boolean>;
  
  // Learning Progress
  getLearningProgress(userId: string): Promise<LearningProgress[]>;
  createOrUpdateLearningProgress(progress: InsertLearningProgress): Promise<LearningProgress>;
  getUserStats(userId: string): Promise<{
    overallProgress: number;
    learningStreak: number;
    visualsGenerated: number;
    topicsExplored: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private userInterests: Map<number, UserInterest>;
  private learningProgress: Map<number, LearningProgress>;
  private currentUserIdCounter: number;
  private currentConversationIdCounter: number;
  private currentMessageIdCounter: number;
  private currentUserInterestIdCounter: number;
  private currentLearningProgressIdCounter: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.userInterests = new Map();
    this.learningProgress = new Map();
    this.currentUserIdCounter = 1;
    this.currentConversationIdCounter = 1;
    this.currentMessageIdCounter = 1;
    this.currentUserInterestIdCounter = 1;
    this.currentLearningProgressIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getConversationsByUserId(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationIdCounter++;
    const now = new Date();
    const conversation: Conversation = { 
      ...insertConversation, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversationById(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updated = { ...conversation, ...updates, updatedAt: new Date() };
    this.conversations.set(id, updated);
    return updated;
  }

  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageIdCounter++;
    const message: Message = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async getUserInterests(userId: string): Promise<UserInterest[]> {
    return Array.from(this.userInterests.values())
      .filter(interest => interest.userId === userId);
  }

  async createUserInterest(insertInterest: InsertUserInterest): Promise<UserInterest> {
    const id = this.currentUserInterestIdCounter++;
    const interest: UserInterest = { 
      ...insertInterest, 
      id,
      createdAt: new Date()
    };
    this.userInterests.set(id, interest);
    return interest;
  }

  async updateUserInterest(id: number, updates: Partial<UserInterest>): Promise<UserInterest | undefined> {
    const interest = this.userInterests.get(id);
    if (!interest) return undefined;
    
    const updated = { ...interest, ...updates };
    this.userInterests.set(id, updated);
    return updated;
  }

  async deleteUserInterest(id: number): Promise<boolean> {
    return this.userInterests.delete(id);
  }

  async getLearningProgress(userId: string): Promise<LearningProgress[]> {
    return Array.from(this.learningProgress.values())
      .filter(progress => progress.userId === userId);
  }

  async createOrUpdateLearningProgress(insertProgress: InsertLearningProgress): Promise<LearningProgress> {
    // Find existing progress for this user and topic
    const existing = Array.from(this.learningProgress.values())
      .find(p => p.userId === insertProgress.userId && p.topic === insertProgress.topic);
    
    if (existing) {
      const updated = { 
        ...existing, 
        ...insertProgress, 
        lastActivity: new Date() 
      };
      this.learningProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentLearningProgressIdCounter++;
      const progress: LearningProgress = { 
        ...insertProgress, 
        id,
        lastActivity: new Date()
      };
      this.learningProgress.set(id, progress);
      return progress;
    }
  }

  async getUserStats(userId: string): Promise<{
    overallProgress: number;
    learningStreak: number;
    visualsGenerated: number;
    topicsExplored: number;
  }> {
    const userProgress = await this.getLearningProgress(userId);
    const messages = Array.from(this.messages.values())
      .filter(msg => {
        const conversation = Array.from(this.conversations.values())
          .find(conv => conv.id === msg.conversationId && conv.userId === userId);
        return !!conversation;
      });
    
    const overallProgress = userProgress.length > 0 
      ? Math.round(userProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / userProgress.length)
      : 0;
    
    const visualsGenerated = userProgress.reduce((sum, p) => sum + p.visualsGenerated, 0);
    const topicsExplored = userProgress.length;
    
    // Simple streak calculation based on activity in the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity = userProgress.filter(p => new Date(p.lastActivity) >= sevenDaysAgo);
    const learningStreak = recentActivity.length > 0 ? 7 : 0; // Simplified for demo
    
    return {
      overallProgress,
      learningStreak,
      visualsGenerated,
      topicsExplored
    };
  }
}

export const storage = new MemStorage();
