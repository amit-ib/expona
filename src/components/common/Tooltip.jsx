import React, { useState } from 'react';

const Tooltip = ({ children, tooltipContent, showCondition, position = 'left' }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate tooltip style based on position prop
    const tooltipStyle = () => {
        const baseStyle = {
            position: 'absolute',
            zIndex: 50,
            backgroundColor: '#2E2F32', // bg-gray-32
            fontSize: '0.875rem', // text-sm
            borderRadius: '0.25rem', // rounded
            padding: '0.5rem 0.75rem', // px-3 py-2
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // shadow-lg
            whiteSpace: 'nowrap',
        };

        switch (position) {
            case 'right':
                return {
                    ...baseStyle,
                    left: 'calc(100% + 20px)', // Position 8px to the right of the container's left edge
                    top: '50%',
                    transform: 'translateY(-50%)',
                };
            case 'top':
                return {
                    ...baseStyle,
                    bottom: 'calc(100% + 8px)', // Position 8px above the container's bottom edge
                    left: '50%',
                    transform: 'translateX(-50%)',
                };
            case 'bottom':
                return {
                    ...baseStyle,
                    top: 'calc(100% + 8px)', // Position 8px below the container's top edge
                    left: '50%',
                    transform: 'translateX(-50%)',
                };
            case 'left':
            default:
                return {
                    ...baseStyle,
                    right: 'calc(100% + 20px)', // Position 8px to the left of the container's right edge
                    top: '50%',
                    transform: 'translateY(-50%)',
                };
        }
    };

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
            {(isHovered && (showCondition === undefined || showCondition) && tooltipContent) && (
                <div
                    className="absolute z-50 bg-gray-32 text-sm rounded px-3 py-2 shadow-lg whitespace-nowrap"
                    style={tooltipStyle()}
                >
                    {tooltipContent}
                </div>
            )}
        </div>
    );
};

export default Tooltip; 