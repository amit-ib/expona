import React from "react";
import MessageInput from "../components/chat/MessageInput";
import ChatContent from "../components/chat/ChatContent";
import RightSidebar from "../components/chat/RightSidebar";
import LeftSidebar from "../components/chat/LeftSidebar";
import { chatContent, navigationItems } from "../data/chatData";
import TourPopup from "../components/layout/TourPopup";
import RightSideDrawer from "../components/layout/RightSideDrawer";
import Modal from "../components/common/Modal";
import UploadAction from "../components/dashboard/UploadAction";
import { Link } from "react-router-dom";
import { useChatData } from "../hooks/useChatData";
import { useNavigate, useLocation } from "react-router-dom";
import { useChat } from "../hooks/useChat";

const Chat = ({ projectsVisibility }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    message,
    setMessage,
    rightSidebarCollapsed,
    setRightSidebarCollapsed,
    leftSidebarCollapsed,
    setLeftSidebarCollapsed,
    showSavedNote,
    setShowSavedNote,
    sources,
    setSources,
    activeHash,
    saved,
    setSaved,
    isTourVisible,
    setIsTourVisible,
    isDrawerOpen,
    setIsDrawerOpen,
    isModalOpen,
    isLoading,
    isUploading,
    uploadResponse,
    hasFinalSummary,
    storedSummary,
    setStoredSummary,
    report,
    tenderTitle,
    eligibilityData,
    isTenderListLoading,
    showErrorModal,
    setShowErrorModal,
    openModal,
    closeModal,
    isNewTender,
    setIsNewTender,
    isReevaluate,
    setIsReevaluate,
    isEditingTitle,
    editedTitle,
    setEditedTitle,
    handleEditTitle,
    handleSaveTitle,
    handleCancelEdit,
  } = useChatData();
  const [pendingMessage, _setPendingMessage] = React.useState(null);
  // Custom setter to log whenever pendingMessage is updated from MessageInput
  const setPendingMessage = React.useCallback((msg) => {
    _setPendingMessage(msg);
    // console.log("Pending Message:", msg);
  }, []);
  const [qnaResponse, setQnaResponse] = React.useState(null);
  const { handleSendMessage } = useChat(
    report,
    message,
    setMessage,
    setQnaResponse
  );

  // Optional: Scroll to the element when activeHash changes, if needed
  // useEffect(() => {
  //   if (activeHash) {
  //     const element = document.getElementById(activeHash.substring(1));
  //     if (element) {
  //       element.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   }
  // }, [activeHash]);
  // console.log("IsUploading", isLoading);
  // console.log("Pending Message:", pendingMessage); // Now handled in setPendingMessage
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
                // isLoading={isLoading || isUploading || !report}
                isLoading={!report}
                navigationItems={navigationItems}
                activeHash={activeHash}
                collapsed={leftSidebarCollapsed}
                setCollapsed={setLeftSidebarCollapsed}
                showSavedNote={showSavedNote}
                sources={sources}
                setShowSavedNote={setShowSavedNote}
                setSaved={setSaved}
                onNewTenderClick={openModal}
                setIsNewTender={setIsNewTender}
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-4 py-6 px-5 border-b border-gray-42 bg-gray-24 rounded-t-lg">
                  <div className="flex items-center  w-[78%]">
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                      }}
                      className="flex items-center justify-center p-3 rounded-md bg-gray-2d  hover:bg-gray-37 transition-colors border border-gray-4f"
                    >
                      <img src="/images/back-arrow.svg" width={16} alt="Back" />
                    </button>
                    <div className="flex items-center gap-3 group relative hover:bg-gray-24 p-1 w-full">
                      {/* <span className="text-2xl">
                        <img src="/images/chat-head-icon.png" alt="Expona" />
                      </span> */}
                      {isEditingTitle ? (
                        <div className="flex items-center w-full">
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="flex-1 bg-gray-2d border border-gray-5c rounded px-2 py-1.5 text-lg font-medium"
                          />
                          <button
                            onClick={handleSaveTitle}
                            className="ml-2 px-3 py-2 bg-expona-red text-white rounded-md"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="ml-2 px-3 py-2 bg-gray-5c text-white rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <h1
                          className="text-lg font-medium flex items-center cursor-pointer pl-3 "
                          title={tenderTitle}
                        >
                          {tenderTitle && tenderTitle.length > 80
                            ? `${tenderTitle.slice(0, 80)}...`
                            : tenderTitle}
                          <button alt="Edit Title" onClick={handleEditTitle}>
                            <img
                              src="/images/edit-icon.svg"
                              alt="Edit Title"
                              className="ml-2  opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </button>
                        </h1>
                      )}
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
                  <button
                    id="eligibility-btn"
                    className="bg-expona-red rounded-md p-3 flex items-center relative overflow-hidden transition-all w-12 duration-700 group hover:w-56"
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    <img
                      src="/images/speedometer-icon.svg"
                      alt="Speedometer icon"
                      className="flex-shrink-0"
                    />
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
                        setStoredSummary={setStoredSummary}
                        report={report}
                        errorModal={showErrorModal}
                        setErrorModal={setShowErrorModal}
                        qnaResponse={qnaResponse}
                        setPendingMessage={setPendingMessage}
                        pendingMessage={pendingMessage}
                        onSendMessage={handleSendMessage}
                      />
                    </div>
                    {/* Chat - Message Input Section */}
                    {!isLoading && (
                      <MessageInput
                        message={message}
                        setMessage={setMessage}
                        onSendMessage={handleSendMessage}
                        setPendingMessage={setPendingMessage}
                      />
                    )}
                  </div>
                  {/* Right Sidebar - Documents/Notes */}
                  <RightSidebar
                    isLoading={isTenderListLoading || isUploading}
                    sources={sources}
                    setSources={setSources}
                    collapsed={rightSidebarCollapsed}
                    setCollapsed={setRightSidebarCollapsed}
                    isTenderListLoading={isTenderListLoading}
                    onUploadNewTenderDoc={() => {
                      setIsReevaluate(true);
                      openModal();
                    }}
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

      <RightSideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        company_id={localStorage.getItem("company_id")}
        filename={location.state?.filename}
        eligibilityData={eligibilityData}
      >
        {/* Content for the drawer goes here */}
        <h2 className="text-white text-lg">Check Your Eligibility Content</h2>
        <p className="text-gray-400">More information will go here.</p>
      </RightSideDrawer>

      {/* New Tender Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} size="large">
        <Link
          to="/dashboard"
          className="text-white border border-gray-ae px-4 py-2 rounded-md hover:bg-gray-2d -mt-4 absolute top-9 left-5"
        >
          My Projects
        </Link>
        <UploadAction
          projectsVisibility={false}
          fullHeight={true}
          onFileSelect={closeModal}
          isNewTender={isNewTender}
          setIsNewTender={setIsNewTender}
        />
      </Modal>
    </div>
  );
};

// Standalone function to fetch and log eligibility
// async function fetchAndLogEligibility({ filename, company_id }) {
//   try {
//     const eligibilityData = await fetchEligibility({ filename, company_id });
//     // console.log("Eligibility data:", eligibilityData);
//   } catch (eligErr) {
//     console.error("fetchEligibility error:", eligErr);
//   }
// }

export default Chat;
