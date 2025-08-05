import { useState, useEffect } from "react";
import {
  fetchCompanyProfile,
  uploadCompanyDocument,
  fetchSupportingDocs,
  deleteSupportingDoc,
} from "../api/apiHelper";

/**
 * Custom hook to manage company profile data, supporting documents, and file uploads.
 */
export function useCompanyProfile() {
  // State for company profile data
  const [companyProfile, setCompanyProfile] = useState(null);
  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // State for uploaded files (local UI only)
  const [uploadedFiles, setUploadedFiles] = useState([]);
  // State for supporting documents fetched from API
  const [supportingDocs, setSupportingDocs] = useState(null);

  /**
   * Fetches the company profile from the API.
   */
  const loadCompanyProfile = async (companyId) => {
    setLoading(true);
    try {
      const data = await fetchCompanyProfile(companyId);
      setCompanyProfile(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch company profile");
      setCompanyProfile(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches supporting documents for the company from the API.
   */
  const fetchSupportingDocuments = async (companyId) => {
    try {
      const docs = await fetchSupportingDocs(companyId);
      //   console.log("Supporting Docs:", docs.data);
      setSupportingDocs(docs);
    } catch (err) {
      setSupportingDocs(null);
    }
  };

  /**
   * Handles file upload and removal for company documents.
   * Re-fetches profile and supporting docs after upload/remove.
   */
  const handleFileUpload = async (file, action, documentType) => {
    const company_id = localStorage.getItem("company_id");

    if (action === "add") {
      try {
        const tender_id = localStorage.getItem("TENDER_ID");
        await uploadCompanyDocument({
          file,
          company_id,
          tender_id,
          documentType,
        });
        setUploadedFiles((prev) => [
          // ...prev,
          { name: file.name, date: new Date().toLocaleDateString() },
        ]);
        await loadCompanyProfile(Number(company_id));
        await fetchSupportingDocuments(Number(company_id));
      } catch (err) {
        alert("Failed to upload document");
      }
    } else if (action === "remove") {
      try {
        // Attempt to delete supporting doc if file has an id or doc_id
        console.log("FID", file);
        if (file && file.docID) {
          // console.log("FID", file.docID)
          await deleteSupportingDoc({ company_id, document_id: file.docID });
        }
        setUploadedFiles((prev) => prev.filter((f) => f.name !== file.name));
        await loadCompanyProfile(Number(company_id));
        await fetchSupportingDocuments(Number(company_id));
      } catch (err) {
        alert("Failed to delete document");
      }
    }
  };

  // Initial load of company profile and supporting docs
  useEffect(() => {
    const companyId = localStorage.getItem("company_id");
    if (companyId) {
      loadCompanyProfile(Number(companyId));
      fetchSupportingDocuments(Number(companyId));
    }
  }, []);

  // Expose state and handlers for use in the component
  return {
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
  };
}
