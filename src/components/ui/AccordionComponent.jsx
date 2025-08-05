import React, { useState } from "react";
import CompanyDocumentsUpload from "../CompanyDocumentsUpload";
import { fetchReviseEligibility, fetchEligibility } from "../../api/apiHelper";
import SkeletonLoader from "../ui/SkeletonLoader .jsx";

const AccordionComponent = ({
  title,
  requirement,
  justification,
  suggestion,
  importance,
  actionType,
  actionDescription,
  isOpen,
  onToggle,
  statusColorClass,
  iconColorClass = "text-white",
  filename,
  onEligibilityUpdate,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [fileError, setFileError] = useState(false);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleFileUpload = (file, action) => {
    if (action === "add") {
      setUploadedFiles((prev) => [...prev, file]);
    } else if (action === "remove") {
      setUploadedFiles((prev) => prev.filter((f) => f.name !== file.name));
    }
  };

  const handleReEvaluateEligibility = async () => {
    setFileError(false);
    const company_id = localStorage.getItem("company_id");
    const tender_id = localStorage.getItem("TENDER_ID");
    const criteria_name = title;
    const criteria_type = actionType;
    let payload = {
      company_id,
      tender_id,
      criteria_name,
      criteria_type,
      actionDescription,
    };

    if (actionType === "file_upload") {
      const file = uploadedFiles[0];
      if (!file) {
        console.error("No file uploaded");
        return;
      }
      payload.file = file;
    } else if (actionType === "yes_or_no") {
      if (!selectedOption) {
        console.error("No option selected");
        return;
      }
      payload.selectedOption = selectedOption;
    }

    try {
      setEligibilityLoading(true);
      const result = await fetchReviseEligibility(payload);
      setEligibilityLoading(false);
      if (actionType === "file_upload" && result?.data?.success === false) {
        setFileError(true);
      } else {
        setFileError(false);
      }
      if (onEligibilityUpdate) {
        onEligibilityUpdate(result);
      }
    } catch (err) {
      console.error("Error re-evaluating eligibility:", err);
      setEligibilityLoading(false);
    }
  };

  return (
    <div className=" rounded-lg overflow-hidden">
      <button
        className={`w-full flex justify-between items-center px-5 py-4 text-left text-white font-medium transition-all duration-500 hover:bg-gray-2d transition-colors focus:outline-none focus:bg-gray-2d  ${
          isOpen ? "bg-gray-2d" : ""
        }`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-sm">{title}</span>
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 transform transition-transform ${iconColorClass} ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        // eligibilityLoading ? (
        //     <div className="px-6 py-6 border-t border-gray-4f pt-3 bg-gray-2d">
        //         <SkeletonLoader />
        //     </div>
        // ) : (
        <div className="px-6 py-6 border-t border-gray-4f pt-3 bg-gray-2d">
          <div className="pt-3">
            {requirement && (
              <>
                <div className="text-xs text-gray-ae mb-1">Requirement</div>
                <div className="text-gray-ec text-sm">{requirement}</div>
              </>
            )}
            {justification && (
              <>
                <div className="text-xs text-gray-ae mt-7 mb-1">
                  Justification
                </div>
                <div className="text-gray-ec text-sm">{justification}</div>
              </>
            )}
            {importance && (
              <>
                <div className="text-xs text-gray-ae mt-7 mb-1">Importance</div>
                <div className="text-gray-ec  text-sm">{importance}</div>
              </>
            )}
            {suggestion && (
              <>
                <div className="text-xs text-gray-ae mt-7 mb-1">suggestion</div>
                <div className="text-gray-ec text-sm">{suggestion}</div>
              </>
            )}
            {actionType && (
              <>
                {actionDescription && (
                  <div className="text-xs text-gray-ae mt-7">
                    {actionDescription}
                  </div>
                )}

                {/* If action type = "file_upload" */}
                {actionType === "file_upload" && (
                  <div className="flex gap-4 mt-2 ">
                    <CompanyDocumentsUpload
                      style="compact"
                      uploadedFiles={uploadedFiles}
                      onFileUpload={handleFileUpload}
                    />
                  </div>
                )}
                {/* If action type = "yes_or_no" */}
                {actionType === "yes_or_no" && (
                  <div className="flex gap-4 mt-2 ">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-expona-red h-4 w-4"
                        name="accordion-question"
                        value="yes"
                        checked={selectedOption === "yes"}
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
                        checked={selectedOption === "no"}
                        onChange={handleRadioChange}
                      />
                      <span className="ml-2 text-gray-ec text-sm">No</span>
                    </label>
                  </div>
                )}
                {/* File related Error Message */}
                {fileError && (
                  <div className="text-sm text-red-600 mt-4 text-center">
                    File uploaded is not able to fulfill the requirements.
                  </div>
                )}
                {(selectedOption === "yes" || uploadedFiles.length > 0) && (
                  <>
                    <div className="text-xs text-gray-ae mt-8">
                      Note: These information will be saved in the company
                      profile for future use.
                    </div>
                    <button
                      className="bg-expona-red rounded-md mt-2 p-2 text-white w-full disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={handleReEvaluateEligibility}
                      disabled={eligibilityLoading}
                    >
                      {eligibilityLoading
                        ? "Re-evaluating..."
                        : "Re-evaluate Eligibility"}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        // )
      )}
    </div>
  );
};

export default AccordionComponent;
