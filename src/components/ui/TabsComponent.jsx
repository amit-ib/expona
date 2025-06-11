import React from 'react';

const TabsComponent = ({
    tabs,
    activeTab,
    onTabChange,
    className = "bg-gray-2d mx-4 mt-6 rounded-lg p-1"
}) => {
    return (
        <div className={`flex ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md transition-all duration-200 ${activeTab === tab.key
                        ? 'text-white bg-gray-24 shadow-sm'
                        : 'text-gray-ae hover:text-white hover:bg-gray-37'
                        }`}
                    onClick={() => onTabChange(tab.key)}
                    aria-selected={activeTab === tab.key}
                    role="tab"
                >
                    {tab.label} {tab.count !== undefined && <span className='text-gray-ae'>({tab.count})</span>}
                </button>
            ))}
        </div>
    );
};

export default TabsComponent; 