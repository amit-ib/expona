import React from 'react';
import { useNavigate } from 'react-router-dom';
import EditableInput from '../components/ui/EditableInput';
import EditableTextarea from '../components/ui/EditableTextarea';
import { fetchCompanyProfile, uploadCompanyDocument, fetchSupportingDocs } from '../api/apiHelper';
import CompanyDocumentsUpload from '../components/CompanyDocumentsUpload';
import CompanyFileList from '../components/CompanyFileList';
import { formatArrayStringForDisplay } from '../utils';
import { extractFileName, getSupportingFiles, documentSections } from '../utils/companyProfileUtils';
import { useCompanyProfile } from '../hooks/useCompanyProfile';

const CompanyProfile = () => {
    const navigate = useNavigate();
    // UI state for tab and editing
    const [activeTab, setActiveTab] = React.useState('company-info');
    const [editingSection, setEditingSection] = React.useState(null);
    const [editingField, setEditingField] = React.useState(null);

    // Use custom hook for all company profile data and logic
    const {
        companyProfile,
        loading,
        error,
        uploadedFiles,
        supportingDocs,
        handleFileUpload,
        setUploadedFiles,
        setCompanyProfile,
        setSupportingDocs,
        setError,
        setLoading
    } = useCompanyProfile();

    // Destructure message for easier access to fields
    const message = companyProfile?.message || {};

    const profileFiles = [];
    console.log("SUPPORTING DOC:", message)
    if (message.Certificate_of_Incorporation) {
        profileFiles.push({
            name: extractFileName(message.Certificate_of_Incorporation),
            url: message.Certificate_of_Incorporation,
            date: message.Date_of_Incorporation || '',
        });
    }

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

    // Section field keys for completeness check
    const basicInfoFields = [
        'Company_Name',
        'Website_URL',
        'Type_of_Business',
        'Date_of_Incorporation',
        'Years_in_Operation',
        'Number_of_Directors',
        'Total_Employees',
        'Company_Registration_Number',
        'Industries_Served',
        'Key_Partnerships',
    ];
    const taxInfoFields = [
        'GST_VAT_Number',
        'PAN_Number',
        'Tax_Residency',
        'Annual_Turnover_Revenue',
    ];
    const legalInfoFields = [
        'Legal_Entity_Type',
        'Net_Worth',
        'Authorized_Capital',
    ];

    function isSectionIncomplete(fields) {
        return fields.some(key => !message[key] || message[key].toString().trim() === '');
    }

    // Count of incomplete sections
    const incompleteSectionsCount = [
        isSectionIncomplete(basicInfoFields),
        isSectionIncomplete(taxInfoFields),
        isSectionIncomplete(legalInfoFields),
        profileFiles.length === 0
    ].filter(Boolean).length;

    // Helper to determine if there are files for a given doc section
    function hasFilesForSection(docName) {
        return getSupportingFiles(supportingDocs, docName).length > 0;
    }

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

                    {/* Loading/Error/Debug Info */}
                    {loading && <div className="text-white mb-4">Loading company profile...</div>}
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    {companyProfile && (
                        <pre className="text-white bg-gray-32 rounded p-4 mb-4 overflow-x-auto text-xs">{JSON.stringify(companyProfile, null, 2)}</pre>
                    )}

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
                                            <span className="text-xs font-light  text-red-83">{incompleteSectionsCount}</span>
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
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="text-white font-lexend text-base font-medium">Basic Information</h3>
                                            {isSectionIncomplete(basicInfoFields) && (
                                                <div className="bg-expona-red bg-opacity-20 rounded-md px-2 py-0.5 h-5 flex items-center">
                                                    <span className="text-xs font-light  text-red-83">In-Complete</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-ae font-lexend text-sm font-light">Core details about your company</p>
                                    </div>
                                    <div className="bg-gray-32 rounded-md flex-1 p-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <EditableInput
                                                label="Company Name"
                                                placeholder=""
                                                defaultValue={message.Company_Name || ''}
                                                fieldId="companyName"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />
                                            <EditableInput
                                                label="Website URL"
                                                placeholder=""
                                                defaultValue={message.Website_URL || ''}
                                                fieldId="websiteUrl"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />
                                            <EditableInput
                                                label="Type of Business"
                                                placeholder=""
                                                defaultValue={message.Type_of_Business || ''}
                                                fieldId="typeOfBusiness"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Date of Incorporation"
                                                placeholder=""
                                                defaultValue={message.Date_of_Incorporation || ''}
                                                fieldId="dateOfIncorporation1"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Years in Operation"
                                                placeholder=""
                                                defaultValue={message.Years_in_Operation || ''}
                                                fieldId="yearsInOperation"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Number of Directors"
                                                placeholder=""
                                                defaultValue={message.Number_of_Directors || ''}
                                                fieldId="numberOfDirectors"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />



                                            <EditableInput
                                                label="Total Employees"
                                                placeholder=""
                                                defaultValue={message.Total_Employees || ''}
                                                fieldId="totalEmployees"
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
                                            <EditableTextarea
                                                label="Industries Served"
                                                placeholder=""
                                                defaultValue={formatArrayStringForDisplay(message.Industries_Served || '')}
                                                fieldId="industriesServed"
                                                sectionId="basicInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />
                                            <EditableTextarea
                                                label="Key Partnerships"
                                                placeholder=""
                                                defaultValue={formatArrayStringForDisplay(message.Key_Partnerships || '')}
                                                fieldId="keyPartnerships"
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
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="text-white font-lexend text-base font-medium">Tax Information</h3>
                                            {isSectionIncomplete(taxInfoFields) && (
                                                <div className="bg-expona-red bg-opacity-20 rounded-md px-2 py-0.5 h-5 flex items-center">
                                                    <span className="text-xs font-light  text-red-83">In-Complete</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-ae font-lexend text-sm font-light">Tax registration and compliance detailsny</p>
                                    </div>
                                    <div className="bg-gray-32 rounded-md flex-1 p-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <EditableInput
                                                label="GST/VAT Number"
                                                placeholder=""
                                                defaultValue={message.GST_VAT_Number || ''}
                                                fieldId="gstNumber"
                                                sectionId="taxInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="PAN Number"
                                                placeholder=""
                                                defaultValue={message.PAN_Number || ''}
                                                fieldId="panNumber"
                                                sectionId="taxInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Tax Residency"
                                                placeholder=""
                                                defaultValue={message.Tax_Residency || ''}
                                                fieldId="taxResidency"
                                                sectionId="taxInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Annual Turnover Revenue"
                                                placeholder=""
                                                defaultValue={message.Annual_Turnover_Revenue || ''}
                                                fieldId="annualTurnoverRevenue"
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
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="text-white font-lexend text-base font-medium">Legal Information</h3>
                                            {isSectionIncomplete(legalInfoFields) && (
                                                <div className="bg-expona-red bg-opacity-20 rounded-md px-2 py-0.5 h-5 flex items-center">
                                                    <span className="text-xs font-light  text-red-83">In-Complete</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-ae font-lexend text-sm font-light">Legal structure and regulatory information</p>
                                    </div>
                                    <div className="bg-gray-32 rounded-md flex-1 p-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <EditableInput
                                                label="Legal Entity Type"
                                                placeholder=""
                                                defaultValue={message.Legal_Entity_Type || ''}
                                                fieldId="legalEntityType"
                                                sectionId="legalInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Net Worth"
                                                placeholder=""
                                                defaultValue={message.Net_Worth || ''}
                                                fieldId="netWorth"
                                                sectionId="legalInfo"
                                                editingSection={editingSection}
                                                editingField={editingField}
                                                onEditClick={handleEditClick}
                                            />

                                            <EditableInput
                                                label="Authorized Capital"
                                                placeholder=""
                                                defaultValue={message.Authorized_Capital || ''}
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
                                            {profileFiles.length === 0 && (
                                                <div className="bg-expona-red bg-opacity-20 rounded-md px-2 py-0.5 h-5 flex items-center">
                                                    <span className="text-xs font-light  text-red-83">In-Complete</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-ae font-lexend text-sm font-light">Attach supporting documents</p>
                                    </div>
                                    <div className="bg-gray-32 rounded-md flex-1 p-8 flex flex-col gap-12">
                                        {/* Document Upload Cards (Refactored) */}
                                        {documentSections.map(section => (
                                            <div key={section.docName} className="bg-gray-32 rounded-xl flex flex-col gap-4 w-full">
                                                <div className="flex gap-3 px-6 py-0">
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-medium mb-1">{section.label}</h4>
                                                        <p className="text-gray-ae text-xs">{section.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-6 px-6">
                                                    {/* Only show upload if no files exist for this section */}
                                                    {!hasFilesForSection(section.docName) && (
                                                        <CompanyDocumentsUpload
                                                            uploadedFiles={uploadedFiles}
                                                            onFileUpload={(file, action) => handleFileUpload(file, action, section.docName)}
                                                        />
                                                    )}
                                                    <CompanyFileList
                                                        uploadedFiles={getSupportingFiles(supportingDocs, section.docName)}
                                                        onFileUpload={() => { }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
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