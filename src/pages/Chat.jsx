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
import Modal from "../components/common/Modal";
import UploadAction from "../components/dashboard/UploadAction";
import { Link } from "react-router-dom";
import {
  uploadTenderFile,
  fetchTenderSummary,
  fetchTenderReport,
  fetchEligibility,
  fetchTenderList,
} from "../api/apiHelper";
import { useAuth } from "../contexts/AuthContext";
import { getCompanyIdFromUser } from "../utils";

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
  const hasUploaded = useRef(false);
  const { user } = useAuth();
  const [report, setReport] = useState(() => {
    const saved = localStorage.getItem("tenderReport");
    return saved ? JSON.parse(saved) : null;
  });
  const lastReportKey = useRef(null);
  const [tenderTitle, setTenderTitle] = useState(
    location.state?.title ||
      localStorage.getItem("tenderTitle") ||
      "Untitled Tender"
  );
  const [eligibilityData, setEligibilityData] = useState(null);
  const [isTenderListLoading, setIsTenderListLoading] = useState(false); // NEW STATE

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const file = location.state?.fileToUpload;

    if (file) {
      if (hasUploaded.current) return;
      hasUploaded.current = true;
      finalSummaryFlag.current = false; // Reset flag on new upload
      setHasFinalSummary(false); // Reset summary flag
      setReport("");
      const doUpload = async () => {
        setIsUploading(true);
        setUploadResponse(""); // Reset response state
        try {
          await uploadTenderFile(file, (chunk) => {
            setUploadResponse((prev) => {
              const summaryMarker = "<---FINAL_SUMMARY--->## TENDER SUMMARY";
              const analyzingMarker = "<---ANALYZE_PDF--->";
              let newContent = prev + chunk;

              // Remove all occurrences of the analyzing marker
              newContent = newContent.split(analyzingMarker).join("");

              const markerIndex = newContent.indexOf(summaryMarker);
              if (markerIndex !== -1) {
                finalSummaryFlag.current = true;
                setHasFinalSummary(true);
                // Remove everything before and including the summary marker
                // console.log("UPLOAD RESPONSE:", newContent);
                return newContent.substring(markerIndex + summaryMarker.length);
              } else {
                // Extract text after <---METADATA--->
                const metaMarker = "<---METADATA--->";
                const metaIndex = newContent.indexOf(metaMarker);
                if (metaIndex !== -1) {
                  const afterMeta = newContent.substring(
                    metaIndex + metaMarker.length
                  );
                  // Grab text before <br
                  const brIndex = afterMeta.indexOf("<br");
                  const extractedTitle =
                    brIndex !== -1
                      ? afterMeta.substring(0, brIndex)
                      : afterMeta;
                  localStorage.setItem("tenderTitle", extractedTitle.trim());
                  setTenderTitle(extractedTitle.trim());
                }

                return newContent;
              }
            });
          });
          // Fetch Final Tender Report
          try {
            setIsLoading(false);
            const companyId = localStorage.getItem("company_id");
            const fetchedReport = await fetchTenderReport({
              filename: file.name,
              company_id: companyId,
            });

            setReport(fetchedReport);
            localStorage.setItem("tenderReport", JSON.stringify(fetchedReport));
            // Set tenderId in localStorage from fetchedReport.tender_id
            console.log("NEW TENDER ID:", fetchedReport);
            if (fetchedReport && fetchedReport.data.tender_id) {
              localStorage.setItem("tenderId", fetchedReport.data.tender_id);
            }
            // Fetch tender list and store in localStorage
            try {
              setIsTenderListLoading(true); // START LOADING
              const tenderListResponse = await fetchTenderList({});
              if (tenderListResponse && tenderListResponse.data) {
                localStorage.setItem(
                  "tenderList",
                  JSON.stringify(tenderListResponse.data)
                );
                // setIsLoading(true) // REMOVE THIS LINE
              }
            } catch (err) {
              console.error("Failed to fetch tender list:", err);
            } finally {
              setIsTenderListLoading(false); // END LOADING
            }
          } catch (err) {
            console.error("fetchTenderReport error:", err);
          }

          // ****************************
          // if (hasFinalSummary) {
          //   const fetchSummaryWithDelay = async () => {
          //     try {
          //       await new Promise(res => setTimeout(res, 10000)); // 5 second delay
          //       const data = await fetchTenderSummary();
          //       console.log('fetchTenderSummary output:', data);
          //       if (Array.isArray(data.data) && data.data.length > 0) {
          //         const lastSummary = data.data[data.data.length - 1].summary;
          //         if (lastSummary) {

          //           setUploadResponse(lastSummary);

          //         }
          //       }
          //     } catch (err) {
          //       console.error('fetchTenderSummary error:', err);
          //     }
          //   };
          //   fetchSummaryWithDelay();
          // }
        } catch (error) {
          console.error("Tender upload error:", error);
          setUploadResponse("Upload failed");
        } finally {
          setIsUploading(false);

          // Wait 1 seconds after streaming completes, then log uploadResponse
          setTimeout(async () => {
            // console.log('Upload response after 2s:', uploadResponse);
            try {
              const data = await fetchTenderSummary();
              if (Array.isArray(data.data) && data.data.length > 0) {
                const lastSummary = data.data[data.data.length - 1].summary;
                if (lastSummary) {
                  // console.log('lastSummary:', lastSummary);
                  setUploadResponse(lastSummary);
                }
              }
              // Fetch eligibility after summary
              const companyId = localStorage.getItem("company_id");
              if (file && companyId) {
                const eligibility = await fetchEligibility({
                  filename: file.name,
                  company_id: companyId,
                });
                setEligibilityData(eligibility);
                console.log("Eligibility data after upload:", eligibility);
              }
            } catch (err) {
              console.error(
                "fetchTenderSummary or fetchEligibility error:",
                err
              );
            }
          }, 1000);
        }
      };
      doUpload();
      // Clear the file from the state so it doesn't re-upload
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, fileToUpload: null },
      });
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
    const tenderFile = location.state?.filename;

    if (tenderId) {
      // Fetch summary
      const fetchSummary = async () => {
        try {
          const response = await fetchTenderSummary();
          const summaryObj = response.data.find((item) => item.id === tenderId);
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

      // Prevent double fetch for the same tenderId and filename
      const reportKey = `${tenderId}_${tenderFile}`;
      if (lastReportKey.current === reportKey) return;
      lastReportKey.current = reportKey;

      // Fetch report and then eligibility after a delay
      const fetchReportThenEligibility = async () => {
        try {
          const companyId = localStorage.getItem("company_id");
          const filename = tenderFile;
          if (filename && companyId) {
            // Fetch and display report first
            const fetchedReport = await fetchTenderReport({
              filename,
              company_id: companyId,
            });
            setReport(fetchedReport);
            localStorage.setItem("tenderReport", JSON.stringify(fetchedReport));
            console.log(
              "fetchTenderReport output (from fetchReport):",
              fetchedReport
            );

            // After a short delay, fetch eligibility in the background
            setTimeout(() => {
              fetchEligibility({ filename, company_id: companyId })
                .then((eligibilityData) => {
                  console.log("Eligibility data:", eligibilityData.data);
                  setEligibilityData(eligibilityData);
                })
                .catch((eligErr) => {
                  console.error("fetchEligibility error:", eligErr);
                });
            }, 1000); // 1 second delay
          }
        } catch (err) {
          console.error("fetchTenderReport error (from fetchReport):", err);
        }
      };
      fetchReportThenEligibility();
    }
  }, [location.state, user]);

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
                isLoading={isLoading || isUploading || !report}
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
                      <h1
                        className="text-lg font-medium flex items-center cursor-pointer pl-3 "
                        title={tenderTitle}
                      >
                        {tenderTitle && tenderTitle.length > 80
                          ? `${tenderTitle.slice(0, 80)}...`
                          : tenderTitle}
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
                  <button
                    id="eligibility-btn"
                    className="bg-expona-red rounded-md p-3 flex items-center relative overflow-hidden transition-all w-12 duration-700 group hover:w-56"
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    <img
                      src="images/speedometer-icon.svg"
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
                    isLoading={isLoading || isUploading || isTenderListLoading}
                    sources={sources}
                    setSources={setSources}
                    collapsed={rightSidebarCollapsed}
                    setCollapsed={setRightSidebarCollapsed}
                    onCheckedChange={setIsAnyDocumentChecked}
                    isTenderListLoading={isTenderListLoading}
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
        />
      </Modal>
    </div>
  );
};

// Helper function to poll for tender report
async function pollForTenderReport(
  { filename, company_id },
  maxAttempts = 20,
  delayMs = 30000
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const report = await fetchTenderReport({ filename, company_id });
      return report; // Success!
    } catch (err) {
      if (
        err.response &&
        err.response.status === 404 &&
        attempt < maxAttempts
      ) {
        // Wait and retry
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        throw err; // Other errors or max attempts reached
      }
    }
  }
  throw new Error("Report not available after multiple attempts");
}

// Standalone function to fetch and log eligibility
async function fetchAndLogEligibility({ filename, company_id }) {
  try {
    const eligibilityData = await fetchEligibility({ filename, company_id });
    console.log("Eligibility data:", eligibilityData);
  } catch (eligErr) {
    console.error("fetchEligibility error:", eligErr);
  }
}

export default Chat;
