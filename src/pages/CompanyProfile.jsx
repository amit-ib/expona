import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import EditableInput from "../components/ui/EditableInput";
import EditableTextarea from "../components/ui/EditableTextarea";
import {
  fetchCompanyProfile,
  uploadCompanyDocument,
  fetchSupportingDocs,
  updateCompanyProfile,
} from "../api/apiHelper";
import CompanyDocumentsUpload from "../components/CompanyDocumentsUpload";
import CompanyFileList from "../components/CompanyFileList";
import { formatArrayStringForDisplay } from "../utils";
import {
  extractFileName,
  getSupportingFiles,
  documentSections,
  filterFilesByText,
} from "../utils/companyProfileUtils";
import { useCompanyProfile } from "../hooks/useCompanyProfile";

const CompanyProfile = () => {
  const navigate = useNavigate();
  // UI state for tab and editing
  const [activeTab, setActiveTab] = React.useState("company-info");
  const [editingSection, setEditingSection] = React.useState(null);
  const [editingField, setEditingField] = React.useState(null);

  // Section field keys for completeness check
  const basicInfoFields = [
    "Company_Name",
    "Website_URL",
    "Type_of_Business",
    "Date_of_Incorporation",
    "Years_in_Operation",
    "Number_of_Directors",
    "Total_Employees",
    "Company_Registration_Number",
    "Industries_Served",
    "Key_Partnerships",
  ];
  const taxInfoFields = [
    "GST_VAT_Number",
    "PAN_Number",
    "Tax_Residency",
    "Annual_Turnover_Revenue",
  ];
  const legalInfoFields = [
    "Legal_Entity_Type",
    "Net_Worth",
    "Authorized_Capital",
  ];

  // Refs for all editable fields using API field names
  const fieldRefs = {
    basicInfo: {
      Company_Name: useRef(),
      Website_URL: useRef(),
      Type_of_Business: useRef(),
      Date_of_Incorporation: useRef(),
      Years_in_Operation: useRef(),
      Number_of_Directors: useRef(),
      Total_Employees: useRef(),
      Company_Registration_Number: useRef(),
      Industries_Served: useRef(),
      Key_Partnerships: useRef(),
    },
    taxInfo: {
      GST_VAT_Number: useRef(),
      PAN_Number: useRef(),
      Tax_Residency: useRef(),
      Annual_Turnover_Revenue: useRef(),
    },
    legalInfo: {
      Legal_Entity_Type: useRef(),
      Net_Worth: useRef(),
      Authorized_Capital: useRef(),
    },
  };

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
    setLoading,
  } = useCompanyProfile();

  // Destructure message for easier access to fields
  const message = companyProfile?.message || {};

  const profileFiles = [];

  if (message.Certificate_of_Incorporation) {
    profileFiles.push({
      name: extractFileName(message.Certificate_of_Incorporation),
      url: message.Certificate_of_Incorporation,
      date: message.Date_of_Incorporation || "",
    });
  }

  const tabs = [
    { key: "company-info", label: "Company Info" },
    { key: "personal-info", label: "Personal Info" },
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

  const handleSaveChanges = async () => {
    if (editingSection) {
      const profileData = {};

      // Get the appropriate field array based on editing section
      let fieldsToProcess = [];
      let sectionRefs = {};

      if (editingSection === "basicInfo") {
        fieldsToProcess = basicInfoFields;
        sectionRefs = fieldRefs.basicInfo;
      } else if (editingSection === "taxInfo") {
        fieldsToProcess = taxInfoFields;
        sectionRefs = fieldRefs.taxInfo;
      } else if (editingSection === "legalInfo") {
        fieldsToProcess = legalInfoFields;
        sectionRefs = fieldRefs.legalInfo;
      }

      // Collect data from refs using the field arrays - no mapping needed!
      fieldsToProcess.forEach((fieldName) => {
        if (sectionRefs[fieldName]?.current?.getValue) {
          profileData[fieldName] = sectionRefs[fieldName].current.getValue();
        }
      });

      try {
        // Use companyProfile?.message?.company_id or similar for company_id
        const company_id = companyProfile?.message?.Company_ID;
        if (!company_id) {
          throw new Error("No company_id found in profile");
        }
        // console.log(values);
        await updateCompanyProfile(company_id, profileData);
      } catch (err) {
        console.error("Failed to update company profile:", err);
      }
    }
    setEditingSection(null);
    setEditingField(null);
  };

  function isSectionIncomplete(fields) {
    return fields.some(
      (key) => !message[key] || message[key].toString().trim() === ""
    );
  }

  // Count of incomplete sections
  const incompleteSectionsCount = [
    isSectionIncomplete(basicInfoFields),
    isSectionIncomplete(taxInfoFields),
    isSectionIncomplete(legalInfoFields),
    profileFiles.length === 0,
  ].filter(Boolean).length;

  // Helper to determine if there are files for a given doc section
  function hasFilesForSection(docName) {
    return getSupportingFiles(supportingDocs, docName).length > 0;
  }

  // Prepare files for Other documents section
  // const otherDocsFiles = getSupportingFiles(supportingDocs);
  console.log(supportingDocs);

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
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Title */}
          <h1 className="text-white text-xl font-semibold font-lexend">
            Profile
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-6">
        <div className="max-w-[1088px] mx-auto">
          {/* Loading/Error/Debug Info */}
          {loading && (
            <div className="text-white mb-4">Loading company profile...</div>
          )}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {/* {companyProfile && (
            <pre className="text-white bg-gray-32 rounded p-4 mb-4 overflow-x-auto text-xs">
              {JSON.stringify(companyProfile, null, 2)}
            </pre>
          )} */}

          {/* Tab Group */}
          <div className="border-b border-gray-4f mb-6">
            <div className="flex gap-3 w-[1064px]">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`flex items-center justify-center gap-2.5 px-4 py-3 font-lexend text-base font-normal leading-[1.375] transition-colors ${
                    activeTab === tab.key
                      ? "text-white border-b-2 border-white"
                      : "text-gray-ae hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                >
                  {tab.label}
                  {tab.key === "company-info" && activeTab === tab.key && (
                    <div className="bg-expona-red bg-opacity-20 rounded-[17px] w-6 h-6 flex items-center justify-center">
                      <span className="text-xs font-light  text-red-83">
                        {incompleteSectionsCount}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {activeTab === "company-info" && (
              <div className="flex flex-col gap-6 w-full">
                {/* Basic Information Section */}
                <div className="flex gap-8 pt-6 w-full">
                  <div className="flex flex-col gap-0.5 w-[270px] flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-white font-lexend text-base font-medium">
                        Basic Information
                      </h3>
                      {isSectionIncomplete(basicInfoFields) && (
                        <div className="bg-expona-red bg-opacity-20 rounded-md px-2 py-0.5 h-5 flex items-center">
                          <span className="text-xs font-light  text-red-83">
                            In-Complete
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-ae font-lexend text-sm font-light">
                      Core details about your company
                    </p>
                  </div>
                  <div className="bg-gray-32 rounded-md flex-1 p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <EditableInput
                        label="Company Name"
                        placeholder=""
                        defaultValue={message.Company_Name || ""}
                        fieldId="Company_Name"
                        sectionId="basicInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.basicInfo.Company_Name}
                      />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-white font-lexend text-sm font-normal">
                          Website URL
                        </label>
                        <div className="bg-gray-2d border border-gray-4f rounded-lg shadow-sm relative group">
                          <input
                            type="text"
                            className="w-full bg-transparent font-inter text-base p-3.5 outline-none transition-colors rounded-lg pr-12 text-gray-ae"
                            placeholder="Website URL"
                            value={message.Website_URL || ""}
                            readOnly={true}
                          />
                        </div>
                      </div>
                      <EditableInput
                        label="Type of Business"
                        placeholder=""
                        defaultValue={message.Type_of_Business || ""}
                        fieldId="Type_of_Business"
                        sectionId="basicInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.basicInfo.Type_of_Business}
                      />

                      <EditableInput
                        label="Date of Incorporation"
                        placeholder=""
                        defaultValue={message.Date_of_Incorporation || ""}
                        fieldId="Date_of_Incorporation"
                        sectionId="basicInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.basicInfo.Date_of_Incorporation}
                      />

                      <EditableInput
                        label="Years in Operation"
                        placeholder=""
                        defaultValue={message.Years_in_Operation || ""}
                        fieldId="Years_in_Operation"
                        sectionId="basicInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.basicInfo.Years_in_Operation}
                      />

                      <EditableInput
                        label="Number of Directors"
                        placeholder=""
                        defaultValue={message.Number_of_Directors || ""}
                        fieldId="Number_of_Directors"
                        sectionId="basicInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.basicInfo.Number_of_Directors}
                      />

                      <EditableInput
                        label="Total Employees"
                        placeholder=""
                        defaultValue={message.Total_Employees || ""}
                        fieldId="Total_Employees"
                        sectionId="basicInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.basicInfo.Total_Employees}
                      />

                      <EditableInput
                        label="Company Registration Number"
                        placeholder=""
                        defaultValue=""
                        fieldId="Company_Registration_Number"
                        sectionId="basicInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.basicInfo.Company_Registration_Number}
                      />
                      <EditableTextarea
                        label="Industries Served"
                        placeholder=""
                        defaultValue={formatArrayStringForDisplay(
                          message.Industries_Served || ""
                        )}
                        fieldId="Industries_Served"
                        sectionId="basicInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.basicInfo.Industries_Served}
                      />
                      <EditableTextarea
                        label="Key Partnerships"
                        placeholder=""
                        defaultValue={formatArrayStringForDisplay(
                          message.Key_Partnerships || ""
                        )}
                        fieldId="Key_Partnerships"
                        sectionId="basicInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.basicInfo.Key_Partnerships}
                      />
                    </div>

                    {/* Section Edit Buttons */}
                    {editingSection === "basicInfo" && (
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
                      <h3 className="text-white font-lexend text-base font-medium">
                        Tax Information
                      </h3>
                      {isSectionIncomplete(taxInfoFields) && (
                        <div className="bg-expona-red bg-opacity-20 rounded-md px-2 py-0.5 h-5 flex items-center">
                          <span className="text-xs font-light  text-red-83">
                            In-Complete
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-ae font-lexend text-sm font-light">
                      Tax registration and compliance details
                    </p>
                  </div>
                  <div className="bg-gray-32 rounded-md flex-1 p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <EditableInput
                        label="GST/VAT Number"
                        placeholder=""
                        defaultValue={message.GST_VAT_Number || ""}
                        fieldId="GST_VAT_Number"
                        sectionId="taxInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.taxInfo.GST_VAT_Number}
                      />

                      <EditableInput
                        label="PAN Number"
                        placeholder=""
                        defaultValue={message.PAN_Number || ""}
                        fieldId="PAN_Number"
                        sectionId="taxInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.taxInfo.PAN_Number}
                      />

                      <EditableInput
                        label="Tax Residency"
                        placeholder=""
                        defaultValue={message.Tax_Residency || ""}
                        fieldId="Tax_Residency"
                        sectionId="taxInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.taxInfo.Tax_Residency}
                      />

                      <EditableInput
                        label="Annual Turnover Revenue"
                        placeholder=""
                        defaultValue={message.Annual_Turnover_Revenue || ""}
                        fieldId="Annual_Turnover_Revenue"
                        sectionId="taxInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.taxInfo.Annual_Turnover_Revenue}
                      />
                    </div>

                    {/* Section Edit Buttons */}
                    {editingSection === "taxInfo" && (
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
                      <h3 className="text-white font-lexend text-base font-medium">
                        Legal Information
                      </h3>
                      {isSectionIncomplete(legalInfoFields) && (
                        <div className="bg-expona-red bg-opacity-20 rounded-md px-2 py-0.5 h-5 flex items-center">
                          <span className="text-xs font-light  text-red-83">
                            In-Complete
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-ae font-lexend text-sm font-light">
                      Legal structure and regulatory information
                    </p>
                  </div>
                  <div className="bg-gray-32 rounded-md flex-1 p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <EditableInput
                        label="Legal Entity Type"
                        placeholder=""
                        defaultValue={message.Legal_Entity_Type || ""}
                        fieldId="Legal_Entity_Type"
                        sectionId="legalInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.legalInfo.Legal_Entity_Type}
                      />

                      <EditableInput
                        label="Net Worth"
                        placeholder=""
                        defaultValue={message.Net_Worth || ""}
                        fieldId="Net_Worth"
                        sectionId="legalInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.legalInfo.Net_Worth}
                      />

                      <EditableInput
                        label="Authorized Capital"
                        placeholder=""
                        defaultValue={message.Authorized_Capital || ""}
                        fieldId="Authorized_Capital"
                        sectionId="legalInfo"
                        editingSection={editingSection}
                        editingField={editingField}
                        onEditClick={handleEditClick}
                        ref={fieldRefs.legalInfo.Authorized_Capital}
                      />
                    </div>

                    {/* Section Edit Buttons */}
                    {editingSection === "legalInfo" && (
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
                      <h3 className="text-white font-lexend text-base font-medium">
                        Required Documents
                      </h3>
                      {profileFiles.length === 0 && (
                        <div className="bg-expona-red bg-opacity-20 rounded-md px-2 py-0.5 h-5 flex items-center">
                          <span className="text-xs font-light  text-red-83">
                            In-Complete
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-ae font-lexend text-sm font-light">
                      Attach supporting documents
                    </p>
                  </div>
                  <div className="bg-gray-32 rounded-md flex-1 p-8 flex flex-col gap-12">
                    {/* Document Upload Cards (Refactored) */}
                    {documentSections.map((document) => (
                      <div
                        key={document.docName}
                        className="bg-gray-32 rounded-xl flex flex-col gap-4 w-full"
                      >
                        <div className="flex gap-3 px-6 py-0">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">
                              {document.label}
                            </h4>
                            <p className="text-gray-ae text-xs">
                              {document.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-6 px-6">
                          {/* Only show upload if no files exist for this section */}
                          {!hasFilesForSection(document.docName) && (
                            <CompanyDocumentsUpload
                              uploadedFiles={uploadedFiles}
                              onFileUpload={(file, action) =>
                                handleFileUpload(file, action, document.docName)
                              }
                            />
                          )}
                          <CompanyFileList
                            uploadedFiles={getSupportingFiles(
                              supportingDocs,
                              document.docName
                            )}
                            onFileUpload={handleFileUpload}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supporting Document Section */}
                {supportingDocs && Array.isArray(supportingDocs.data) && (
                  <div className="flex gap-8 w-full">
                    <div className="flex flex-col gap-0.5 w-[270px] flex-shrink-0">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-white font-lexend text-base font-medium">
                          Supporting Documents
                        </h3>
                        {/* {profileFiles.length === 0 && (
                                                <div className="bg-expona-red bg-opacity-20 rounded-md px-2 py-0.5 h-5 flex items-center">
                                                    <span className="text-xs font-light  text-red-83">In-Complete</span>
                                                </div>
                                            )} */}
                      </div>
                      <p className="text-gray-ae font-lexend text-sm font-light">
                        Documents uploaded via eligibility
                      </p>
                    </div>

                    <div className="bg-gray-32 rounded-md flex-1 p-8 flex flex-col gap-12">
                      <div className="bg-gray-32 rounded-xl flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-6 px-6">
                          {/* {supportingDocs &&
                            Array.isArray(supportingDocs.data) && (
                              <div className="mt-6">
                                <h4 className="text-white text-lg font-semibold mb-2">
                                  All Supporting Documents:
                                </h4>
                                <ul className="list-disc list-inside text-gray-ae">
                                  {supportingDocs.data.map((doc, index) => (
                                    <li key={index}>
                                      {doc.name
                                        ? doc.name
                                        : JSON.stringify(doc)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )} */}
                          <CompanyFileList
                            uploadedFiles={filterFilesByText(
                              getSupportingFiles(supportingDocs),
                              "docTitle",
                              [
                                "Certificate_of_Incorporation",
                                "GST_Registration_Certificate",
                              ]
                            )}
                            // uploadedFiles={supportingDocs.data}
                            onFileUpload={handleFileUpload}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "personal-info" && (
              <div className="text-center py-12">
                <p className="text-gray-ae">
                  Personal Info content will be implemented here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyProfile;
