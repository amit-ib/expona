import React, { useState, useEffect } from 'react';
import TabsComponent from '../ui/TabsComponent';
import AccordionComponent from '../ui/AccordionComponent';
import { ELIGIBILITY_TABS, MATCHED_ACCORDIONS } from '../../data/eligibilityData';
import SkeletonLoader from '../ui/SkeletonLoader .jsx';

const RightSideDrawer = ({ isOpen, onClose, company_id, filename, eligibilityData }) => {
    const [activeTab, setActiveTab] = useState('missed');
    const [openAccordion, setOpenAccordion] = useState(-1);
    const [reevaluatedMissedCriteria, setReevaluatedMissedCriteria] = useState(null);
    const [reevaluatedMatchedCriteria, setReevaluatedMatchedCriteria] = useState(null);

    // Handler to receive updated eligibility from AccordionComponent
    const handleEligibilityUpdate = (result) => {
        if (result && result.data && result.data.reevaluated_eligibility) {
            setReevaluatedMissedCriteria(result.data.reevaluated_eligibility.MissedCriteria || null);
            setReevaluatedMatchedCriteria(result.data.reevaluated_eligibility.MatchedCriteria || null);
        }
    };
    // console.log("SSS:", Array.isArray(reevaluatedMissedCriteria) ? reevaluatedMissedCriteria.length : 0, reevaluatedMissedCriteria)

    // Calculate tab counts for cleaner code
    const missedCriteriaCount = Array.isArray(reevaluatedMissedCriteria)
        ? reevaluatedMissedCriteria.length
        : (eligibilityData?.data?.missed_criteria ?? 0);
    const matchedCriteriaCount = Array.isArray(reevaluatedMatchedCriteria)
        ? reevaluatedMatchedCriteria.length
        : (eligibilityData?.data?.matched_criteria ?? 0);

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
                    src="/images/eligibility-bg.svg"
                    alt="Eligibility background"
                    className="absolute inset-0 w-full h-[335px] object-cover opacity-70"
                />
                <div className="relative z-10 px-4 pt-[214px] pb-11  text-center">
                    <p className="text-white text-2xl font-bold drop-shadow">You're almost there</p>
                    <p className="text-gray-ae text-sm mt-1">You meet {matchedCriteriaCount ?? 0} out of {eligibilityData?.data?.total_criteria ?? 0} criteria. Add turnover details and certifications to improve your chances.</p>
                </div>
            </div>

            {/* Tabs */}
            <TabsComponent
                tabs={[
                    { label: 'Missed Criteria', key: 'missed', count: missedCriteriaCount },
                    { label: 'Matched Criteria', key: 'matched', count: matchedCriteriaCount }
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 mt-5">
                {!eligibilityData ? (
                    <SkeletonLoader />
                ) : activeTab === 'missed' ? (
                    // Missed Criteria
                    <div>
                        {/* Accordions */}
                        <div className="space-y-3">
                            {(reevaluatedMissedCriteria || eligibilityData?.data.report.MissedCriteria || []).map((acc, idx) => (
                                <AccordionComponent
                                    key={acc.criteriaName}
                                    title={acc.criteriaName}
                                    justification={acc.justification}
                                    requirement={acc.criteriaDescription}
                                    importance={acc.importance}
                                    suggestion={acc.suggestion}
                                    actionType={Array.isArray(acc.actions) && acc.actions.length > 0 ? acc.actions[0].action : acc.action}
                                    actionDescription={Array.isArray(acc.actions) && acc.actions.length > 0 ? acc.actions[0].actionDescription : ''}
                                    isOpen={activeTab === 'missed' && openAccordion === idx}
                                    onToggle={() => setOpenAccordion(activeTab === 'missed' && openAccordion === idx ? -1 : idx)}
                                    statusColorClass="text-red-400 bg-red-500/10"
                                    filename={filename}
                                    onEligibilityUpdate={handleEligibilityUpdate}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    // Matched Criteria
                    <div>
                        <div className="space-y-3">
                            {(reevaluatedMatchedCriteria || eligibilityData?.data.report.MatchedCriteria || []).map((acc, idx) => (
                                <AccordionComponent
                                    key={acc.criteriaName}
                                    title={acc.criteriaName}
                                    requirement={acc.criteriaDescription}
                                    // importance={acc.importance}
                                    justification={acc.justification}
                                    isOpen={activeTab === 'matched' && openAccordion === idx}
                                    onToggle={() => setOpenAccordion(activeTab === 'matched' && openAccordion === idx ? -1 : idx)}
                                    statusText="Matched"
                                    statusColorClass="text-green-400 bg-green-500/10"
                                    filename={filename}
                                    onEligibilityUpdate={handleEligibilityUpdate}
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