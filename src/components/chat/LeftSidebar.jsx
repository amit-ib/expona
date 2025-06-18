import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Tooltip from "../common/Tooltip";
import InfoTooltip from "../common/InfoTooltip";
import { useNavigate } from "react-router-dom";

const LeftSidebar = ({
  navigationItems,
  activeHash,
  collapsed,
  setCollapsed,
  showSavedNote,
  sources = [],
  setShowSavedNote,
  setSaved,
  onNewTenderClick,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const profileToggleRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
    setShowProfileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileToggleRef.current &&
        !profileToggleRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  // Log activeHash and navigationItems on mount and when activeHash changes
  // React.useEffect(() => {
  //   // console.log('LeftSidebar activeHash:', activeHash);
  //   // console.log('LeftSidebar navigationItems:', navigationItems);
  // }, [activeHash, navigationItems]);
  console.log(user, "user in LeftSidebar");
  return (
    <div
      id="left-sidebar"
      className={`flex relative flex-col  bg-gray-2d  transition-all duration-500 ${collapsed ? "w-[70px] " : "w-[300px]  "
        }`}
    >
      <button
        className={`absolute transition-all duration-500 top-8 flex items-center justify-center z-10 hover:bg-gray-32 rounded-full ${collapsed ? "right-5" : "right-3"
          }`}
        style={{ minWidth: 35 }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <Tooltip
          tooltipContent="Key Areas"
          position="right"
          showCondition={collapsed}
        >
          <img
            src="/images/expand-collaps.svg"
            alt="Toggle sidebar"
            height={24}
            width={24}
          />
        </Tooltip>
      </button>
      <div
        className={`relative items-center transition-all duration-300  px-5 py-6  ${collapsed ? "-left-48  opacity-0" : "left-0"
          }`}
      >
        {/* ${collapsed ? 'justify-left px-0 py-3 ' : 'justify-between px-4 py-8  border-gray-42'} */}

        <img
          src="/images/expona-logo.svg"
          className={`transition-all  `}
          alt="Expona"
        />
        {/* ${collapsed ? '-left-48  opacity-0' : ''} */}
        {/* {!collapsed && (
          <div className={`flex itemss-center relative  ${collapsed ? 'opacity-0' : ''}`}>
            Key Areas
            <InfoTooltip tooltipContent="Key points helps you to  quickly return to important responses. Some are suggested by AI to get you started. You can add more as you go.">
              <img src="images/help-icon.svg" alt="help" className='ml-1 cursor-pointer group' />
            </InfoTooltip>
          </div>
        )} */}

        <div className="my-8">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-4 py-2  text-gray-ae bg-transparent border border-gray-4f rounded-md placeholder:text-gray-99 outline-none search-icon transition-opacity duration-300"
          />
        </div>

        {sources.length > 0 ? (
          <div className="py-3 flex flex-col transition-all duration-500">
            {/* {!collapsed && ( */}
            <div className="flex itemss-center transition-all duration-500 text-gray-99 mb-4 relative text-xs">
              Key Areas
              <InfoTooltip
                tooltipContent="Key points helps you to  quickly return to important responses. Some are suggested by AI to get you started. You can add more as you go."
                position="right"
              >
                <img
                  src="images/help-icon.svg"
                  alt="help"
                  className="ml-1 cursor-pointer group"
                />
              </InfoTooltip>
            </div>
            {/* )} */}
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`w-full text-left px-2 py-2 text-sm relative ${(activeHash === "" && index === 0) ||
                    item.link.substring(item.link.indexOf("#")) === activeHash
                    ? "text-white font-medium before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1.5px] before:bg-expona-red"
                    : "text-gray-ae hover:text-white font-light"
                  }`}
              >
                {item.title}
              </a>
            ))}
            {showSavedNote && (
              <div className={`border-t border-gray-42 pt-4 px-2 mt-2`}>
                <div className="flex items-center relative text-sm text-gray-ae  ">
                  Saved by You
                  <InfoTooltip
                    tooltipContent="You can add key points to quickly return to important responses."
                    position="right"
                  >
                    <img
                      src="images/help-icon.svg"
                      alt="help"
                      className="ml-1 cursor-pointer group"
                    />
                  </InfoTooltip>
                </div>
                <div className="py-2">
                  <div className="relative w-full">
                    <a
                      href="#"
                      className="w-full text-left py-3 text-sm relative text-gray-ae hover:text-white font-light flex justify-between items-center group"
                    >
                      Pre-submission Checklist
                      <Tooltip tooltipContent="Remove" position="bottom">
                        <button
                          className="hidden group-hover:inline-block"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (setShowSavedNote) setShowSavedNote(false);
                            if (setSaved) setSaved(false);
                          }}
                        >
                          <img src="/images/delete-icon.svg" alt="Delete" />
                        </button>
                      </Tooltip>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // !collapsed && (
          <div
            className={`text-xs py-6 px-4  transition-all duration-300 ${collapsed ? "opacity-0" : ""
              }`}
          >
            It looks quiet here. Upload a tender to see key areas show up.
          </div>
          // )
        )}
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 py-4  flex items-center justify-between transition-all duration-500 ${collapsed ? "px-3" : "px-5"
          }`}
      >
        <div className="relative w-full">
          <button
            id="new-tender-btn"
            className={`border flex items-center justify-center  rounded-md ${collapsed ? "p-2" : "w-full p-3"
              }`}
            onClick={onNewTenderClick}
          >
            <img src="images/add-icon.svg" alt="Add new tender" />
            <span
              className={`transition-all duration-500 delay-200 ${collapsed ? "opacity-0 -left-48 absolute" : ""
                }`}
            >
              New Tender
            </span>
          </button>
          <div
            className="flex relative items-center border-t border-gray-42 pt-3 mt-4 cursor-pointer"
            onClick={handleProfileClick}
            ref={profileToggleRef}
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user?.name || "User avatar"}
                className="w-10 h-10 rounded-full absolute"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm absolute">
                {user?.initials || "U"}
              </div>
            )}
            <div
              className={`flex ml-14 flex-col transition-all duration-800 ${collapsed ? "opacity-0 " : ""
                }`}
            >
              <span className="text-white text-base font-medium">
                {user?.name || "User"}
              </span>
              <span className="text-gray-ae text-sm">
                {user?.email || "user@example.com"}
              </span>
            </div>
          </div>
          {showProfileMenu && (
            <div
              className="absolute bottom-11 left-0 px-2 w-52 mb-2 bg-gray-32 rounded-md border border-gray-4f shadow-lg py-4 z-50"
              ref={profileMenuRef}
            >
              <a
                href="/company-profile"
                className="flex items-center rounded px-4 py-2 text-white hover:bg-gray-42"
              >
                <img
                  src="/images/user-icon.svg"
                  alt="Profile"
                  className="w-5 h-5 mr-3"
                />
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center rounded px-4 py-2 text-white hover:bg-gray-42 w-full"
              >
                <img
                  src="/images/logout-icon.svg"
                  alt="Logout"
                  className="w-5 h-5 mr-3"
                />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* <button className="text-gray-ae hover:text-white">
          <span className="text-xl font-bold">...</span>
        </button> */}
      </div>
    </div>
  );
};

export default LeftSidebar; 
