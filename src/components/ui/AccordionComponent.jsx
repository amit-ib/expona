import React, { useState } from 'react';

const AccordionComponent = ({
    title,
    requirement,
    reason,
    suggestion,
    question,
    isOpen,
    onToggle,
    statusColorClass,
    iconColorClass = 'text-white'
}) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className=" rounded-lg overflow-hidden">
            <button
                className={`w-full flex justify-between items-center px-5 py-4 text-left text-white font-medium transition-all duration-500 hover:bg-gray-2d transition-colors focus:outline-none focus:bg-gray-2d  ${isOpen ? 'bg-gray-2d' : ''}`}
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span className="text-sm">{title}</span>
                <div className="flex items-center gap-2">

                    <svg
                        className={`w-4 h-4 transform transition-transform ${iconColorClass} ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="px-6 py-6 border-t border-gray-4f pt-3 bg-gray-2d">
                    <div className="pt-3">
                        {requirement && (
                            <>
                                <div className='text-xs text-gray-ae mb-1'>Requirement</div>
                                <div className='text-gray-ec mb-7'>
                                    {requirement}
                                </div>
                            </>
                        )}
                        {reason && (
                            <>
                                <div className='text-xs text-gray-ae mb-1'>Reason</div>
                                <div className='text-gray-ec mb-7'>
                                    {reason}
                                </div>
                            </>
                        )}
                        {suggestion && (
                            <>
                                <div className='text-xs text-gray-ae mb-1'>suggestion</div>
                                <div className='text-gray-ec mb-7'>
                                    {suggestion}
                                </div>
                            </>
                        )}
                        {question && (
                            <>
                                <div className='text-xs text-gray-ae'>{question}</div>

                                <div className='flex gap-4 mt-2 mb-5'>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio text-expona-red h-4 w-4"
                                            name="accordion-question"
                                            value="yes"
                                            checked={selectedOption === 'yes'}
                                            onChange={handleRadioChange}
                                        />
                                        <span className="ml-2 text-gray-ec text-sm">Yes</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio text-expona-red h-4 w-4"
                                            name="accordion-question"
                                            value="no"
                                            checked={selectedOption === 'no'}
                                            onChange={handleRadioChange}
                                        />
                                        <span className="ml-2 text-gray-ec text-sm">No</span>
                                    </label>
                                </div>
                                {selectedOption === 'yes' && (
                                    <button className='bg-expona-red rounded-md p-2 text-white w-full'>Re-evaluate Eligibility</button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccordionComponent; 