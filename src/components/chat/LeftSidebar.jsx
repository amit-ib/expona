import React from 'react';
import Tooltip from '../common/Tooltip';
import InfoTooltip from '../common/InfoTooltip';

const LeftSidebar = ({ navigationItems, activeHash, collapsed, setCollapsed, showSavedNote, sources = [], setShowSavedNote, setSaved }) => {

  // Log activeHash and navigationItems on mount and when activeHash changes
  // React.useEffect(() => {
  //   // console.log('LeftSidebar activeHash:', activeHash);
  //   // console.log('LeftSidebar navigationItems:', navigationItems);
  // }, [activeHash, navigationItems]);

  return (
    <div id="left-sidebar" className={`flex flex-col border-r  transition-all duration-300 ${collapsed ? 'w-[220px] border-gray-24' : 'w-[300px]  border-gray-42'}`}>
      <div className={` flex border-b  items-center transition-all duration-300 ${collapsed ? 'justify-left px-0 py-3 border-gray-24' : 'justify-between px-4 py-3  border-gray-42'}`}>
        {!collapsed && (
          <div className={`flex items-center relative  ${collapsed ? 'opacity-0' : ''}`}>
            Key Areas
            <InfoTooltip tooltipContent="Key points helps you to  quickly return to important responses. Some are suggested by AI to get you started. You can add more as you go.">
              <img src="images/help-icon.svg" alt="help" className='ml-1 cursor-pointer group' />
            </InfoTooltip>
          </div>
        )}
        <button
          className="p-2.5 ml-4 flex items-center justify-center hover:bg-gray-32 rounded-full"
          style={{ minWidth: 35 }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Tooltip tooltipContent="Key Areas" position='right' showCondition={collapsed}>
            <img src="/images/expand-collaps.svg" alt="Key Areas" height={24} width={24} /* Remove title */ />
          </Tooltip>
        </button>
      </div>
      {sources.length > 0 ? (

        <div className={`py-3 flex flex-col transition-all duration-300 ${collapsed ? 'opacity-0' : 'ml-4'}`}>
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className={`w-full text-left px-2 py-2 text-sm relative ${(activeHash === '' && index === 0) || (item.link.substring(item.link.indexOf('#')) === activeHash)
                ? 'text-white font-medium before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-white'
                : 'text-gray-ae hover:text-white font-light'
                }`}
            >
              {item.title}
            </a>
          ))}
          {showSavedNote && (
            <div className={`border-t border-gray-42 pt-4 px-2 mt-2`}>
              <div className='flex items-center relative text-sm text-gray-ae  '>Saved by You
                <InfoTooltip tooltipContent="You can add key points to quickly return to important responses.">
                  <img src="images/help-icon.svg" alt="help" className='ml-1 cursor-pointer group' />
                </InfoTooltip>
              </div>
              <div className='py-2'>
                <div className="relative w-full">
                  <a
                    href="#"
                    className="w-full text-left py-3 text-sm relative text-gray-ae hover:text-white font-light flex justify-between items-center group"
                  >Pre-submission Checklist
                    <Tooltip tooltipContent="Remove" position='bottom'>
                      <button
                        className="hidden group-hover:inline-block"

                        onClick={e => { e.preventDefault(); e.stopPropagation(); if (setShowSavedNote) setShowSavedNote(false); if (setSaved) setSaved(false); }}
                      >
                        <img src="/images/delete-icon.svg" alt="Delete" />
                      </button>
                    </Tooltip>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>


      ) : (
        // !collapsed && (
        <div className={`text-xs py-6 px-4  transition-all duration-300 ${collapsed ? 'opacity-0' : ''}`}>It looks quiet here. Upload a tender to see key areas show up.</div>
        // )
      )}
    </div>
  );
};

export default LeftSidebar; 