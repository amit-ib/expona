import React, { useState, useEffect, useRef } from "react";
// import Header from "../components/layout/Header";
import { useNavigate, useLocation } from "react-router-dom";
import MessageInput from "../components/chat/MessageInput";
import ChatContent from "../components/chat/ChatContent";
import RightSidebar from "../components/chat/RightSidebar";
import LeftSidebar from "../components/chat/LeftSidebar";
import { chatContent, navigationItems } from "../data/chatData";
import TourPopup from "../components/layout/TourPopup";
import RightSideDrawer from "../components/layout/RightSideDrawer";
import Modal from '../components/common/Modal';
import UploadAction from '../components/dashboard/UploadAction';
import { Link } from 'react-router-dom';
import { uploadTenderFile, fetchTenderSummary } from "../api/apiHelper";
// import Loader from "../components/common/Loader";

const Chat = ({ setProjectsVisibility, projectsVisibility }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [showSavedNote, setShowSavedNote] = useState(false);
  const [sources, setSources] = useState(chatContent.sources);
  const [activeHash, setActiveHash] = useState(location.hash); // State to track active hash
  const [saved, setSaved] = useState(false); // Add saved state here
  const [isTourVisible, setIsTourVisible] = useState(false);
  // State to track if any document is checked
  const [isAnyDocumentChecked, setIsAnyDocumentChecked] = useState(true); // Initialize to true
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // New state for drawer visibility
  const [isModalOpen, setIsModalOpen] = useState(false); // State for New Tender modal
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState("");
  const [hasFinalSummary, setHasFinalSummary] = useState(false);
  const finalSummaryFlag = useRef(false);
  const [storedSummary, setStoredSummary] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const file = location.state?.fileToUpload;
    if (file) {
      finalSummaryFlag.current = false; // Reset flag on new upload
      setHasFinalSummary(false); // Reset summary flag
      const doUpload = async () => {
        setIsUploading(true);
        setUploadResponse(""); // Reset response state
        try {
          await uploadTenderFile(file, (chunk) => {
            setUploadResponse(prev => {
              const summaryMarker = "<---FINAL_SUMMARY--->## TENDER SUMMARY";
              const analyzingMarker = "<-------Analyze PDF--------";
              let newContent = prev + chunk;

              // Remove all occurrences of the analyzing marker
              newContent = newContent.split(analyzingMarker).join("");

              const markerIndex = newContent.indexOf(summaryMarker);
              if (markerIndex !== -1) {
                finalSummaryFlag.current = true;
                setHasFinalSummary(true);
                // Remove everything before and including the summary marker
                return newContent.substring(markerIndex + summaryMarker.length);
              } else {
                return newContent;
              }
            });
          });
        } catch (error) {
          console.error("Tender upload error:", error);
          setUploadResponse("Upload failed");
        } finally {
          setIsUploading(false);
        }
      };
      doUpload();
      // Clear the file from the state so it doesn't re-upload
      navigate(location.pathname, { replace: true, state: { ...location.state, fileToUpload: null } });
    }
  }, [location, navigate]);

  useEffect(() => {
    // Update activeHash when location.hash changes
    setActiveHash(location.hash);
  }, [location.hash]); // Depend on location.hash

  useEffect(() => {
    // Check local storage for tour status on component mount
    const tourSeen = localStorage.getItem("exponaTourSeen");
    if (!tourSeen) {
      setIsTourVisible(true);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const tenderId = location.state?.id;
    if (tenderId) {
      const fetchSummary = async () => {
        try {
          const response = await fetchTenderSummary();
          const summaryObj = response.data.find(item => item.id === tenderId);
          if (summaryObj) {
            setStoredSummary(summaryObj.summary);
          } else {
            setStoredSummary("");
          }
        } catch (err) {
          setStoredSummary("");
        }
      };
      fetchSummary();
    }
  }, [location.state]);

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
      {/* <Header setProjectsVisibility={setProjectsVisibility} /> */}

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Main Content Area with Left Sidebar */}
        <div className="flex-1 flex ">
          {/* Back Button and Title Section */}
          <div className="flex flex-col flex-1">
            {/* Content Area with Left Sidebar */}
            <div className="flex flex-1 bg-gray-24">
              {/* Left Sidebar - Navigation */}
              <LeftSidebar
                isLoading={isLoading || isUploading}
                navigationItems={navigationItems}
                activeHash={activeHash}
                collapsed={leftSidebarCollapsed}
                setCollapsed={setLeftSidebarCollapsed}
                showSavedNote={showSavedNote}
                sources={sources}
                setShowSavedNote={setShowSavedNote}
                setSaved={setSaved}
                onNewTenderClick={openModal}
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-4 py-6 px-5 border-b border-gray-42 bg-gray-24 rounded-t-lg">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setProjectsVisibility(true);
                        navigate("/dashboard");
                      }}
                      className="flex items-center justify-center p-3 rounded-md bg-gray-2d  hover:bg-gray-37 transition-colors border border-gray-4f"
                    >
                      <img src="/images/back-arrow.svg" width={16} alt="Back" />
                    </button>
                    <div className="flex items-center gap-3 group relative hover:bg-gray-24 p-1">
                      {/* <span className="text-2xl">
                        <img src="/images/chat-head-icon.png" alt="Expona" />
                      </span> */}
                      <h1 className="text-lg font-medium flex items-center cursor-pointer pl-3 ">
                        {chatContent.title} {" "}
                        <img
                          src="/images/edit-icon.svg"
                          alt="Edit Title"
                          className="ml-2  opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </h1>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setRightSidebarCollapsed(!rightSidebarCollapsed)
                    }
                    className="flex items-center justify-center p-2 rounded"
                  >
                    {/* <img src="/images/expand-collaps2.svg" alt="Expand" /> */}
                  </button>
                  <button id="eligibility-btn" className="bg-expona-red rounded-md p-3 flex items-center relative overflow-hidden transition-all w-12 duration-700 group hover:w-56" onClick={() => setIsDrawerOpen(true)}>
                    <img src="images/speedometer-icon.svg" alt="Speedometer icon" className="flex-shrink-0" />
                    <span className="pl-2 whitespace-nowrap relative opacity-0  transition-all  duration-500 group-hover:right-0   group-hover:opacity-100 ">
                      Check Your Eligibility
                    </span>
                  </button>
                </div>
                <div className="flex flex-1">
                  {/* Chat Content */}
                  <div className="flex-1 relative max-w-[730px] mx-auto px-5">
                    <div className="py-2 ">
                      <ChatContent
                        isLoading={isLoading || isUploading}
                        chatContent={chatContent}
                        navigate={navigate}
                        setShowSavedNote={setShowSavedNote}
                        sources={sources}
                        saved={saved}
                        setSaved={setSaved}
                        projectsVisibility={projectsVisibility}
                        uploadResponse={uploadResponse}
                        hasFinalSummary={hasFinalSummary}
                        storedSummary={storedSummary}
                      />
                    </div>
                    {/* Message Input Section */}
                    {!isLoading && (
                      <MessageInput
                        message={message}
                        setMessage={setMessage}
                        isAnyDocumentChecked={isAnyDocumentChecked}
                      />
                    )}
                  </div>
                  {/* Right Sidebar - Documents/Notes */}
                  <RightSidebar
                    isLoading={isLoading || isUploading}
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
        </div>
      </div>
      {/* Tour Popup */}
      <TourPopup
        isVisible={isTourVisible}
        onClose={() => setIsTourVisible(false)}
      />

      {/* Overlay for the drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-40 transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}

      <RightSideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        {/* Content for the drawer goes here */}
        <h2 className="text-white text-lg">Check Your Eligibility Content</h2>
        <p className="text-gray-400">More information will go here.</p>
      </RightSideDrawer>

      {/* New Tender Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} size="large">
        <Link to="/dashboard" className="text-white border border-gray-ae px-4 py-2 rounded-md hover:bg-gray-2d -mt-4 absolute top-9 left-5">My Projects</Link>
        <UploadAction projectsVisibility={false} fullHeight={true} onFileSelect={closeModal} />
      </Modal>
    </div >
  );
};

export default Chat;
