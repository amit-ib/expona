import React, { useState, useEffect } from 'react';
import Tooltip from '../common/Tooltip';
import PdfViewerModal from "../common/PdfViewerModal";
import InfoTooltip from '../common/InfoTooltip';
import Loader from '../common/Loader';
import { fetchSupportingDocs, deleteTenderById, deleteSupportingDoc } from '../../api/apiHelper';

const RightSidebar = ({
  isLoading,
  sources,
  setSources,
  collapsed,
  setCollapsed,
  onCheckedChange
}) => {
  // State to track which checkboxes are checked
  const [checkedItems, setCheckedItems] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [deleteIndex, setDeleteIndex] = useState(null);
  // Add state for upload tooltip visibility
  // const [showUploadTooltip, setShowUploadTooltip] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const pdfUrl = "/A_Brief_Introduction_To_AI.pdf"; // File in public folder
  const [supportingDocList, setSupportingDocList] = useState([]);
  const [tenderLoading, setTenderLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);


  // Update checkedItems if sources change
  useEffect(() => {
    setCheckedItems(Array(sources.length).fill(sources.length > 0));
  }, [sources]);

  useEffect(() => {
    const handleClick = () => setOpenMenuIndex(null);
    if (openMenuIndex !== null) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [openMenuIndex]);

  useEffect(() => {
    const company_id = localStorage.getItem('company_id');
    fetchSupportingDocs(company_id)
      .then(data => {
        console.log("Supporting docs API response:", data);
        setSupportingDocList(data.data || []);
      })
      .catch(() => setSupportingDocList([]));
  }, []);

  // Handler for individual checkbox
  // const handleCheckboxChange = (index) => {
  //   const updated = [...checkedItems];
  //   updated[index] = !updated[index];
  //   setCheckedItems(updated);
  //   if (onCheckedChange) {
  //     onCheckedChange(updated.some(Boolean));
  //   }
  // };

  // Handler for select all
  // const handleSelectAll = (e) => {
  //   const allChecked = Array(sources.length).fill(e.target.checked);
  //   setCheckedItems(allChecked);
  //   if (onCheckedChange) {
  //     onCheckedChange(allChecked.some(Boolean));
  //   }
  // };

  // Determine if all are checked
  // const allChecked = checkedItems.length > 0 && checkedItems.every(Boolean);

  // if (isLoading) {
  //   return (
  //     <div className={`bg-gray-2d transition-all duration-500 ${collapsed ? 'w-0' : 'w-[300px]'}`}>
  //       <Loader />
  //     </div>
  //   );
  // }

  const handleDeleteSupportingDoc = async () => {

    if (deleteIndex === null) return;
    const doc = supportingDocList[deleteIndex];

    if (!doc || !doc.doc_id) {

      setDeleteIndex(null);
      return;
    }
    setDeleting(true);
    try {
      const company_id = localStorage.getItem('company_id');
      console.log(doc.doc_id)
      await deleteSupportingDoc({ company_id, document_id: doc.doc_id });
      setSupportingDocList(prev => prev.filter((_, i) => i !== deleteIndex));
    } catch (err) {
      // Optionally show error to user
      console.error('Failed to delete supporting document', err);
    } finally {
      setDeleting(false);
      setDeleteIndex(null);
    }
  };

  return (
    <div
      id="right-sidebar"
      className={`border-l border-gray-42 transition-all duration-300 ${collapsed ? 'w-[80px]' : 'w-[300px]'} transition-all duration-300 flex flex-col`}
    >

      <div className={`flex h-[72px]   items-center ${collapsed ? 'justify-center pl-0 ' : 'justify-between pl-6 pr-4'}`}>

        {!collapsed && (
          <>
            <button
              className="h-full flex items-center text-white"
            >
              Documents <InfoTooltip position="left" tooltipContent="Key points helps you to  quickly return to important responses. Some are suggested by AI to get you started. You can add more as you go.">
                <img src="images/help-icon.svg" alt="help" className='ml-1 cursor-pointer group' />
              </InfoTooltip>
            </button>

          </>
        )}
        <button
          className="p-2.5 flex items-center justify-center hover:bg-gray-32 rounded-full"
          onClick={() => setCollapsed(!collapsed)}
          style={{ minWidth: 35 }}
        >
          <Tooltip tooltipContent="Documents" showCondition={collapsed}>
            <img src="/images/expand-collaps.svg" alt="Expand/Collapse" height={24} width={24} /* Remove title */ />
          </Tooltip>
        </button>

      </div>

      {/* Added Files Section */}
      {/* {!collapsed && ( */}
      {isLoading ? (
        <Loader />
      ) :
        <div className="py-4 px-6 pt-0  flex flex-col justify-center relative">
          {/* Add Document Button */}
          <input type="file" className={`absolute top-4 left-10 opacity-0 z-40 h-16  cursor-pointer ${collapsed ? 'w-5' : 'w-44'}`} />
          <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-32 hover:bg-gray-37 rounded text-sm font-medium transition-all duration-300 cursor-pointer">
            {/* Use the reusable Tooltip component */}
            <Tooltip tooltipContent="Upload Documents" showCondition={collapsed}>
              {/* The icon is the child that triggers the tooltip */}
              <img src="/images/upload-icon.svg" alt="Add Document" />
            </Tooltip>

            {/* The "Upload Documents" text (only visible when not collapsed) */}
            {!collapsed && <span>Upload Documents</span>}
          </button>
          <div className='border-t border-gray-42 mt-5'>
            {!collapsed && (
              supportingDocList.length > 0 ? (
                <h3 className="flex items-center justify-between text-xs font-normal text-white  mt-6">

                  <span>Uploaded documents</span>
                  {/* <input
                  type="checkbox"
                  className='p-1 custom-checkbox'
                  id="selectall"
                  checked={allChecked}
                  onChange={handleSelectAll}
                /> */}
                </h3>
              ) : (
                <span className='text-xs text-gray-ae mt-6 block'>Uploaded documents will appear here. Upload a file to continue.</span>
              )
            )}
            {tenderLoading ? <Loader /> : Array.isArray(supportingDocList) && supportingDocList.map((tender, idx) => (

              <div key={idx} className={`flex relative items-center justify-center py-3 rounded group ${collapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="w-6 h-6 flex items-center justify-center group cursor-pointer ">
                    <img
                      src="/images/file2-icon.svg"
                      alt="Files"
                      className={`${!collapsed ? 'group-hover:hidden' : ''}`}
                      onMouseEnter={e => {
                        if (collapsed) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredIndex(idx);
                          setPopupPosition({
                            top: rect.top + rect.height / 2,
                            left: rect.left - 8 // 8px gap to the left of the icon
                          });
                        }
                      }}
                      onMouseLeave={() => collapsed && setHoveredIndex(null)}
                    />
                    {collapsed && hoveredIndex === idx && (
                      <div
                        className="fixed z-50 bg-gray-32  text-sm rounded px-3 py-2 shadow-lg whitespace-nowrap"
                        style={{
                          top: `${popupPosition.top}px`,
                          left: `${popupPosition.left}px`,
                          transform: 'translate(-100%, -50%)'
                        }}
                      >
                        {tender.doc_name}
                      </div>
                    )}
                    <img src="/images/3dots-icon.svg" alt="Show Options" className={`hidden  cursor-pointer ${!collapsed ? 'group-hover:inline-flex' : ''}`} onClick={e => { e.stopPropagation(); setOpenMenuIndex(openMenuIndex === idx ? null : idx); }} />
                    {openMenuIndex === idx && (
                      <div className="absolute z-50 mt-36 text-xs left-1 w-40 bg-gray-2d rounded shadow-xl flex flex-col p-2">
                        <button className="px-4 py-3 text-left hover:bg-gray-24 rounded-lg">Rename Document</button>
                        <button className="px-4 py-3 text-left hover:bg-gray-24 rounded-lg" onClick={() => setDeleteIndex(idx)}>Delete Document</button>
                      </div>
                    )}
                  </div>
                  {!collapsed &&
                    <div>
                      <button className="text-sm font-normal text-white" onClick={() => setShowPdf(true)}>{tender.doc_name}</button>

                    </div>}
                </div>

              </div>

            ))}
          </div>
        </div>
      }
      {deleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-24 rounded-lg p-8 shadow-lg w-[400px] max-w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 text-center flex flex-col justify-center items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-42 mb-2">
                  <span className='bg-white p-1 inline-block rounded-full'><span className="flex rounded-full p-1 inline-block"><img src="images/alert-circle.svg" alt='Alert' /></span></span>
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">Delete this file?</h2>
                <p className="text-gray-ae font-light text-center">
                  Are you sure you want to delete this file? This action cannot be undone and you will lose access to the entire conversation.
                </p>
              </div>
              <div className="flex w-full gap-4 mt-4">
                <button
                  className="flex-1 py-2 rounded bg-gray-2d text-white hover:bg-gray-37"
                  onClick={() => setDeleteIndex(null)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2 rounded bg-expona-red text-white hover:bg-red-700"
                  onClick={handleDeleteSupportingDoc}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <PdfViewerModal
        isOpen={showPdf}
        onClose={() => setShowPdf(false)}
        fileUrl={pdfUrl}
      />
    </div>
  );
};

export default RightSidebar;