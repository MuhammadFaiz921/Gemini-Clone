import { createContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]); // ✅ Replaces prevPrompt[]
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [resultData, setResultData] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Set base URL dynamically based on the environment
  const baseUrl = import.meta.env.PROD
    ? "//gemini-clone-ir74.onrender.com/"
    : "http://localhost:5000";

  const handleChatClick = async (chat) => {
    setSelectedChatId(chat.chatId);
    sessionStorage.setItem("selectedChatId", chat.chatId);
    try {
      const res = await fetch(`${baseUrl}/api/chat/thread/${chat.chatId}`);
      if (!res.ok) throw new Error(`Failed to fetch chat thread: ${res.statusText}`);
      const data = await res.json();
      if (data.length > 0) {
        const last = data[data.length - 1];
        setRecentPrompt(last.prompt);
        setResultData(last.response);
        setShowResult(true);
      }
    } catch (err) {
      console.error("Error loading thread", err);
    }
  };

  const newChat = () => {
    if (recentPrompt || resultData) {
      const newChatId = uuidv4();
      setSelectedChatId(newChatId);
      sessionStorage.setItem("selectedChatId", newChatId);

      setRecentPrompt("");
      setResultData("");
      setPrevPrompts([]); // ✅ reset prompt history
      setShowResult(false);
      setInput("");
    } else {
      toast.info("Start chatting before opening a new chat.");
    }
  };

  const fetchChatHistory = async (user) => {
    if (!user?.uid) return;
    try {
      const res = await fetch(`${baseUrl}/api/chat/history?userId=${user.uid}`);
      const data = await res.json();
      setChatHistory(Array.isArray(data) ? data : []);
      const storedId = sessionStorage.getItem("selectedChatId");
      if (storedId) handleChatClick({ chatId: storedId });
    } catch (err) {
      console.error("Error fetching chat history:", err);
      setChatHistory([]);
    }
  };

  const saveChatHistory = async (prompt, response, user) => {
    if (!user?.uid) return;
    try {
      await fetch(`${baseUrl}/api/chat/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          response,
          userId: user?.uid,
          chatId: selectedChatId,
        }),
      });
      fetchChatHistory(user);
    } catch (err) {
      console.error("Error saving chat history:", err);
    }
  };

  const onSent = async (customPrompt, user) => {
    const promptToSend = customPrompt || input;
    setInput("");
    setLoading(true);
    setShowResult(true);
    setResultData("");

    if (!customPrompt) {
      // ✅ Track only the latest 10 prompts
      setPrevPrompts((prev) => {
        const updated = [...prev, promptToSend];
        return updated.length > 10 ? updated.slice(-10) : updated;
      });
    }

    setRecentPrompt(promptToSend);
    let fullResponse = "";

    try {
      const res = await fetch(`${baseUrl}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToSend }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to get response from API");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setResultData((prev) => prev + chunk);
      }

      await saveChatHistory(promptToSend, fullResponse, user);
    } catch (error) {
      console.error("Streaming error:", error);
      setResultData("⚠️ Failed to load response.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedChatId = sessionStorage.getItem("selectedChatId");
    if (savedChatId) {
      setSelectedChatId(savedChatId);
    } else {
      const newChatId = uuidv4();
      setSelectedChatId(newChatId);
      sessionStorage.setItem("selectedChatId", newChatId);
    }
  }, []);

  useEffect(() => {
    if (user?.uid) fetchChatHistory(user);
  }, [user]);

  return (
    <Context.Provider
      value={{
        input,
        setInput,
        recentPrompt,
        setRecentPrompt,
        prevPrompts,
        setPrevPrompts,
        showResult,
        setShowResult,
        loading,
        resultData,
        chatHistory,
        setChatHistory,
        fetchChatHistory,
        onSent,
        newChat,
        handleChatClick,
        selectedChatId,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
