import React, { useEffect, useRef } from 'react';

const ProfilePopup = ({ isOpen, onClose }) => {
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Placeholder data - ideally this would come from props or context
    const user = {
        initials: 'AK',
        name: 'Anish Kudal',
        email: 'anish.kudal@infobeans.com',
    };

    return (
        <div className="absolute right-0 top-10 mt-2 w-64 rounded-lg shadow-lg bg-gray-32 border border-gray-4f z-50 p-4 w-[366px]" ref={popupRef}>
            {/* Close button (optional in image, but good practice) */}
            {/* <button className="absolute top-2 right-2 text-gray-ae hover:text-white" onClick={onClose}>
        <img src="/images/close2-icon.svg" alt="Close" className="w-4 h-4" />
      </button> */}

            <div className="flex flex-col items-center text-center mb-4">
                {/* Initials Circle */}
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-semibold mb-2">
                    {user.initials}
                </div>
                {/* User Name */}
                <div className="font-semibold text-sm mb-1">
                    {user.name}
                </div>
                {/* User Email */}
                <div className="text-xs text-gray-ae mb-4">
                    {user.email}
                </div>
            </div>

            {/* Separator */}
            {/* <div className="w-full h-px bg-gray-600 my-2"></div> */}

            {/* Buttons */}
            <div className="flex  mt-2 w-9/12 mx-auto">
                {/* Settings Button */}
                <button
                    className="flex-1 flex items-center justify-center px-4 py-4 text-sm rounded-l-full bg-gray-42 hover:bg-gray-24 border-r border-gray-4f"
                    onClick={() => { /* Handle Settings click */ onClose(); }}
                >
                    <img src="/images/setting-icon.svg" alt="Settings" className="mr-2 w-4 h-4" /> {/* Placeholder icon */} Settings
                </button>
                {/* Logout Button */}
                <button
                    className="flex-1 flex items-center justify-center px-4 py- text-sm rounded-r-full bg-gray-42 hover:bg-gray-24 "
                    onClick={() => { /* Handle Logout click */ onClose(); }}
                >
                    <img src="/images/logout-icon.svg" alt="Logout" className="mr-2 w-4 h-4" /> {/* Placeholder icon */} Logout
                </button>
            </div>
            {/* Dark mode toggle (Placeholder) */}
            <div className="absolute top-4 right-4">
                <button><img src="/images/dark-mode.svg" alt="" /></button>
            </div>
        </div>
    );
};

export default ProfilePopup; 