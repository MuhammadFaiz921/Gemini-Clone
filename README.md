# Gemini Clone

An AI chatbot clone that replicates the Gemini interface and functionality. It enables real-time AI-powered conversations using both text and voice input. Chat history is persistently stored in MongoDB and user authentication is managed via Firebase. Gemini's streaming API powers the backend to deliver real-time responses.

---

## ✨ Features

- 🎙 **Voice Input** – Speak your queries for a hands-free experience.
- ⌨️ **Text Input** – Traditional text-based conversation support.
- ⚡ **Real-Time Streaming** – Get instant responses powered by Gemini's streaming API.
- 💾 **Chat History** – Stores chat history in MongoDB so users can view past conversations.
- 🔒 **Persistent Sessions** – Chat history is loaded after login and preserved across sessions.

---

## 🛠 Tech Stack

### Frontend
- **React.js** – UI components and client-side logic
- **Tailwind CSS** – Modern utility-first CSS framework
- **Firebase Authentication** – Google login integration

### Backend
- **Node.js + Express.js** – Server and API routing
- **MongoDB** – NoSQL database for storing chat history
- **Gemini Streaming API** – AI response generation in real-time

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MuhammadFaiz921/Gemini-Clone.git
cd Gemini-Clone
```


```bash
npm install
```

```bash
GEMINI_API_KEY=your-gemini-api-key
MONGO_URI=your-mongodb-connection-uri
FIREBASE_CONFIG=your-firebase-config-json-string
```

```bash
npm run dev
node index.js
```
---

## 📝 License
- This project is licensed under the MIT License.
---
