import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema, insertUserInterestSchema, insertLearningProgressSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get conversations for a user
  app.get("/api/conversations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const conversations = await storage.getConversationsByUserId(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ message: "Invalid conversation data" });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:conversationId/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const messages = await storage.getMessagesByConversationId(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send a message and get AI response
  app.post("/api/conversations/:conversationId/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const { content, generateImage, generateMindMap, addEmojis = true } = req.body;

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId,
        role: "user",
        content,
        imageUrl: null,
        mindMapData: null,
      });

      // Get conversation to understand context
      const conversation = await storage.getConversationById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Get user interests for personalization
      const userInterests = await storage.getUserInterests(conversation.userId);
      const interestsText = userInterests.map(i => i.interest).join(", ");

      // AI-powered subject detection
      let detectedSubject = "General Learning";
      let subjectIcon = "📚";
      
      try {
        const subjectDetectionPrompt = `Analyze this learning question and categorize it into the most appropriate subject. 
        Question: "${content}"
        
        Respond with JSON in this format: {
          "subject": "specific subject name",
          "category": "broader category",
          "icon": "appropriate emoji",
          "confidence": 0.95
        }
        
        Choose from subjects like: Mathematics, Physics, Chemistry, Biology, History, Literature, Computer Science, Art, Music, Philosophy, Psychology, Economics, Geography, Languages, etc.`;

        const subjectResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: subjectDetectionPrompt }],
          response_format: { type: "json_object" },
          max_tokens: 150,
        });

        const subjectData = JSON.parse(subjectResponse.choices[0].message.content || "{}");
        if (subjectData.subject && subjectData.confidence > 0.7) {
          detectedSubject = subjectData.subject;
          subjectIcon = subjectData.icon || "📚";
        }
      } catch (error) {
        console.log("Subject detection failed, using general category");
      }

      // Update conversation title with detected subject (only for first few messages)
      const existingMessages = await storage.getMessagesByConversationId(conversationId);
      if (existingMessages.length <= 2) {
        try {
          await storage.updateConversation(conversationId, {
            title: `${subjectIcon} ${detectedSubject} Discussion`
          });
        } catch (error) {
          console.log("Failed to update conversation title");
        }
      }

      // Auto-create user interest for detected subject
      try {
        const existingInterests = await storage.getUserInterests(conversation.userId);
        const hasSubjectInterest = existingInterests.some(interest => 
          interest.interest.toLowerCase().includes(detectedSubject.toLowerCase())
        );
        
        if (!hasSubjectInterest && detectedSubject !== "General Learning") {
          await storage.createUserInterest({
            userId: conversation.userId,
            interest: detectedSubject,
            progress: 10 // Start with 10% progress for new subjects
          });
        }
      } catch (error) {
        console.log("Failed to create user interest");
      }

      // Auto-update learning progress for detected subject
      try {
        await storage.createOrUpdateLearningProgress({
          userId: conversation.userId,
          topic: detectedSubject,
          progressPercentage: Math.min(100, (existingMessages.length + 1) * 5), // Increase progress based on message count
          visualsGenerated: (generateImage ? 1 : 0) + (generateMindMap ? 1 : 0),
          lastActivity: new Date()
        });
      } catch (error) {
        console.log("Failed to update learning progress");
      }

      // Generate AI response with subject context
      const emojiInstruction = addEmojis ? 'Use relevant emojis throughout your response to make it more engaging and visual. ' : '';
      
      const systemPrompt = `You are an AI tutor for Liquid Learning Lab specializing in ${detectedSubject}. You provide educational explanations that are clear, engaging, and personalized. 
      ${emojiInstruction}${interestsText ? `The user is interested in: ${interestsText}. Try to relate topics to these interests when relevant.` : ''}
      Focus on providing accurate, educational content in the context of ${detectedSubject}. Keep responses conversational but informative.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content }
        ],
        max_tokens: 500,
      });

      const aiContent = response.choices[0].message.content || "I apologize, but I couldn't generate a response at this time.";

      let imageUrl = null;
      let mindMapData = null;

      // ALWAYS generate visuals for educational content (automatic generation)
      const shouldGenerateVisuals = aiContent.length > 50; // Generate for substantial responses

      // Generate image automatically for educational responses
      if (shouldGenerateVisuals) {
        try {
          const imagePrompt = `Create a comprehensive educational visual that explains: ${content}. 
          The image should be designed as a learning aid that:
          - Breaks down the topic into clear, digestible components
          - Uses diagrams, flowcharts, or step-by-step illustrations
          - Includes descriptive labels and annotations
          - Shows cause-and-effect relationships or processes
          - Uses a clean, textbook-style layout with good readability
          - Employs colors strategically to highlight important concepts
          - Presents information in a logical, easy-to-follow sequence
          - Avoids decorative elements that distract from learning
          - Focuses on helping students understand and remember the concept`;
          
          const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: imagePrompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
          });
          imageUrl = imageResponse.data?.[0]?.url || null;
        } catch (error) {
          console.error("Image generation failed:", error);
        }
      }

      // Generate mind map automatically for educational responses
      if (shouldGenerateVisuals) {
        try {
          const mindMapPrompt = `Create a structured mind map for the topic: ${content}. 
          Respond with JSON in this format: {
            "centralTopic": "main topic",
            "branches": [
              {
                "label": "branch name",
                "children": ["child1", "child2", "child3"]
              }
            ]
          }`;

          const mindMapResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: mindMapPrompt }],
            response_format: { type: "json_object" },
          });

          mindMapData = JSON.parse(mindMapResponse.choices[0].message.content || "{}");
        } catch (error) {
          console.error("Mind map generation failed:", error);
        }
      }

      // Save AI message
      const aiMessage = await storage.createMessage({
        conversationId,
        role: "assistant",
        content: aiContent,
        imageUrl,
        mindMapData,
      });

      // Update learning progress  
      const topic = content.substring(0, 100); // Use first 100 chars as topic
      await storage.createOrUpdateLearningProgress({
        userId: conversation.userId,
        topic,
        progressPercentage: Math.min(100, 10), // Small increment per interaction
        visualsGenerated: (shouldGenerateVisuals ? 2 : 0), // Both image and mindmap when auto-generated
      });

      // Update conversation timestamp
      await storage.updateConversation(conversationId, {});

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Message processing failed:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Generate high-quality AI voice for text
  app.post("/api/text-to-speech", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const mp3 = await openai.audio.speech.create({
        model: "tts-1-hd", // High quality model
        voice: "nova", // Natural, engaging voice
        input: text,
        speed: 1.0,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
      });
      
      res.send(buffer);
    } catch (error) {
      console.error("Text-to-speech generation failed:", error);
      res.status(500).json({ message: "Failed to generate speech" });
    }
  });

  // Get user interests
  app.get("/api/users/:userId/interests", async (req, res) => {
    try {
      const { userId } = req.params;
      const interests = await storage.getUserInterests(userId);
      res.json(interests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interests" });
    }
  });

  // Add user interest
  app.post("/api/users/:userId/interests", async (req, res) => {
    try {
      const { userId } = req.params;
      const validatedData = insertUserInterestSchema.parse({
        ...req.body,
        userId,
      });
      const interest = await storage.createUserInterest(validatedData);
      res.json(interest);
    } catch (error) {
      res.status(400).json({ message: "Invalid interest data" });
    }
  });

  // Delete user interest
  app.delete("/api/users/:userId/interests/:interestId", async (req, res) => {
    try {
      const interestId = parseInt(req.params.interestId);
      const success = await storage.deleteUserInterest(interestId);
      if (success) {
        res.json({ message: "Interest deleted" });
      } else {
        res.status(404).json({ message: "Interest not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete interest" });
    }
  });

  // Get user learning progress and stats
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getLearningProgress(userId);
      const stats = await storage.getUserStats(userId);
      res.json({ progress, stats });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Generate image for a topic
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const imagePrompt = `Create an educational, step-by-step visual diagram that explains: ${prompt}. 
      The image should:
      - Break down complex concepts into simple, easy-to-understand parts
      - Include clear labels and annotations
      - Use a clean, textbook-style design with good contrast
      - Show relationships between different elements
      - Be suitable for students to learn from
      - Use diagrams, flowcharts, or infographics style
      - Avoid cluttered or overly artistic elements
      - Focus on clarity and educational value`;
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      res.json({ url: response.data[0]?.url });
    } catch (error) {
      console.error("Image generation failed:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });

  // Generate mind map for a topic
  app.post("/api/generate-mindmap", async (req, res) => {
    try {
      const { topic } = req.body;
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      const mindMapPrompt = `Create a structured mind map for the topic: ${topic}. 
      Respond with JSON in this format: {
        "centralTopic": "main topic",
        "branches": [
          {
            "label": "branch name", 
            "children": ["child1", "child2", "child3"]
          }
        ]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: mindMapPrompt }],
        response_format: { type: "json_object" },
      });

      const mindMapData = JSON.parse(response.choices[0].message.content || "{}");
      res.json(mindMapData);
    } catch (error) {
      console.error("Mind map generation failed:", error);
      res.status(500).json({ message: "Failed to generate mind map" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
