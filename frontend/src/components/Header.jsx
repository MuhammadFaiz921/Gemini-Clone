import React from "react";
import { IoMdArrowDropdown, IoMdMenu } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
import { SiGooglegemini } from "react-icons/si";
import { useAuth } from "../context/authContext";
import { FaUserCircle } from "react-icons/fa"; // Updated to FaUserCircle

const Header = ({ toggleSidebar }) => {
  const { user, login, logout } = useAuth();

  return (
    <div className="w-full flex h-[74px] items-center px-4 leading-5 bg-white justify-between border-b border-gray-200 relative z-40">
      {/* Left section: Sidebar toggle + Gemini */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="rounded-full hover:bg-gray-200 p-2"
          aria-label="Toggle sidebar"
        >
          <IoMdMenu className="text-2xl" />
        </button>
        <div className="flex items-center text-[20px] font-[300] tracking-wide gap-1 hover:bg-gray-200 py-2.5 px-3 rounded-lg">
          <span>Gemini Clone</span>
          <IoMdArrowDropdown className="mt-[1px] text-[16px]" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Try Gemini Advanced (Hidden on small screens) */}
        <div className="hidden lg:flex items-center bg-gray-200 px-6 py-2 rounded-lg text-[12px] gap-2">
          <SiGooglegemini className="text-amber-600 text-[18px]" />
          <p>Try Gemini Advanced</p>
        </div>

        {/* Grid icon (Hidden on small screens) */}
        <div className="hidden lg:block rounded-full p-2 hover:bg-gray-100">
          <TbGridDots className="text-gray-800 text-[20px]" />
        </div>

        {/* User avatar */}
        <div
          className="h-10 w-10 border-opacity-0 border-4 border-gray-200 rounded-full hover:border-opacity-100 cursor-pointer"
          onClick={user ? logout : login}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="rounded-full w-full h-full object-cover" />
          ) : (
            <FaUserCircle className="w-full h-full text-gray-800" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
