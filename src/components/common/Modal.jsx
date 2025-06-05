import React from 'react';

const Modal = ({ isOpen, onClose, children, size = 'auto' }) => {
    if (!isOpen) return null;

    // Determine width class based on size prop
    const widthClass = size === 'large' ? 'w-[80%] h-5/6' : ''; // Add max-w-xl for large size

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`bg-gray-32 rounded-lg pt-12 p-8 shadow-lg relative flex flex-col ${widthClass}`}>
                {/* Close button */}
                <button
                    className="absolute top-6 right-6 text-gray-ae hover:text-white"
                    onClick={onClose}
                >
                    <img src="/images/close2-icon.svg" alt="Close" />
                </button>
                {/* Modal content - wrapped to take full height */}
                <div className="flex-grow overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal; 