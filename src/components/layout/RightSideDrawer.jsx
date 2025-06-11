import React, { useState } from 'react';
import TabsComponent from '../ui/TabsComponent';
import AccordionComponent from '../ui/AccordionComponent';
import { ELIGIBILITY_TABS, MISSED_ACCORDIONS, MATCHED_ACCORDIONS } from '../../data/eligibilityData';

const RightSideDrawer = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('missed');
    const [openAccordion, setOpenAccordion] = useState(-1);

    return (
        <div
            className={`fixed top-0 right-0 h-full w-[465px] bg-gray-24 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50 flex flex-col`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 relative z-10">
                <h2 className="text-lg font-semibold text-white">Eligibility Criteria</h2>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-400 focus:outline-none"
                    aria-label="Close drawer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Background Image Section */}
            <div className="relative  w-full flex items-end justify-start bg-gray-800 overflow-hidden">
                <img
                    src="/images/eligibility-bg.png"
                    alt="Eligibility background"
                    className="absolute inset-0 w-full h-[335px] object-cover opacity-70"
                />
                <div className="relative z-10 px-4 pt-[214px] pb-11  text-center">
                    <p className="text-white text-2xl font-bold drop-shadow">You're almost there</p>
                    <p className="text-gray-ae text-sm mt-1">You meet 7 out of 9 criteria. Add turnover details and certifications to improve your chances.</p>
                </div>
            </div>

            {/* Tabs */}
            <TabsComponent
                tabs={ELIGIBILITY_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 mt-5">
                {activeTab === 'missed' ? (
                    // Missed Criteria
                    <div>
                        {/* Accordions */}
                        <div className="space-y-3">
                            {MISSED_ACCORDIONS.map((acc, idx) => (
                                <AccordionComponent
                                    key={acc.title}
                                    title={acc.title}
                                    requirement={acc.requirement}
                                    suggestion={acc.suggestion}
                                    question={acc.question}
                                    isOpen={activeTab === 'missed' && openAccordion === idx}
                                    onToggle={() => setOpenAccordion(activeTab === 'missed' && openAccordion === idx ? -1 : idx)}
                                    statusColorClass="text-red-400 bg-red-500/10"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    // Matched Criteria
                    <div>
                        <div className="space-y-3">
                            {MATCHED_ACCORDIONS.map((acc, idx) => (
                                <AccordionComponent
                                    key={acc.title}
                                    title={acc.title}
                                    requirement={acc.requirement}
                                    reason={acc.reason}
                                    isOpen={activeTab === 'matched' && openAccordion === idx}
                                    onToggle={() => setOpenAccordion(activeTab === 'matched' && openAccordion === idx ? -1 : idx)}
                                    statusText="Matched"
                                    statusColorClass="text-green-400 bg-green-500/10"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RightSideDrawer; 