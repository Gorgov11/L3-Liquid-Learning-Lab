import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  mindMapData: jsonb("mind_map_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userInterests = pgTable("user_interests", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  interest: text("interest").notNull(),
  progress: integer("progress").notNull().default(0), // 0-100
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const learningProgress = pgTable("learning_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  topic: text("topic").notNull(),
  progressPercentage: integer("progress_percentage").notNull().default(0),
  visualsGenerated: integer("visuals_generated").notNull().default(0),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertUserInterestSchema = createInsertSchema(userInterests).omit({
  id: true,
  createdAt: true,
});

export const insertLearningProgressSchema = createInsertSchema(learningProgress).omit({
  id: true,
  lastActivity: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type UserInterest = typeof userInterests.$inferSelect;
export type InsertUserInterest = z.infer<typeof insertUserInterestSchema>;
export type LearningProgress = typeof learningProgress.$inferSelect;
export type InsertLearningProgress = z.infer<typeof insertLearningProgressSchema>;
