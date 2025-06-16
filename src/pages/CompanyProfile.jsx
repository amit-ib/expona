import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditableInput from '../components/ui/EditableInput';

const CompanyProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('company-info');
    const [editingSection, setEditingSection] = useState(null);
    const [editingField, setEditingField] = useState(null);

    const tabs = [
        { key: 'company-info', label: 'Company Info' },
        { key: 'personal-info', label: 'Personal Info' }
    ];

    const handleBack = () => {
        navigate(-1);
    };

    const handleEditClick = (fieldName, sectionName) => {
        setEditingSection(sectionName);
        setEditingField(fieldName);
    };

    const handleCancel = () => {
        setEditingSection(null);
        setEditingField(null);
    };

    const handleSaveChanges = () => {
        setEditingSection(null);
        setEditingField(null);
        // Add save logic here
    };

    return (
        <div className="bg-gray-24 min-h-screen overflow-y-auto">
            {/* Header */}
            <header className="bg-gray-24 border-b border-gray-4f flex items-center gap-6 px-8 py-10 w-full h-[90px]">
                <div className="flex items-center gap-6">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="bg-gray-32 border border-gray-4f rounded-lg p-2 w-10 h-10 flex items-center justify-center hover:bg-gray-37 transition-colors"
                        aria-label="Go back"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Title */}
                    <h1 className="text-white text-xl font-semibold font-lexend">Profile</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-8 py-6">
                <div className="max-w-[1088px] mx-auto">


                    {/* Tab Group */}
                    <div className="border-b border-gray-4f mb-6">
                        <div className="flex gap-3 w-[1064px]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`flex items-center justify-center gap-2.5 px-4 py-3 font-lexend text-base font-normal leading-[1.375] transition-colors ${activeTab === tab.key
                                        ? 'text-white border-b-2 border-white'
                                        : 'text-gray-ae hover:text-white'
                                        }`}
                                    onClick={() => setActiveTab(tab.key)}
                                    role="tab"
                                    aria-selected={activeTab === tab.key}
                                >
                                    {tab.label}
                                    {tab.key === 'company-info' && activeTab === tab.key && (
                                        <div className="bg-expona-red bg-opacity-20 rounded-[17px] w-6 h-6 flex items-center justify-center">
                                            <span className="text-xs font-light  text-red-83">2</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="pt-6">
                        {activeTab === 'company-info' && (
                            <div className="flex flex-col gap-6 w-full">
                                {/* Basic Information Section */}
                                <div className="flex gap-8 pt-6 w-full">
                                    <div className="flex flex-col gap-0.5 w-[270px] flex-shrink-0">
                                        <h3 className="text-white font-lexend text-base font-medium">Basic Information</h3>
                                        <p className="text-gray-ae font-lexend text-sm font-light">Core details about your company</p>
                                    </div>
                                    <div className="bg-gray-32 rounded-md flex-1 p-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <EditableInput
                                                label="Type of Business"
                                                placeholder="Steel Exporter"
                                                defaultValue="Steel Exporter"
                                                fieldId="typeOfBusiness"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Date of Incorporation"
                                                placeholder="12.05.2025"
                                                defaultValue="12.05.2025"
                                                fieldId="dateOfIncorporation1"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Company Registration Number"
                                                placeholder=""
                                                defaultValue=""
                                                fieldId="companyRegistrationNumber"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Business Category"
                                                placeholder="Steel Exporter"
                                                defaultValue="Steel Exporter"
                                                fieldId="businessCategory"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />
                                        </div>

                                        {/* Section Edit Buttons */}
                                        {editingSection === 'basicInfo' && (
                                            <div className="flex justify-end gap-4 mt-6 pt-4 ">
                                                <button
                                                    onClick={handleCancel}
                                                    className="bg-gray-24 text-white px-12 py-2 rounded-lg font-medium hover:bg-gray-4f transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveChanges}
                                                    className="bg-expona-red text-white px-6 py-2 rounded-lg font-medium hover:bg-ib-red transition-colors"
                                                >
                                                    Save changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tax Information Section */}
                                <div className="flex gap-8 w-full">
                                    <div className="flex flex-col gap-0.5 w-[270px] flex-shrink-0">
                                        <h3 className="text-white font-lexend text-base font-medium">Tax Information</h3>
                                        <p className="text-gray-ae font-lexend text-sm font-light">Tax registration and compliance detailsny</p>
                                    </div>
                                    <div className="bg-gray-32 rounded-md flex-1 p-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <EditableInput
                                                label="GST/VAT Number"
                                                placeholder="27AADCT1234A1Z5"
                                                defaultValue="27AADCT1234A1Z5"
                                                fieldId="gstNumber"
                                                sectionId="taxInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="PAN Number"
                                                placeholder="AADCT1234A"
                                                defaultValue="AADCT1234A"
                                                fieldId="panNumber"
                                                sectionId="taxInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Tax Residency"
                                                placeholder="India"
                                                defaultValue="India"
                                                fieldId="taxResidency"
                                                sectionId="taxInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />
                                        </div>

                                        {/* Section Edit Buttons */}
                                        {editingSection === 'taxInfo' && (
                                            <div className="flex justify-end gap-4 mt-6 pt-4 ">
                                                <button
                                                    onClick={handleCancel}
                                                    className="bg-gray-24 text-white px-12 py-2 rounded-lg font-medium hover:bg-gray-4f transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveChanges}
                                                    className="bg-expona-red text-white px-6 py-2 rounded-lg font-medium hover:bg-ib-red transition-colors"
                                                >
                                                    Save changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Legal Information Section */}
                                <div className="flex gap-8 w-full">
                                    <div className="flex flex-col gap-0.5 w-[270px] flex-shrink-0">
                                        <h3 className="text-white font-lexend text-base font-medium">Legal Information</h3>
                                        <p className="text-gray-ae font-lexend text-sm font-light">Legal structure and regulatory information</p>
                                    </div>
                                    <div className="bg-gray-32 rounded-md flex-1 p-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <EditableInput
                                                label="Legal Entity Type"
                                                placeholder="Private Limited Company"
                                                defaultValue="Private Limited Company"
                                                fieldId="legalEntityType"
                                                sectionId="legalInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Number of Directors"
                                                placeholder="3"
                                                defaultValue="3"
                                                fieldId="numberOfDirectors"
                                                sectionId="legalInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Authorized Capital"
                                                placeholder="₹10,00,000"
                                                defaultValue="₹10,00,000"
                                                fieldId="authorizedCapital"
                                                sectionId="legalInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />
                                        </div>

                                        {/* Section Edit Buttons */}
                                        {editingSection === 'legalInfo' && (
                                            <div className="flex justify-end gap-4 mt-6 pt-4 ">
                                                <button
                                                    onClick={handleCancel}
                                                    className="bg-gray-24 text-white px-12 py-2 rounded-lg font-medium hover:bg-gray-4f transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveChanges}
                                                    className="bg-expona-red text-white px-6 py-2 rounded-lg font-medium hover:bg-ib-red transition-colors"
                                                >
                                                    Save changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Required Document Section */}
                                <div className="flex gap-8 w-full">
                                    <div className="flex flex-col gap-0.5 w-[270px] flex-shrink-0">
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="text-white font-lexend text-base font-medium">Required Documents</h3>
                                            <div className="bg-expona-red bg-opacity-20 rounded-md px-2 py-0.5 h-5 flex items-center">
                                                <span className="text-xs font-light  text-red-83">In-Complete</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-ae font-lexend text-sm font-light">Attach supporting documents</p>
                                    </div>
                                    <div className="bg-gray-32 rounded-md flex-1 p-8 flex flex-col gap-12">
                                        {/* Document Upload Cards */}
                                        <div className="bg-gray-32 rounded-xl flex flex-col gap-4 w-full">
                                            <div className="flex gap-3 px-6 py-0">
                                                <div className="flex-1">
                                                    <h4 className="text-white font-medium mb-1">Certificate of Incorporation</h4>
                                                    <p className="text-gray-ae text-xs">Official document proving your company's legal existence</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-6 px-6">
                                                <div className="border-2 border-dashed border-gray-4f rounded-lg p-11 flex items-center justify-center gap-4 text-center">
                                                    <div className="w-12 h-12 bg-ib-red rounded-full flex items-center justify-center">
                                                        <img src="/images/upload-figma-icon.svg" className='h-6' alt="upload-icon" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-medium mb-1">
                                                            Drag & drop files here <span className="text-gray-ae">or</span> <span className="underline cursor-pointer hover:text-gray-300">click here</span>
                                                        </p>
                                                        <p className="text-gray-ae text-xs">PDF, DOC, TXT (Max file size 20 mb)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-32 rounded-xl flex flex-col gap-4 w-full">
                                            <div className="flex gap-3 px-6 py-0">
                                                <div className="flex-1">
                                                    <h4 className="text-white font-medium mb-1">Certificate of Incorporation</h4>
                                                    <p className="text-gray-ae text-xs">Official document proving your company's legal existence</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-6 px-6">
                                                <div className="border-2 border-dashed border-gray-4f rounded-lg p-11 flex  items-center justify-center gap-4 text-center">
                                                    <div className="w-12 h-12 bg-ib-red rounded-full flex items-center justify-center">
                                                        <img src="/images/upload-figma-icon.svg" className='h-6' alt="upload-icon" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-medium mb-1">
                                                            Drag & drop files here <span className="text-gray-ae">or</span> <span className="underline cursor-pointer hover:text-gray-300">click here</span>
                                                        </p>
                                                        <p className="text-gray-ae text-xs">PDF, DOC, TXT (Max file size 20 mb)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-32 rounded-xl flex flex-col gap-4 w-full">
                                            <div className="flex gap-3 px-6 py-0">
                                                <div className="flex-1">
                                                    <h4 className="text-white font-medium mb-1">GST Registration Certificate</h4>
                                                    <p className="text-gray-ae text-xs">Document with GST Details</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2.5 px-6">
                                                <div className="border border-gray-4f rounded-lg p-4 flex items-center gap-3">
                                                    <img src="/images/file-icon.svg" className='h-6' alt="upload-icon" />
                                                    <div className="flex-1">
                                                        <h5 className="text-white font-medium text-sm">Company registration.pdf</h5>
                                                        <p className="text-gray-ae text-xs">22 May 2025</p>
                                                    </div>
                                                    <button className="text-gray-ae hover:text-white transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'personal-info' && (
                            <div className="text-center py-12">
                                <p className="text-gray-ae">Personal Info content will be implemented here</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CompanyProfile; 