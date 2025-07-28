import React from "react";
import ChatActions from "./ChatActions";
import Markdown from "react-markdown";
import UploadAction from "../dashboard/UploadAction";
import { fetchTenderSummary } from "../../api/apiHelper";
import { markdownComponents } from "../../utils";

import Lottie from "lottie-react";
import animationData from "./chat-loader.json";
import ReportSection from "./ReportSection";
import ConfirmationModal from "../common/ConfirmationModal";
import ChatHistory from "../qna/ChatHistory";

const ChatContent = ({
  isLoading,
  chatContent,
  navigate,
  setShowSavedNote,
  sources,
  saved,
  setSaved,
  projectsVisibility,
  uploadResponse,
  hasFinalSummary,
  storedSummary,
  setStoredSummary,
  report,
  errorModal,
  setErrorModal,
}) => {
  const [popup, setPopup] = React.useState({
    visible: false,
    content: "",
    index: null,
    position: { top: 0, left: 0 },
  });

  const [showOtherPrompts, setShowOtherPrompts] = React.useState(false);

  // Export popup state
  const [exportPopup, setExportPopup] = React.useState({
    visible: false,
    position: { top: 0, left: 0 },
  });

  // Ref for section elements
  const sectionRefs = React.useRef({});

  // Ref for export popup
  const exportPopupRef = React.useRef(null);

  // Ref for otherPrompts div
  const otherPromptsRef = React.useRef(null);

  // Function to close error modal
  const closeErrorModal = () => {
    if (setErrorModal) {
      setErrorModal(null);
    }
  };

  // Use errorModal from props for error display
  const showMessageModal = (heading, message) => {
    if (setErrorModal) {
      setErrorModal({ heading, message });
    }
  };

  const closeMessageModal = () => {
    if (setErrorModal) {
      setErrorModal(null);
    }
  };

  // Callback to set refs for sections
  const setSectionRef = (id) => (element) => {
    if (element) {
      sectionRefs.current[id] = element;
    } else {
      delete sectionRefs.current[id]; // Clean up on unmount
    }
  };

  // Function to scroll to a section by ID
  const scrollToSection = (id) => {
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to scroll to otherPrompts
  const scrollToOtherPrompts = () => {
    otherPromptsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Close export popup on outside click
  React.useEffect(() => {
    if (!exportPopup.visible) return;
    function handleClickOutside(event) {
      if (
        exportPopupRef.current &&
        !exportPopupRef.current.contains(event.target)
      ) {
        closeExportPopup();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [exportPopup.visible]);

  // Scroll to otherPrompts when it becomes visible
  React.useEffect(() => {
    if (showOtherPrompts && otherPromptsRef.current) {
      scrollToOtherPrompts();
    }
  }, [showOtherPrompts]);

  // React.useEffect(() => {
  //   if (uploadResponse) {
  //     console.log('Upload response in ChatContent:', uploadResponse);
  //   }
  // }, [uploadResponse]);

  // React.useEffect(() => {
  //   if (hasFinalSummary) {
  //     const fetchSummaryWithDelay = async () => {
  //       try {
  //         await new Promise(res => setTimeout(res, 10000)); // 5 second delay
  //         const data = await fetchTenderSummary();
  //         console.log('fetchTenderSummary output:', data);
  //         if (Array.isArray(data.data) && data.data.length > 0) {
  //           const lastSummary = data.data[data.data.length - 1].summary;
  //           if (lastSummary) {
  //             // Store in storedSummary state
  //             if (typeof setStoredSummary === 'function') {
  //               setStoredSummary(lastSummary);
  //             }
  //           }
  //         }
  //       } catch (err) {
  //         console.error('fetchTenderSummary error:', err);
  //       }
  //     };
  //     fetchSummaryWithDelay();
  //   }
  // }, [hasFinalSummary, setStoredSummary]);

  // Timeline parsing logic at the top level
  let headers = [];
  let dataRows = [];
  let timelineValue = "";
  if (report && report.data && report.data.Timeline) {
    timelineValue = report.data.Timeline;
    const rows = timelineValue
      .trim()
      .split("\n")
      .filter((row, idx) => idx !== 1) // remove separator
      .map((line) =>
        line
          .split("|")
          .map((cell) => cell.trim())
          .filter(Boolean)
      );
    headers = rows[0] || [];
    dataRows = rows.slice(1);
  }

  if (isLoading && !uploadResponse) {
    return (
      <div className="flex h-[calc(100vh-150px)] items-center justify-center">
        <Lottie
          animationData={animationData}
          loop={true}
          style={{ height: 220 }}
        />
      </div>
    );
  }

  // Split bidInfo into header and list items
  // const bidInfoParts = chatContent.bidInfo.split('\n\n', 2);
  // const bidInfoHeader = bidInfoParts[0].replace(/\*\*/g, ''); // Remove markdown bold syntax
  // const bidInfoListItems = bidInfoParts.length > 1 ? bidInfoParts[1] : '';

  const handleCitationClick = (
    event,
    citationContent,
    index,
    clientX,
    clientY
  ) => {
    // const popupWidth = 560; // Corresponds to w-[560px]
    // const viewportWidth = window.innerWidth;
    const scrollableContainer = document.querySelector(".chat-scrollbar"); // Get the scrollable container
    const containerRect = scrollableContainer.getBoundingClientRect();
    const scrollTop = scrollableContainer.scrollTop;

    // Adjust citation position
    let adjustedLeft = clientX;
    // if (clientX + popupWidth > viewportWidth) {
    //   adjustedLeft = viewportWidth - popupWidth -50;
    // }

    // Calculate top relative to the scrollable container
    const topRelativeToContainer = clientY + scrollTop - containerRect.top;

    setPopup({
      visible: true,
      content: `Citation details for: ${citationContent}`,
      index: index,
      position: { top: topRelativeToContainer, left: adjustedLeft }, // Update position
    });
  };

  const closePopup = () => {
    setPopup((prevState) => ({ ...prevState, visible: false, index: null }));
  };

  // Handler for export icon click
  const handleExportClick = (event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setExportPopup({
      visible: true,
      position: {
        top: rect.bottom + window.scrollY + 8, // 8px below the icon
        left: rect.left + window.scrollX,
      },
    });
  };

  const closeExportPopup = () =>
    setExportPopup({ ...exportPopup, visible: false });

  // Show Report section (updated for new report structure)
  // const renderReportSection = () => {
  //   if (!report || !report.data) return null;
  //   const { Summary, Timeline, Todos, Checklist, Eligibility } = report.data || {};

  //   return (
  //     <div className="mb-8 p-4 bg-gray-800 rounded-lg">
  //       <h2 className="text-lg font-semibold mb-2">Show Report</h2>
  //       {Summary && (
  //         <div className="mb-4">
  //           <h3 className="font-semibold mb-1">Summary</h3>
  //           <Markdown components={markdownComponents}>{Summary}</Markdown>
  //         </div>
  //       )}
  //       {Timeline && Timeline.trim() !== "" && (
  //         <div className="mb-4">
  //           <h3 className="font-semibold mb-1">Timeline</h3>
  //           <Markdown components={markdownComponents}>{Timeline}</Markdown>
  //         </div>
  //       )}
  //       {Todos && Todos.trim() !== "" && (
  //         <div className="mb-4">
  //           <h3 className="font-semibold mb-1">Todos</h3>
  //           <Markdown components={markdownComponents}>{Todos}</Markdown>
  //         </div>
  //       )}
  //       {Checklist && Checklist.trim() !== "" && (
  //         <div className="mb-4">
  //           <h3 className="font-semibold mb-1">Checklist</h3>
  //           <Markdown components={markdownComponents}>{Checklist}</Markdown>
  //         </div>
  //       )}
  //       {Eligibility && Eligibility.trim() !== "" && (
  //         <div className="mb-4">
  //           <h3 className="font-semibold mb-1">Eligibility</h3>
  //           <Markdown components={markdownComponents}>{Eligibility}</Markdown>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <div id="chat-content" className="flex-1 flex flex-col relative">
      {/* {renderReportSection()} */}

      {/* Scrollable Chat Content */}
      <div
        className="flex flex-col items-start pt-6 overflow-y-auto max-h-[calc(100vh-230px)] chat-scrollbar scrollbar-hide relative"
        style={{ scrollBehavior: "smooth" }}
      >
        {report === null && !uploadResponse && (
          <div className="py-8 mx-auto w-full text-center">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ height: 220 }}
            />
          </div>
        )}

        {/* <img src="/images/expona-logo-sm.svg" alt="Expona" className='mr-2' /> */}

        {/* {sources.length > 0 ? ( */}
        <>
          {/* Overview */}
          {!report && (
            <div
              className={`mb-8 summary text-sm ${
                hasFinalSummary || storedSummary ? "" : "text-gray-ae"
              }`}
            >
              {/* Show fetched summary if available, only if no report */}
              {/* {!report && storedSummary && (
                <>
                  <Markdown components={markdownComponents}>{storedSummary}</Markdown>
                </>
              )} */}
              {/* Tender Summary */}

              {(() => {
                // Check if uploadResponse contains error object
                try {
                  const parsed = JSON.parse(uploadResponse);
                  if (
                    parsed.detail &&
                    parsed.detail.error === "Database Error"
                  ) {
                    // Show error modal immediately
                    setTimeout(() => {
                      showMessageModal(
                        "Oops! Not allowed",
                        parsed.detail.message ||
                          "An error occurred while processing your request."
                      );
                    }, 0);
                    return null; // Don't render anything
                  }
                } catch (e) {
                  // Not JSON, proceed normally
                }

                return (
                  <Markdown components={markdownComponents}>
                    {uploadResponse}
                  </Markdown>
                );
              })()}
            </div>
          )}
          {/* Show Report Section */}

          <div className="">
            <ReportSection
              report={report}
              markdownComponents={markdownComponents}
              headers={headers}
              dataRows={dataRows}
              exportPopup={exportPopup}
              handleExportClick={handleExportClick}
              exportPopupRef={exportPopupRef}
              closeExportPopup={closeExportPopup}
              chatContent={chatContent}
              handleCitationClick={handleCitationClick}
            />
            {report !== null && (
              <>
                {/* Suggested Categories Section */}
                <div className="mt-6 hidden">
                  <p className="text-base  mb-4">
                    Would you like details on any specific category?
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 border border-gray-5c rounded-md text-sm hover:bg-gray-4f transition-colors">
                      Payment milestones for the project?
                    </button>
                    <button className="px-4 py-2 border border-gray-5c rounded-md text-sm hover:bg-gray-4f transition-colors">
                      Penalties for project delays?
                    </button>
                    <button
                      className="px-4 py-2 border border-gray-5c rounded-md text-sm hover:bg-gray-4f transition-colors"
                      onClick={() => {
                        setShowOtherPrompts(!showOtherPrompts);
                        // Scroll only if showing, otherwise it might scroll before hiding
                        if (!showOtherPrompts) {
                          // Check the state *before* it toggles
                          // Use a timeout to allow state update and rendering
                          setTimeout(() => scrollToSection("otherPrompts"), 0);
                        }
                      }}
                    >
                      Process for bid evaluation
                    </button>
                  </div>
                </div>
                {/* Actions Section */}
                {/* <ChatActions setShowSavedNote={setShowSavedNote} /> */}
              </>
            )}
          </div>
          {/* Other Prompts */}
          <ChatHistory
            showOtherPrompts={showOtherPrompts}
            setShowOtherPrompts={setShowOtherPrompts}
            setShowSavedNote={setShowSavedNote}
            saved={saved}
            setSaved={setSaved}
            scrollToSection={scrollToSection}
          />
        </>
        {/*  ) : (
           <div className='flex flex-col justify-center items-center w-full h-full'>

             <div className='mb-8 mt-[10%]'>Your conversation has been cleared. Upload a tender to continue.</div>
             <UploadAction projectsVisibility={true} /></div>
         )} */}
        {/* Citation Popup */}
        {popup.visible && (
          <div
            className="absolute z-50 w-[397px] rounded shadow-lg border border-gray-42 bg-gray-24"
            style={{ top: popup.position.top, left: popup.position.left - 700 }}
          >
            {/* {popup.content} */}
            <div className="flex items-center border-b border-gray-42 px-5 py-4 ">
              <div className="flex">
                <img
                  src="/images/file-icon.svg"
                  alt="File"
                  width="20"
                  height="20"
                />{" "}
                <div className="ml-2">
                  <strong className="text-base">
                    {" "}
                    Source: BMIP Volume 1.pdf
                  </strong>
                  <span className="block text-gray-ae text-xs">Page 2</span>
                </div>
              </div>
              <img
                src="/images/close2-icon.svg"
                alt="Close"
                onClick={closePopup}
                className="ml-auto cursor-pointer "
              />
            </div>
            <div className="py-6 px-10 text-sm font-light">
              <ul className="list-disc space-y-2">
                <li>
                  Office of the Chief Engineer, Water Resources Department,
                  Bhopal
                </li>
                <li>e-Procurement Notice for Lifting Irrigation Scheme</li>
                <li>
                  Online percentage rate bids are invited for the construction
                  of lift irrigation scheme
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Message Modal */}
      <ConfirmationModal
        isOpen={!!errorModal}
        onClose={closeMessageModal}
        onConfirm={closeMessageModal}
        heading={errorModal?.heading || ""}
        message={errorModal?.message || ""}
        confirmButtonText="Ok"
        cancelButtonText=""
        confirmButtonClass="bg-expona-red hover:bg-red-700"
        iconSrc="images/alert-circle.svg"
        iconAlt="Info"
      />
    </div>
  );
};

export default ChatContent;
