import React, { useState } from 'react';

const InfoTooltip = ({ children, tooltipContent, position = 'right' }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Determine tooltip content position
    const tooltipStyle = {
        top: '50%',
        transform: 'translateY(-50%)',
        ...(position === 'right' ? { left: 'calc(100% + 10px)' } : { right: 'calc(100% + 0px)' }),
    };

    // Determine triangle style
    const triangleStyle = {
        position: 'absolute',
        width: 0,
        height: 0,
        top: '50%',
        transform: 'translateY(-70%)', // Keeping original vertical offset
        ...(position === 'right' ? {
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '6px solid #F8F8F8', // Updated to match bg-gray-light
            left: '-5px',
        } : {
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '6px solid #F8F8F8', // Updated to match bg-gray-light
            right: '-6px',
        }),
    };

    return (
        <div
            className="relative flex items-center" // Use flex to align children if needed
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
            {isHovered && (
                <div className="absolute w-64 p-3 mt-2 text-xs text-gray-32 bg-gray-light shadow2-xl max-w-[217px] rounded shadow-lg z-50"
                    style={tooltipStyle}
                >
                    <span style={triangleStyle}></span>
                    {tooltipContent}
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;