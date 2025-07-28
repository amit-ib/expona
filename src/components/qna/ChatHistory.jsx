import React from "react";
import ChatActions from "../chat/ChatActions";
import { markdownComponents } from "../../utils";

const ChatHistory = ({
  showOtherPrompts,
  setShowOtherPrompts,
  setShowSavedNote,
  saved,
  setSaved,
  scrollToSection,
}) => {
  // Ref for otherPrompts div
  const otherPromptsRef = React.useRef(null);

  // Function to scroll to otherPrompts
  const scrollToOtherPrompts = () => {
    otherPromptsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to otherPrompts when it becomes visible
  React.useEffect(() => {
    if (showOtherPrompts && otherPromptsRef.current) {
      scrollToOtherPrompts();
    }
  }, [showOtherPrompts]);

  return (
    // showOtherPrompts && (
    // Chat history section
    <div
      className="w-full my-10 hidden"
      id="otherPrompts"
      ref={otherPromptsRef}
    >
      <div className="text-sm font-light flex flex-col">
        <div className="self-end max-w-xl bg-gray-4f px-4 py-2 rounded-md">
          Process for bid evaluation
        </div>
      </div>
      <div className="group">
        <div className="flex mb-4 mt-6 items-center">
          <strong className="py-2"> Pre-submission Checklist</strong>
          <div className="hidden ml-3 group-hover:inline-block flex space-x-3">
            <button className="p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f">
              <img src="/images/copy-icon.svg" alt="Copy" title="Copy"></img>
            </button>{" "}
          </div>
        </div>
        <ul className="mt-6 list-disc ml-5 text-sm font-light space-y-1">
          <li>Upload duly filled tender form</li>
          <li>Submit EMD in specified format</li>
          <li>Financial bid in BOQ format</li>
          <li>Signed and scanned copies of all pages of tender document</li>
          <li>Relevant licenses and registration certificates</li>
          <li>GST registration and PAN copy</li>
          <li>Power of attorney/authorization letter (if applicable)</li>
          <li>Affidavit of not being blacklisted</li>
          <li>Attend pre-bid meeting (optional but recommended)</li>
        </ul>
      </div>
      {/* Actions Section */}
      <ChatActions
        setShowSavedNote={setShowSavedNote}
        showOtherPrompts={showOtherPrompts}
        saved={saved}
        setSaved={setSaved}
      />
    </div>
    // )
  );
};

export default ChatHistory;
