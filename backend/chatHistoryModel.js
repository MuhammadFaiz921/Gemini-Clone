import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  chatId: { type: String, required: true },
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;