import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import connectDB from './db.js';
import ChatHistory from './chatHistoryModel.js';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const _dirname = path.resolve();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
connectDB();

app.post('/api/chat/stream', async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContentStream(prompt);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) res.write(text);
    }
    res.end();
  } catch (error) {
    console.error("Gemini API stream error:", error);
    res.status(500).json({ error: 'Failed to stream from Gemini API' });
  }
});

app.post('/api/chat/save', async (req, res) => {
  const { prompt, response, userId, chatId } = req.body;
  if (!prompt || !response || !userId || !chatId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const chat = new ChatHistory({
      userId,
      chatId,
      prompt,
      response,
      timestamp: new Date(),
    });
    await chat.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to save chat history:", err);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

app.get('/api/chat/history', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "User ID is required" });
  try {
    const chats = await ChatHistory.aggregate([
      { $match: { userId } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$chatId",
          title: { $min: "$prompt" },
          timestamp: { $first: "$timestamp" },
        }
      },
      { $sort: { timestamp: -1 } },
      { $limit: 5 }
    ]);

    const chatsWithChatId = chats.map(chat => ({
      _id: new mongoose.Types.ObjectId(), // Ensure unique _id for React `key`
      chatId: chat._id,
      title: chat.title?.trim() || "Untitled",
      timestamp: chat.timestamp,
    }));

    res.json(chatsWithChatId);
  } catch (error) {
    console.error("Failed to fetch history", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.get('/api/chat/thread/:chatId', async (req, res) => {
  try {
    const messages = await ChatHistory.find({ chatId: req.params.chatId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Failed to fetch chat thread", error);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// Serve static files for the frontend
app.use(express.static(path.join(_dirname , "/frontend/dist")));

// Handle all other routes for React routing
app.get('*', (_, res) => {
  res.sendFile(path.resolve(_dirname , "frontend", "dist", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
