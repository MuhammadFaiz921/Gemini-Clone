import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Header from "./components/Header";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex">
      {/* Sidebar (fixed width or collapsible) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Area (header + content) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <Header toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        {/* MainContent handles chat + input */}
        <MainContent />
      </div>
    </div>
  );
};

export default App;
