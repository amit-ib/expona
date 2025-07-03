import React from 'react';
import ChatActions from './ChatActions';
import Markdown from "react-markdown";
import UploadAction from "../dashboard/UploadAction";

import Lottie from "lottie-react";
import animationData from "./chat-loader.json";
const markdownComponents = {
  p: ({ node, ...props }) => (
    <p className="mb-5" {...props} />
  ),
  ul: ({ node, ...props }) => {
    const depth = node?.position?.start?.column || 0;
    const isNested = depth > 2;

    return (
      <ul
        className={
          isNested
            ? "list-disc ml-8 mb-4 text-sm mt-3 space-y-1"
            : "list-disc ml-5 mb-5 text-sm space-y-1"
        }
        {...props}
      />
    );
  },
  ol: ({ node, ...props }) => (
    <ul className="list-decimal" {...props} />
  ),
  h1: ({ node, ...props }) => (
    <h1 className="text-2xl font-bold" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a className="text-white underline" {...props} />
  ),
};

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
  storedSummary
}) => {
  const [popup, setPopup] = React.useState({
    visible: false,
    content: '',
    index: null,
    position: { top: 0, left: 0 },
  });

  const [showOtherPrompts, setShowOtherPrompts] = React.useState(false);

  // Export popup state
  const [exportPopup, setExportPopup] = React.useState({
    visible: false,
    position: { top: 0, left: 0 }
  });

  // Ref for section elements
  const sectionRefs = React.useRef({});

  // Ref for export popup
  const exportPopupRef = React.useRef(null);

  // Ref for otherPrompts div
  const otherPromptsRef = React.useRef(null);

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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to scroll to otherPrompts
  const scrollToOtherPrompts = () => {
    otherPromptsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Close export popup on outside click
  React.useEffect(() => {
    if (!exportPopup.visible) return;
    function handleClickOutside(event) {
      if (exportPopupRef.current && !exportPopupRef.current.contains(event.target)) {
        closeExportPopup();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  if (isLoading && !uploadResponse) {
    return (
      <div className="flex h-[calc(100vh-150px)] items-center justify-center">
        <Lottie animationData={animationData} loop={true} style={{ height: 220 }} />
      </div>
    );
  }

  // Split bidInfo into header and list items
  // const bidInfoParts = chatContent.bidInfo.split('\n\n', 2);
  // const bidInfoHeader = bidInfoParts[0].replace(/\*\*/g, ''); // Remove markdown bold syntax
  // const bidInfoListItems = bidInfoParts.length > 1 ? bidInfoParts[1] : '';

  const handleCitationClick = (event, citationContent, index, clientX, clientY) => {
    // const popupWidth = 560; // Corresponds to w-[560px]
    // const viewportWidth = window.innerWidth;
    const scrollableContainer = document.querySelector('.chat-scrollbar'); // Get the scrollable container
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
    setPopup(prevState => ({ ...prevState, visible: false, index: null }));
  };

  // Handler for export icon click
  const handleExportClick = (event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setExportPopup({
      visible: true,
      position: {
        top: rect.bottom + window.scrollY + 8, // 8px below the icon
        left: rect.left + window.scrollX
      }
    });
  };

  const closeExportPopup = () => setExportPopup({ ...exportPopup, visible: false });

  return (
    <div id="chat-content" className="flex-1 flex flex-col relative">


      {/* Scrollable Chat Content */}
      <div className="flex items-start pt-6 overflow-y-auto max-h-[calc(100vh-230px)] chat-scrollbar scrollbar-hide relative" style={{ scrollBehavior: 'smooth' }}>
        {/* <img src="/images/expona-logo-sm.svg" alt="Expona" className='mr-2' /> */}

        {sources.length > 0 ? (
          <div >
            {/* Overview */}
            <div className={`mb-8 summary text-sm ${hasFinalSummary || storedSummary ? "" : "text-gray-ae"}`}>
              {/* Show fetched summary if available */}
              {storedSummary && (
                <>
                  <Markdown components={markdownComponents}>{storedSummary}</Markdown>
                </>
              )}
              {/* Tender Summary */}
              <Markdown components={markdownComponents}>
                {uploadResponse}
              </Markdown>
            </div>

            <div className='hidden'>
              {/* Separator */}
              <div className="w-full h-px bg-gray-42 my-5"></div>
              <div className='group' id="datetime">
                <div className='flex mb-6 mt-6 items-center relative'><strong className='block py-2'>Important Dates & Timelines</strong>
                  <div className={`ml-3 flex space-x-3 group-hover:block ${exportPopup.visible ? '' : 'hidden group-hover:block'}`}>
                    <button className='p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f'><img src='/images/copy-icon.svg' alt="Copy" title="Copy"></img></button>
                    <button onClick={handleExportClick} className='p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f'><img src='/images/export-icon.svg' alt="Export" title="Export" /></button>
                  </div>
                  {/* Export Popup */}
                  {exportPopup.visible && (
                    <div
                      ref={exportPopupRef}
                      className="absolute z-50 bg-gray-2d rounded shadow-lg p-2"
                      style={{ top: 40, left: 290 }}
                    >
                      <button
                        className="block w-full text-left py-2 px-4 hover:bg-gray-24 rounded-lg text-xs"
                        onClick={() => { /* Export as CSV logic here */ closeExportPopup(); }}
                      >
                        Export as CSV
                      </button>
                      <button
                        className="block w-full text-left py-2 pl-4 pr-8 hover:bg-gray-24 rounded-lg text-xs"
                        onClick={() => { /* Export as Image logic here */ closeExportPopup(); }}
                      >
                        Export as Image
                      </button>
                    </div>
                  )}
                </div>

                {/* Table */}
                <div className="rw-full mb-8 mt-0 border border-gray-42 rounded-md  boder-gray-5c">


                  <table className="w-full border-collapse  ">
                    <thead>
                      <tr className="border-b border-b-gray-42 bg-gray-2d ">
                        <th className="py-3.5 px-3 text-left  rounded-tl-md border-r border-gray-5c" >Timeline</th>
                        <th className="py-3.5 px-3 text-left  rounded-tr-md">Important Date</th>

                      </tr>
                    </thead>
                    <tbody>
                      {chatContent.tableData.map((row, index) => (
                        <tr key={index} className={`text-sm ${index !== chatContent.tableData.length - 1 ? 'border-b border-b-gray-5c' : ''}  `}>
                          <td className="py-2.5 px-3  relative border-r border-gray-5c rounded">{row.feature}</td>
                          <td className="py-2.5 px-3  relative  rounded">
                            {row.value}
                            {row.citation && (
                              <span
                                className="px-2 py-1 bg-gray-4f text-xs rounded-full w-6 h-6 ml-2 cursor-pointer"
                                onClick={(event) => handleCitationClick(event, row.citation, index, event.clientX, event.clientY)}
                              >
                                {row.citation}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Separator */}
              <div className="w-full h-px bg-gray-42 my-5"></div>

              {/* Bid Information */}
              <div id="todo" className='group'>
                <div className='flex mb-4 mt-6 items-center'><strong className='py-2'>List of To-Do's</strong>
                  <div className='hidden ml-3 group-hover:inline-block flex space-x-3'>
                    <button className='p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f'><img src='/images/copy-icon.svg' alt="Copy" title="Copy" />
                    </button>
                  </div></div>
                {/* <p className="whitespace-pre-line text-base leading-relaxed font-bold">
            {bidInfoHeader}
          </p>
          <p className="whitespace-pre-line text-sm leading-relaxed font-light mt-2">
            {bidInfoListItems}
          </p> */}
                <Markdown
                  components={markdownComponents}
                >
                  {chatContent.bidInfo}
                </Markdown>
              </div>

              {/* Separator */}
              <div className="w-full h-px bg-gray-42 mt-8 mb-4"></div>

              {/* Pre-Submission */}
              <div className="mb-8 relative group" id="presubmisssion">
                <div className='flex mb-4 mt-6 items-center'>
                  <strong className='py-2'> Pre-submission Checklist</strong><div className='hidden ml-3 group-hover:inline-block flex space-x-3'><button className='p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f'><img src='/images/copy-icon.svg' alt="Copy" title="Copy" /></button> </div></div>
                <ul className='mt-4 font-light text-sm space-y-1'>
                  <li>✅ Upload duly filled tender form</li>
                  <li>✅ Submit EMD in specified format</li>
                  <li>✅ Financial bid in BOQ format</li>
                  <li>✅ Signed and scanned copies of all pages of tender document</li>
                  <li>✅ Relevant licenses and registration certificates</li>
                  <li>✅ GST registration and PAN copy</li>
                  <li>✅ Power of attorney/authorization letter (if applicable)</li>
                  <li>✅ Affidavit of not being blacklisted</li>
                  <li>✅ Attend pre-bid meeting (optional but recommended)</li></ul>
                {/* <Markdown
                          components={markdownComponents}
                        >
                           {chatContent.preSubmission}
                        </Markdown> */}
              </div>
              {/* Separator */}
              <div className="w-full h-px bg-gray-42 mt-8 mb-4"></div>

              {/* Evaluation Criteria */}
              <div className="mb-8 relative group" id="eval">
                <div className='flex mb-4 mt-6 items-center'>
                  <strong className='py-2'> Evaluation Criteria</strong><div className='hidden ml-3 group-hover:inline-block flex space-x-3'><button className='p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f'><img src='/images/copy-icon.svg' alt="Copy" title="Copy"></img></button> </div></div>
                <Markdown
                  components={markdownComponents}
                >
                  {chatContent.evaluationCriteria}
                </Markdown>
              </div>
              {/* Separator */}
              <div className="w-full h-px bg-gray-42 my-4"></div>
              {/* Suggested Categories Section */}
              <div className="mt-6">
                <p className="text-base  mb-4">Would you like details on any specific category?</p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 border border-gray-5c rounded-md text-sm hover:bg-gray-4f transition-colors">
                    Payment milestones for the project?
                  </button>
                  <button className="px-4 py-2 border border-gray-5c rounded-md text-sm hover:bg-gray-4f transition-colors">
                    Penalties for project delays?
                  </button>
                  <button className="px-4 py-2 border border-gray-5c rounded-md text-sm hover:bg-gray-4f transition-colors"
                    onClick={() => {
                      setShowOtherPrompts(!showOtherPrompts);
                      // Scroll only if showing, otherwise it might scroll before hiding
                      if (!showOtherPrompts) { // Check the state *before* it toggles
                        // Use a timeout to allow state update and rendering
                        setTimeout(() => scrollToSection('otherPrompts'), 0);
                      }
                    }}
                  >
                    Process for bid evaluation
                  </button>
                </div>
              </div>
              {/* Actions Section */}
              <ChatActions setShowSavedNote={setShowSavedNote} />
            </div>
            {/* Other Prompts */}
            {showOtherPrompts && (
              <div className='w-full my-10' id="otherPrompts" ref={setSectionRef('otherPrompts')}>
                <div className='text-sm font-light flex flex-col'><div className='self-end max-w-xl bg-gray-4f px-4 py-2 rounded-md'>Process for bid evaluation</div></div>
                <div className='group'>
                  <div className='flex mb-4 mt-6 items-center'>
                    <strong className='py-2'> Pre-submission Checklist</strong><div className='hidden ml-3 group-hover:inline-block flex space-x-3'><button className='p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f'><img src='/images/copy-icon.svg' alt="Copy" title="Copy"></img></button> </div></div>
                  <ul className='mt-6 list-disc ml-5 text-sm font-light space-y-1'>
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
                <ChatActions setShowSavedNote={setShowSavedNote} showOtherPrompts={showOtherPrompts} saved={saved} setSaved={setSaved} />
              </div>
            )}


          </div>
        ) : (
          <div className='flex flex-col justify-center items-center w-full h-full'>

            <div className='mb-8 mt-[10%]'>Your conversation has been cleared. Upload a tender to continue.</div>
            <UploadAction projectsVisibility={true} /></div>
        )}
        {/* Citation Popup */}
        {
          popup.visible && (
            <div
              className="absolute z-50 w-[397px] rounded shadow-lg border border-gray-42 bg-gray-24"
              style={{ top: popup.position.top, left: popup.position.left - 700 }}

            >
              {/* {popup.content} */}
              <div className='flex items-center border-b border-gray-42 px-5 py-4 '>
                <div className='flex'><img src="/images/file-icon.svg" alt="File" width="20" height="20" /> <div className='ml-2'><strong className='text-base'> Source: BMIP Volume 1.pdf</strong><span className='block text-gray-ae text-xs'>Page 2</span></div></div>
                <img src="/images/close2-icon.svg" alt="Close" onClick={closePopup} className='ml-auto cursor-pointer ' />
              </div>
              <div className='py-6 px-10 text-sm font-light'>
                <ul className='list-disc space-y-2'>
                  <li>Office of the Chief Engineer, Water Resources Department, Bhopal</li>
                  <li>e-Procurement Notice for Lifting Irrigation Scheme</li>
                  <li>Online percentage rate bids are invited for the construction of lift irrigation scheme</li>

                </ul>
              </div>
            </div>
          )
        }
      </div>



    </div >
  );
};

export default ChatContent;