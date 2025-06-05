import React, { useState } from 'react';
import Tooltip from '../common/Tooltip';

const ChatActions = ({ setShowSavedNote, showOtherPrompts, saved, setSaved }) => {
  const handleSave = () => {
    setSaved(prev => {
      const newSaved = !prev;
      if (setShowSavedNote) setShowSavedNote(newSaved);
      return newSaved;
    });
  };

  // State and ref for export options popup
  const [showExportOptions, setShowExportOptions] = useState(false);
  const exportButtonRef = React.useRef(null);
  const exportOptionsRef = React.useRef(null);

  // Handle click on "Export as" button
  const handleExportClick = () => {
    setShowExportOptions(prev => !prev);
  };

  // Close export options popup when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportOptionsRef.current && !exportOptionsRef.current.contains(event.target) && !exportButtonRef.current.contains(event.target)) {
        setShowExportOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportOptions]);

  return (
    <div className="w-full  pt-8 border-t border-gray-42 mt-8 mb-4 relative">
      <p>Let me know if you'd like this in a table or checklist format too</p>
      <div className='flex justify-between items-center gap-2 mt-5'>
        <div className="flex items-center gap-2">

          {/* Copy */}
          <button className="p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f transition-colors">
            <img src='/images/copy-icon.svg' alt="Copy" />
          </button>
          {/* Good Response */}
          <button className="p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f transition-colors">
            <img src='/images/thumbs-up-icon.svg' alt="Like" />
          </button>
          {/* Bad Response */}
          <button className="p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f transition-colors">
            <img src='/images/thumbs-down-icon.svg' alt="Dislike" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          {showOtherPrompts && (
            <Tooltip tooltipContent={saved ? "Remove from Key Areas" : false} position='top' >
              <button className="flex items-center px-5 py-2 border border-gray-5c rounded-full text-xs hover:bg-gray-4f transition-colors" onClick={handleSave}>
                <img src={saved ? 'images/tick-icon.svg' : 'images/bookmark-icon.svg'} className='mr-2' alt={saved ? 'Saved' : 'Save'} />
                {saved ? 'Saved to Key Areas' : 'Save to Key Areas'}
              </button>
            </Tooltip>
          )}
          <button
            className="px-5 py-2 border border-gray-5c rounded-full text-xs hover:bg-gray-4f transition-colors flex items-center gap-1"
            onClick={handleExportClick}
            ref={exportButtonRef}
          >
            Export as
            <img src='/images/arrow-down.svg' alt="Export as" />
          </button>

        </div>
      </div>
      {/* Export Options Popup */}
      {showExportOptions && (
        <div
          ref={exportOptionsRef}
          className="absolute bottom-10 right-0 z-50 bg-gray-2d rounded shadow-lg p-2 text-xs"
        >
          <button className="block w-full text-left py-2 px-4 hover:bg-gray-24 rounded-lg">Export as CSV</button>
          <button className="block w-full text-left py-2 px-4 hover:bg-gray-24 rounded-lg">Export as Image</button>
        </div>
      )}
    </div>
  );
};

export default ChatActions; 