import React, { useContext, useState } from "react";
import { FaMessage } from "react-icons/fa6";
import { MdOutlineSettings } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Context } from "../context/Context";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [visibleCount] = useState(5);
  const {
    chatHistory = [],
    handleChatClick,
    selectedChatId,
    newChat,
  } = useContext(Context);

  return (
    <div
      className={`bg-gray-100 h-screen transition-all duration-300 absolute top-0 left-0 z-30 ${
        isOpen ? "w-72 sm:w-80" : "w-0"
      } overflow-hidden`}
      style={{ paddingTop: "74px" }} // matches header height
    >
      <div className="flex flex-col h-full">
        {/* New Chat Button */}
        <div className="px-4 py-2">
          <button
            onClick={newChat}
            className="w-full flex items-center gap-2 justify-center sm:justify-start bg-gray-200 text-sm text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-full transition"
          >
            <FaMessage />
            {isOpen && <span className="hidden sm:inline">New Chat</span>}
          </button>
        </div>

        {/* Recent Chats */}
        <div className={`flex-grow overflow-y-auto px-2 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}>
          <p className="px-2 py-2 text-sm font-medium text-gray-900">Recent</p>
          <div className="flex flex-col gap-1">
            {chatHistory.slice(0, visibleCount).map((chat) => (
              <div
                key={chat.chatId}
                onClick={() => handleChatClick(chat)}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-full hover:bg-gray-200 cursor-pointer ${
                  selectedChatId === chat.chatId ? "bg-gray-300" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FaMessage className="text-[15px]" />
                  <span className="truncate text-sm max-w-[160px] sm:max-w-[180px]">
                    {chat.title?.slice(0, 50) || "Untitled"}
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <BsThreeDotsVertical />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        {isOpen && (
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between gap-2 text-sm text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-full cursor-pointer">
              <div className="flex items-center gap-3">
                <MdOutlineSettings className="text-[18px]" />
                <span>Settings & Help</span>
              </div>
              <GoDotFill className="text-blue-700" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
