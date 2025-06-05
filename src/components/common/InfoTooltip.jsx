import React, { useState } from 'react';

const InfoTooltip = ({ children, tooltipContent }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative flex items-center" // Use flex to align children if needed
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
            {isHovered && (
                <div className="absolute w-64 p-3 mt-2 text-xs text-gray-32 bg-gray-light shadow2-xl max-w-[217px] rounded shadow-lg z-50"
                    style={{ left: 'calc(100% + 18px)', top: '50%', transform: 'translateY(-50%)' }}
                >
                    <span className='triangle-left' style={{ top: '50%', transform: 'translateY(-70%)' }}></span>
                    {tooltipContent}
                </div>
            )}
        </div>
    );
};

export default InfoTooltip; 