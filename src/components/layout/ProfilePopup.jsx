import React, { useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    navigate("/signin");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 top-10 mt-2 rounded-lg shadow-lg bg-gray-32 border border-gray-4f z-50 p-4 w-[366px]"
      ref={popupRef}
    >
      <div className="flex flex-col items-center text-center mb-4">
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user?.name || "User avatar"}
            className="w-12 h-12 rounded-full mb-2"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-semibold mb-2">
            {user?.initials || "U"}
          </div>
        )}
        <div className="font-semibold text-sm mb-1 text-white">
          {user?.name || "User"}
        </div>
        <div className="text-xs text-gray-ae mb-4">
          {user?.email || "user@example.com"}
        </div>
      </div>

      <div className="flex mt-2 w-9/12 mx-auto">
        <button
          className="flex-1 flex items-center justify-center px-4 py-4 text-sm rounded-l-full bg-gray-42 hover:bg-gray-24 border-r border-gray-4f"
          onClick={() => {
            navigate("/company-profile");
            onClose();
          }}
        >
          <img
            src="/images/setting-icon.svg"
            alt="Settings"
            className="mr-2 w-4 h-4"
          />
          Settings
        </button>
        <button
          className="flex-1 flex items-center justify-center px-4 py-4 text-sm rounded-r-full bg-gray-42 hover:bg-gray-24"
          onClick={handleLogout}
        >
          <img
            src="/images/logout-icon.svg"
            alt="Logout"
            className="mr-2 w-4 h-4"
          />
          Logout
        </button>
      </div>

      <div className="absolute top-4 right-4">
        <button>
          <img src="/images/dark-mode.svg" alt="Toggle dark mode" />
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
