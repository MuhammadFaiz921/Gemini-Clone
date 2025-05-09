import React, { useContext, useEffect, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { BiSend } from "react-icons/bi";
import { Context } from "../context/Context";
import { useAuth } from "../context/authContext";
import { useVoiceInput } from "../useVoiceInput";
import geminiLogo from "../assets/geminiLogo.png";
import ReactMarkdown from "react-markdown";

const MainContent = () => {
  const {
    input,
    setInput,
    recentPrompt,
    showResult,
    loading,
    resultData,
    onSent,
  } = useContext(Context);

  const { user } = useAuth();
  const {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput();

  const hasManuallyTyped = useRef(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!hasManuallyTyped.current && transcript.trim()) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  const handleInputChange = (e) => {
    hasManuallyTyped.current = true;
    setInput(e.target.value);
  };

  const handleMicClick = () => {
    if (listening) {
      stopListening();
    } else {
      resetTranscript();
      hasManuallyTyped.current = false;
      startListening();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [resultData]);

  return (
    <main className="flex flex-col h-[calc(100vh-74px)]">
      <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 sm:px-6 py-6 max-w-5xl w-full mx-auto">
        {!showResult ? (
          <div className="flex flex-col justify-center items-center h-full gap-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-medium">
              <span className="bg-gradient-to-r from-[#368ddd] to-[#ff5546] bg-clip-text text-transparent">
                Hello, {user?.displayName || "Guest"}.
              </span>
            </h2>
            <p className="text-slate-800 text-base sm:text-lg">How can I help you today?</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <img src={user?.photoURL || "/user.jpg"} alt="User" className="rounded-full h-10 w-10 object-cover" />
              <p className="bg-white text-gray-800 p-4 rounded-xl flex-1 text-sm sm:text-base break-words">{recentPrompt}</p>
            </div>

            <div className="flex items-start gap-3">
              <img src={geminiLogo} alt="Gemini logo" className="h-10 w-10 rounded-full" />
              <div className="bg-white text-gray-800 p-4 rounded-xl flex-1 text-sm sm:text-base break-words">
                {loading && !resultData ? (
                  <div className="space-y-2 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-gradient-to-r from-blue-400 via-blue-100 to-blue-300 rounded w-full" />
                    ))}
                  </div>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ node, children }) => <p className="mb-3">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-6 mb-3">{children}</ul>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className="bg-gray-100 rounded px-1 py-0.5 text-red-500">{children}</code>
                        ) : (
                          <pre className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto text-sm">
                            <code>{children}</code>
                          </pre>
                        ),
                    }}
                  >
                    {resultData}
                  </ReactMarkdown>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="px-4 sm:px-6 pb-4 w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 sm:px-6 py-3">
          <input
            type="text"
            placeholder="Enter a prompt here..."
            className="flex-grow bg-transparent outline-none text-sm sm:text-base"
            value={input}
            onChange={handleInputChange}
          />
          <div className="flex items-center gap-3 text-xl sm:text-2xl text-gray-800">
            <MdAddPhotoAlternate className="cursor-pointer" />
            <FaMicrophone
              onClick={handleMicClick}
              className={`cursor-pointer ${listening ? "text-red-500 animate-pulse" : "text-gray-800"}`}
              title={listening ? "Listening..." : "Click to speak"}
              aria-label="Voice input"
            />
            {input && (
              <BiSend
                onClick={() => onSent(undefined, user)}
                className="cursor-pointer"
                title="Send"
                aria-label="Send message"
              />
            )}
          </div>
        </div>
        <div className="pt-2 text-xs text-center text-gray-500">
          Gemini may display inaccurate info, including about people, so double-check its responses.
        </div>
      </footer>
    </main>
  );
};

export default MainContent;
