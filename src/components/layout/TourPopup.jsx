import React, { useState, useEffect, useRef } from 'react';

const tourSteps = [
    {
        title: 'Key Areas',
        text: 'Key points helps you to quickly return to important responses.Some are suggested by AI to get you started. You can add more as you go.',
        targetId: 'left-sidebar', // Placeholder ID for the left sidebar
        position: 'right', // Position popup to the right of the target
    },
    {
        title: 'Documents',
        text: "List of documents are added here for processing and quick overview.",
        targetId: 'right-sidebar', // Placeholder ID for the right sidebar
        position: 'left', // Position popup to the left of the target
    },
    {
        title: 'New Tenders',
        text: 'Create new tenders and start a new converesation',
        targetId: 'new-tender-btn', // Placeholder ID for the chat content area
        position: 'bottom', // Position popup below the target
    },

    {
        title: 'Check Your Eligibility',
        text: 'You can check your eligibility for the tender here.',
        targetId: 'eligibility-btn', // Placeholder ID for the chat content area
        position: 'top', // Position popup below the target
    },

];

const TourPopup = ({ isVisible, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const popupRef = useRef(null);
    const [popupPosition, setPopupPosition] = useState({});
    const [spotlightPosition, setSpotlightPosition] = useState({});

    useEffect(() => {
        if (!isVisible) return;

        const updatePosition = () => {
            const targetElement = document.getElementById(tourSteps[currentStep].targetId);
            if (targetElement) {
                const targetRect = targetElement.getBoundingClientRect();
                const popupElement = popupRef.current;
                if (popupElement) {
                    const popupRect = popupElement.getBoundingClientRect();
                    let top = 0;
                    let left = 0;

                    // Calculate spotlight dimensions based on position
                    let spotlightWidth = targetRect.width;
                    let spotlightLeft = targetRect.left;

                    if (tourSteps[currentStep].position === 'top') {
                        spotlightWidth = 127; // Fixed width for top position
                        spotlightLeft = targetRect.left; // Align to the left instead of centering
                    }

                    setSpotlightPosition({
                        top: targetRect.top,
                        left: spotlightLeft,
                        width: spotlightWidth,
                        height: targetRect.height,
                    });

                    switch (tourSteps[currentStep].position) {
                        case 'right':
                            top = targetRect.top + targetRect.height / 2 - popupRect.height / 2 - 200;
                            left = targetRect.right - 20;
                            break;
                        case 'left':
                            top = targetRect.top + targetRect.height / 2 - popupRect.height / 2 - 200;
                            left = targetRect.left - popupRect.width - 10;
                            break;
                        case 'bottom':
                            top = targetRect.bottom - 150;
                            left = targetRect.left + targetRect.width / 2 - popupRect.width / 2 + 350;
                            break;
                        case 'top':
                            top = targetRect.top - targetRect.height / 2 - popupRect.height / 2 + 100;
                            left = targetRect.left + targetRect.width / 2 - popupRect.width / 2 - 250;
                            break;
                        default:
                            break;
                    }

                    setPopupPosition({ top: `${top}px`, left: `${left}px` });
                }
            }
        };

        // Update position initially and on window resize
        updatePosition();
        window.addEventListener('resize', updatePosition);

        // Clean up event listener
        return () => window.removeEventListener('resize', updatePosition);
    }, [isVisible, currentStep]);


    if (!isVisible) return null;

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // This is the "Done" step
            onClose();
            localStorage.setItem('exponaTourSeen', 'true');
        }
    };

    const handleSkip = () => {
        onClose();
        localStorage.setItem('exponaTourSeen', 'true');
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isLastStep = currentStep === tourSteps.length - 1;

    return (
        <>
            {/* Base overlay */}
            <div className="fixed inset-0 bg-black opacity-0 z-40" />

            {/* Spotlight overlay */}
            <div
                className="fixed inset-0 z-40"
                style={{
                    background: 'transparent',
                    pointerEvents: 'none'
                }}
            >
                <div
                    className="absolute"
                    style={{
                        top: `${spotlightPosition.top}px`,
                        left: `${spotlightPosition.left}px`,
                        width: `${spotlightPosition.width}px`,
                        height: `${spotlightPosition.height}px`,
                        backgroundColor: 'transparent',
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                        // borderRadius: '4px',
                        transition: 'all 0.3s ease-in-out',
                        pointerEvents: 'none'
                    }}
                />
            </div>

            {/* Tour Popup */}
            <div
                ref={popupRef}
                className="fixed rounded-lg shadow-lg bg-gray-24 text-white z-50 p-6 w-80 w-[407px]"
                style={popupPosition}
            >
                {/* Border gradient - this is complex with pure CSS, might need additional elements or classes */}
                <div className="absolute inset-0 rounded-lg tour-border-gradient" style={{ border: '2px solid transparent', backgroundOrigin: 'border-box', backgroundClip: 'content-box, border-box', backgroundImage: 'linear-gradient(#1e1e1e, #1e1e1e), linear-gradient(to right, #3C00FF, #ff0000)' }}></div>

                <div className="relative z-10 flex flex-col">
                    {/* Title */}
                    <h3 className="text-xl  mb-2 flex justify-between items-center">{tourSteps[currentStep].title}
                        {/* Dots indicator */}
                        <div className="flex justify-end mb-2 space-x-1">
                            {tourSteps.map((_, index) => (
                                <span
                                    key={index}
                                    className={`block w-2 h-2 rounded-full ${index === currentStep ? 'bg-white' : 'bg-gray-600'
                                        }`}
                                ></span>
                            ))}
                        </div></h3>

                    {/* Text */}
                    <p className="text-sm text-gray-ae mb-6">{tourSteps[currentStep].text}</p>

                    {/* Buttons */}
                    <div className="flex items-center justify-between mt-2">
                        {/* Skip on the left */}
                        {!isLastStep && (
                            <button
                                className="px-2 py-2 text-sm font-semibold text-white rounded-md  transition-colors"
                                onClick={handleSkip}
                            >
                                Skip
                            </button>
                        )}
                        {/* Prev, Next on the right */}
                        <div className="flex gap-3">
                            <button
                                className={`px-6 py-2 text-sm font-semibold rounded-md border border-white/40 text-white bg-transparent transition-colors ${currentStep === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                            >
                                Prev
                            </button>
                            <button
                                className="px-6 py-2 text-sm font-semibold text-white rounded-md bg-expona-red hover:bg-red-700 transition-colors"
                                onClick={handleNext}
                            >
                                {isLastStep ? 'Done' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TourPopup; 