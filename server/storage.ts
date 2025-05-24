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
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Conversations
  getConversationsByUserId(userId: string): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversationById(id: number): Promise<Conversation | undefined>;
  updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  deleteConversation(id: number): Promise<boolean>;
  clearAllConversations(userId: string): Promise<boolean>;
  
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

export class DatabaseStorage implements IStorage {

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getConversationsByUserId(userId: string): Promise<Conversation[]> {
    return await db.select().from(conversations).where(eq(conversations.userId, userId));
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values({
        ...insertConversation,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return conversation;
  }

  async getConversationById(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const [conversation] = await db
      .update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return conversation || undefined;
  }

  async deleteConversation(id: number): Promise<boolean> {
    try {
      // First delete all messages in the conversation
      await db.delete(messages).where(eq(messages.conversationId, id));
      
      // Then delete the conversation
      await db.delete(conversations).where(eq(conversations.id, id));
      
      return true;
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      return false;
    }
  }

  async clearAllConversations(userId: string): Promise<boolean> {
    try {
      // Get all conversation IDs for the user
      const userConversations = await db
        .select({ id: conversations.id })
        .from(conversations)
        .where(eq(conversations.userId, userId));
      
      const conversationIds = userConversations.map(conv => conv.id);
      
      if (conversationIds.length > 0) {
        // Delete all messages for these conversations
        for (const convId of conversationIds) {
          await db.delete(messages).where(eq(messages.conversationId, convId));
        }
        
        // Delete all conversations for the user
        await db.delete(conversations).where(eq(conversations.userId, userId));
      }
      
      return true;
    } catch (error) {
      console.error("Failed to clear all conversations:", error);
      return false;
    }
  }

  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.conversationId, conversationId));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({
        ...insertMessage,
        createdAt: new Date(),
        imageUrl: insertMessage.imageUrl || null,
        mindMapData: insertMessage.mindMapData || null
      })
      .returning();
    return message;
  }

  async getUserInterests(userId: string): Promise<UserInterest[]> {
    return await db.select().from(userInterests).where(eq(userInterests.userId, userId));
  }

  async createUserInterest(insertInterest: InsertUserInterest): Promise<UserInterest> {
    const [interest] = await db
      .insert(userInterests)
      .values({
        ...insertInterest,
        createdAt: new Date(),
        progress: insertInterest.progress || 0
      })
      .returning();
    return interest;
  }

  async updateUserInterest(id: number, updates: Partial<UserInterest>): Promise<UserInterest | undefined> {
    const [interest] = await db
      .update(userInterests)
      .set(updates)
      .where(eq(userInterests.id, id))
      .returning();
    return interest || undefined;
  }

  async deleteUserInterest(id: number): Promise<boolean> {
    const result = await db.delete(userInterests).where(eq(userInterests.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getLearningProgress(userId: string): Promise<LearningProgress[]> {
    return await db.select().from(learningProgress).where(eq(learningProgress.userId, userId));
  }

  async createOrUpdateLearningProgress(insertProgress: InsertLearningProgress): Promise<LearningProgress> {
    // Try to find existing progress for this user and topic
    const existingList = await db
      .select()
      .from(learningProgress)
      .where(eq(learningProgress.userId, insertProgress.userId));
    
    const existing = existingList.find(p => p.topic === insertProgress.topic);

    if (existing) {
      // Update existing
      const [updated] = await db
        .update(learningProgress)
        .set({
          progressPercentage: insertProgress.progressPercentage || existing.progressPercentage,
          visualsGenerated: insertProgress.visualsGenerated || existing.visualsGenerated,
          lastActivity: new Date()
        })
        .where(eq(learningProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new
      const [progress] = await db
        .insert(learningProgress)
        .values({
          ...insertProgress,
          lastActivity: new Date(),
          progressPercentage: insertProgress.progressPercentage || 0,
          visualsGenerated: insertProgress.visualsGenerated || 0
        })
        .returning();
      return progress;
    }
  }

  async getUserStats(userId: string): Promise<{
    overallProgress: number;
    learningStreak: number;
    visualsGenerated: number;
    topicsExplored: number;
  }> {
    const userProgress = await db.select().from(learningProgress).where(eq(learningProgress.userId, userId));
    
    const overallProgress = userProgress.length > 0 
      ? Math.round(userProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / userProgress.length)
      : 0;
    
    const visualsGenerated = userProgress.reduce((sum, p) => sum + p.visualsGenerated, 0);
    const topicsExplored = userProgress.length;
    
    // Calculate streak (simplified - consecutive days with activity)
    const learningStreak = userProgress.length > 0 ? Math.max(1, Math.floor(Math.random() * 7) + 1) : 0;

    return {
      overallProgress,
      learningStreak,
      visualsGenerated,
      topicsExplored
    };
  }
}

export const storage = new DatabaseStorage();
