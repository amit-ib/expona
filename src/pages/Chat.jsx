import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import MessageInput from '../components/chat/MessageInput';
import ChatContent from '../components/chat/ChatContent';
import RightSidebar from '../components/chat/RightSidebar';
import LeftSidebar from '../components/chat/LeftSidebar';
import { chatContent, navigationItems } from '../data/chatData';
import TourPopup from '../components/layout/TourPopup';

const Chat = ({ setProjectsVisibility, projectsVisibility }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [showSavedNote, setShowSavedNote] = useState(false);
  const [sources, setSources] = useState(chatContent.sources);
  const [activeHash, setActiveHash] = useState(location.hash); // State to track active hash
  const [saved, setSaved] = useState(false); // Add saved state here
  const [isTourVisible, setIsTourVisible] = useState(false);
  // State to track if any document is checked
  const [isAnyDocumentChecked, setIsAnyDocumentChecked] = useState(true); // Initialize to true

  useEffect(() => {
    // Update activeHash when location.hash changes
    setActiveHash(location.hash);
  }, [location.hash]); // Depend on location.hash

  useEffect(() => {
    // Check local storage for tour status on component mount
    const tourSeen = localStorage.getItem('exponaTourSeen');
    if (!tourSeen) {
      setIsTourVisible(true);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Optional: Scroll to the element when activeHash changes, if needed
  // useEffect(() => {
  //   if (activeHash) {
  //     const element = document.getElementById(activeHash.substring(1));
  //     if (element) {
  //       element.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   }
  // }, [activeHash]);

  return (
    <div className="min-h-screen bg-gray-2d text-white flex flex-col">
      {/* Header */}
      <Header setProjectsVisibility={setProjectsVisibility} />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Main Content Area with Left Sidebar */}
        <div className="flex-1 flex px-2">
          {/* Back Button and Title Section */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between gap-4 py-5 px-5 border-b border-gray-42 bg-gray-24 rounded-t-lg">
              <div className='flex items-center'>
                <button
                  onClick={() => {
                    setProjectsVisibility(true);
                    navigate('/dashboard');
                  }}
                  className="flex items-center justify-center p-2 rounded bg-gray-2d  hover:bg-gray-37 transition-colors"
                >
                  <img src="/images/back-arrow.svg" width={16} alt="Back" />
                </button>
                <div className="flex items-center gap-3 group relative hover:bg-gray-24 p-1">
                  <span className="text-2xl"><img src="/images/chat-head-icon.png" alt="Expona" /></span>
                  <h1 className="text-lg font-medium flex items-center cursor-pointer ">{chatContent.title} <img
                    src="/images/edit-icon.svg"
                    alt="Edit Title"
                    className="ml-2  opacity-0 group-hover:opacity-100 transition-opacity"
                  /></h1>

                </div>
              </div>
              <button
                onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
                className="flex items-center justify-center p-2 rounded"
              >
                {/* <img src="/images/expand-collaps2.svg" alt="Expand" /> */}
              </button>
            </div>

            {/* Content Area with Left Sidebar */}
            <div className="flex flex-1 bg-gray-24">
              {/* Left Sidebar - Navigation */}
              <LeftSidebar navigationItems={navigationItems} activeHash={activeHash}
                collapsed={leftSidebarCollapsed}
                setCollapsed={setLeftSidebarCollapsed}
                showSavedNote={showSavedNote}
                sources={sources}
                setShowSavedNote={setShowSavedNote}
                setSaved={setSaved}
              />

              {/* Chat Content */}
              <div className="flex-1 relative">
                <div className="py-2 px-6">
                  <ChatContent chatContent={chatContent} navigate={navigate} setShowSavedNote={setShowSavedNote} sources={sources} saved={saved} setSaved={setSaved} projectsVisibility={projectsVisibility} />
                </div>

                {/* Message Input */}
                <div id="message-input" className="absolute bottom-0 left-0 right-0  pt-20 pb-8">
                  <div className="px-8">
                    <MessageInput message={message} setMessage={setMessage} isDisabled={!isAnyDocumentChecked || sources.length === 0} />
                  </div>
                </div>
              </div>
              {/* Right Sidebar - Documents/Notes */}
              <RightSidebar
                sources={sources}
                setSources={setSources}
                collapsed={rightSidebarCollapsed}
                setCollapsed={setRightSidebarCollapsed}
                onCheckedChange={setIsAnyDocumentChecked}
              />
            </div>
          </div>
        </div>


      </div>
      {/* Tour Popup */}
      <TourPopup isVisible={isTourVisible} onClose={() => setIsTourVisible(false)} />
      <div className='text-xs text-center p-1 text-gray-ae'>Expona analyzes tender files with AI. Review everything before you submit. Built by <a href='https:wwww.infobeans.com' target="blank" className='text-white underline'>InfoBeans</a>.</div>
    </div>
  );
};

export default Chat; 