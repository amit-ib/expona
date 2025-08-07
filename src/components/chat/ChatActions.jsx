import React, { useState } from "react";
import Tooltip from "../common/Tooltip";
import { copyToClipboard } from "../../utils";
import { StoreChatFeedback, SaveToKeyarea } from "../../api/apiHelper";
import Modal from "../common/Modal";

const ChatActions = ({
  setShowSavedNote,
  showOtherPrompts,
  saved,
  answer,
  messageId,
  isfeedbackSent,
  fetchChatHistory,
}) => {
  const [isSaved, setIsSaved] = useState(saved);
  const [copied, setCopied] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(""); // Track selected feedback
  const [showTextarea, setShowTextarea] = useState(false);
  const handleCopy = async () => {
    if (answer) {
      await copyToClipboard(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  React.useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  const handleSave = async () => {
    const originalState = isSaved;
    const newSavedState = !originalState;
    setIsSaved(newSavedState); // Optimistic update

    try {
      await SaveToKeyarea({
        answer_id: messageId,
        saved: newSavedState,
      });

      if (setShowSavedNote) {
        setShowSavedNote(newSavedState);
      }

      // If API call succeeds, fetch the latest history to sync all data.
      if (fetchChatHistory) {
        await fetchChatHistory();
      }
    } catch (error) {
      console.error("Error saving to key area:", error);
      // Revert the state on any exception
      setIsSaved(originalState);
    }
  };

  const handleFeedback = async (rating, feedback) => {
    if (messageId && !feedbackSent) {
      try {
        await StoreChatFeedback({
          message_id: messageId,
          rating: rating,
          feedback: feedback,
        });

        setFeedbackSent(true); //  disable buttons after feedback is sent
        setClickedButton(rating ? "up" : "down"); // receive true/false for rating
      } catch (error) {
        console.error("Error storing chat feedback:", error);
      }
    }
  };

  const openFeedbackModal = () => {
    if (!feedbackSent) {
      setIsFeedbackModalOpen(true);
    }
  };
  const handleFeedbackSubmit = () => {
    handleFeedback(false, feedbackText);
    setIsFeedbackModalOpen(false);
    // Resetting state after submit
    setShowTextarea(false);
    setSelectedFeedback("");
    setFeedbackText("");
  };
  // State and ref for export options popup
  const [showExportOptions, setShowExportOptions] = useState(false);
  const exportButtonRef = React.useRef(null);
  const exportOptionsRef = React.useRef(null);

  // Handle click on "Export as" button
  const handleExportClick = () => {
    setShowExportOptions((prev) => !prev);
  };

  // Close export options popup when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportOptionsRef.current &&
        !exportOptionsRef.current.contains(event.target) &&
        !exportButtonRef.current.contains(event.target)
      ) {
        setShowExportOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportOptions]);

  const feedbackOptions = [
    "Response is not relevant",
    "Not factually correct",
    "This link is not working",
    "Didn’t like the response",
    "This link provided is incorrect",
    "Other",
  ];
  const handleFeedbackOptionsClick = (option) => {
    setSelectedFeedback(option);
    if (option === "Other") {
      setShowTextarea(true);
      setFeedbackText("");
    } else {
      setShowTextarea(false);
      setFeedbackText(option);
    }
  };
  return (
    <>
      <div className="w-full   border-gray-42  mb-10 relative">
        {/* <p>Let me know if you'd like this in a table or checklist format too</p> */}
        <div className="flex justify-between items-center gap-2 mt-5">
          <div className="flex items-center gap-2">
            {/* Copy */}
            <button
              className="p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f transition-colors"
              onClick={handleCopy}
            >
              <img
                className="w-4 h-4"
                src={
                  copied ? "/images/right-icon.svg" : "/images/copy-icon.svg"
                }
                alt={copied ? "Copied" : "Copy"}
              />
            </button>
            {/* Good Response */}
            <button
              className={`p-2 rounded-lg border ${
                clickedButton === "up" || isfeedbackSent === true
                  ? "border-gray-5c "
                  : "border-gray-24"
              } ${
                (feedbackSent || isfeedbackSent !== null) &&
                "opacity-50 cursor-not-allowed"
              } hover:border-gray-5c hover:bg-gray-4f transition-colors`}
              onClick={() => handleFeedback(true, "")}
              disabled={feedbackSent || isfeedbackSent !== null}
            >
              <img src="/images/thumbs-up-icon.svg" alt="Like" />
            </button>
            {/* Bad Response */}
            <button
              className={`p-2 rounded-lg border ${
                clickedButton === "down" || isfeedbackSent === false
                  ? "border-gray-5c opacity-50 cursor-not-allowed"
                  : "border-gray-24"
              } ${
                (feedbackSent || isfeedbackSent !== null) &&
                "opacity-50 cursor-not-allowed"
              } hover:border-gray-5c hover:bg-gray-4f transition-colors`}
              onClick={openFeedbackModal}
              disabled={feedbackSent || isfeedbackSent !== null}
            >
              <img src="/images/thumbs-down-icon.svg" alt="Dislike" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            {/* {showOtherPrompts && ( */}
            <Tooltip
              tooltipContent={isSaved ? "Remove from Key Areas" : false}
              position="top"
            >
              <button
                className="flex items-center px-5 py-2 border border-gray-5c rounded-full text-xs hover:bg-gray-4f transition-colors"
                onClick={handleSave}
              >
                <img
                  src={
                    isSaved
                      ? "images/right-icon.svg"
                      : "images/bookmark-icon.svg"
                  }
                  className="mr-2 w-4"
                  alt={isSaved ? "Saved" : "Save"}
                />
                {isSaved ? "Saved to Key Areas" : "Save to Key Areas"}
              </button>
            </Tooltip>
            {/* )} */}
            {/* <button
              className="px-5 py-2 border border-gray-5c rounded-full text-xs hover:bg-gray-4f transition-colors flex items-center gap-1"
              onClick={handleExportClick}
              ref={exportButtonRef}
            >
              Export as
              <img src="/images/arrow-down.svg" alt="Export as" />
            </button> */}
            <button
              className="px-5 py-2 border border-gray-5c rounded-full text-xs hover:bg-gray-4f transition-colors flex items-center gap-1"
              onClick={handleExportClick}
              ref={exportButtonRef}
            >
              Export as PDF
            </button>
          </div>
        </div>
        {/* Export Options Popup */}
        {showExportOptions && (
          <div
            ref={exportOptionsRef}
            className="absolute bottom-10 right-0 z-50 bg-gray-2d rounded shadow-lg p-2 text-xs"
          >
            <button className="block w-full text-left py-2 px-4 hover:bg-gray-24 rounded-lg">
              Export as CSV
            </button>
            <button className="block w-full text-left py-2 px-4 hover:bg-gray-24 rounded-lg">
              Export as Image
            </button>
          </div>
        )}
      </div>
      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="Provide Feedback"
      >
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-20">
          <div className="bg-gray-32 rounded-lg w-full max-w-[687px]">
            <div className="flex justify-between items-center border-b border-gray-5c p-6">
              <h2 className="text-lg font-semibold">
                Provide more information
              </h2>
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="text-white text-xl"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 p-6 pb-0 flex flex-wrap gap-4">
              {feedbackOptions.map((option) => (
                <button
                  key={option}
                  className={`p-3 border border-gray-5c p-2 rounded-lg hover:bg-gray-5c hover:shadow-xl ${
                    selectedFeedback === option ? "bg-gray-5c shadow-xl" : ""
                  }`}
                  onClick={() => handleFeedbackOptionsClick(option)}
                >
                  {option}
                </button>
              ))}
              {showTextarea && (
                <textarea
                  className="w-full p-3 mt-2 border border-gray-5c bg-gray-32 p-2 rounded-lg bg-gray-39"
                  rows="4"
                  placeholder="(Optional) Feel free to add specific details..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              )}
            </div>
            <div className="mt-4 flex justify-end p-6 pt-1">
              <button
                className={`bg-expona-red text-white px-4 py-3 rounded hover:bg-red-500 text-lg ${
                  feedbackText ? "opacity-100" : "opacity-50 hover:bg-red-650"
                }`}
                onClick={handleFeedbackSubmit}
                disabled={!feedbackText}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChatActions;
