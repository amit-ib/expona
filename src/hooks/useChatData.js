import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  uploadTenderFile,
  fetchTenderSummary,
  fetchTenderReport,
  fetchEligibility,
  fetchTenderList,
} from "../api/apiHelper";
import { useAuth } from "../contexts/AuthContext";

export const useChatData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [showSavedNote, setShowSavedNote] = useState(false);
  const [sources, setSources] = useState([]);
  const [activeHash, setActiveHash] = useState(location.hash);
  const [saved, setSaved] = useState(false);
  const [isTourVisible, setIsTourVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState("");
  const [hasFinalSummary, setHasFinalSummary] = useState(false);
  const finalSummaryFlag = useRef(false);
  const [storedSummary, setStoredSummary] = useState("");
  const [isNewTender, setIsNewTender] = useState(false);
  const [isReevaluate, setIsReevaluate] = useState(false);
  const hasUploaded = useRef(false);
  const [report, setReport] = useState(() => {
    const saved = localStorage.getItem("tenderReport");
    return saved ? JSON.parse(saved) : null;
  });
  const lastReportKey = useRef(null);
  function getInitialTenderTitle(location) {
    const titleFromLocation = location?.state?.title;
    if (typeof titleFromLocation === "string" && titleFromLocation.trim()) {
      return titleFromLocation.trim();
    }

    const titleFromStorage = localStorage.getItem("tenderTitle");
    if (typeof titleFromStorage === "string" && titleFromStorage.trim()) {
      return titleFromStorage.trim();
    }

    return "Untitled Tender";
  }
  const [tenderTitle, setTenderTitle] = useState(() =>
    getInitialTenderTitle(location)
  );
  const [eligibilityData, setEligibilityData] = useState(null);
  const [isTenderListLoading, setIsTenderListLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(null);
  const [storeTenderID, setStoreTenderID] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const filesToUpload = location.state?.fileToUpload;

    if (filesToUpload) {
      if (hasUploaded.current) return;
      hasUploaded.current = true;
      finalSummaryFlag.current = false;
      setHasFinalSummary(false);
      setReport("");
      if (!localStorage.getItem("tenderTitle")) {
        setTenderTitle("Untitled Tender");
      } else {
        setTenderTitle(localStorage.getItem("tenderTitle"));
      }

      const doUpload = async () => {
        setIsUploading(true);
        setUploadResponse("");
        try {
          // Support both single file and array of files
          await uploadTenderFile(filesToUpload, (chunk) => {
            setUploadResponse((prev) => {
              const summaryMarker = "<---FINAL_SUMMARY--->";
              const analyzingMarker = "<---ANALYZE_PDF--->";
              let newContent = prev + chunk;

              try {
                const parsed = JSON.parse(newContent);
                if (parsed.detail && parsed.detail.error === "Database Error") {
                  setShowErrorModal({
                    heading: "Oops! Not allowed",
                    message:
                      parsed.detail.message ||
                      "An error occurred while processing your request.",
                  });
                  return "";
                }
              } catch (e) {
                // Not JSON, continue processing
              }

              newContent = newContent.split(analyzingMarker).join("");

              const markerIndex = newContent.indexOf(summaryMarker);
              if (markerIndex !== -1) {
                finalSummaryFlag.current = true;
                setHasFinalSummary(true);

                return newContent.substring(markerIndex + summaryMarker.length);
              } else {
                // console.log("Summary-ELSE", newContent);
                /* const metaMarker = "<---METADATA--->";
                const metaIndex = newContent.indexOf(metaMarker);
                console.log("META INDEX", metaIndex);
                if (metaIndex !== -1) {
                  console.log("Summary-ELSE", newContent);
                  const afterMeta = newContent.substring(
                    metaIndex + metaMarker.length
                  );
                  console.log("AFTER META", afterMeta);
                  // Split the content by <br> to get individual parts
                  const parts = afterMeta.split("<br>");

                  // Extract tender title (second part, index 1) if available
                  const title =
                    parts.length > 1 ? parts[1].trim() : parts[0].trim();
                  localStorage.setItem("tenderTitle", title);
                  setTenderTitle(title);
                  console.log("PARTS Length", parts.length);
                  console.log("PARTS", parts);
                  // Extract tender ID (third part, index 2) if available
                  if (parts.length > 2) {
                    const tenderId = parts[2].trim();
                    console.log("TENDER ID", tenderId);
                    localStorage.setItem("tenderId", tenderId);
                    setStoreTenderID(tenderId);
                    console.log("TENDER ID", tenderId);
                    // console.log(
                    //   "TENDER Title",
                    //   localStorage.getItem("tenderTitle")
                    // );
                  }

                  // Remove the metadata marker and everything before it from newContent
                  newContent = afterMeta;
                }
                return newContent; */
                // console.log("Summary-ELSE", newContent);

                const metaMarker = "<---METADATA--->";
                const metaIndex = newContent.indexOf(metaMarker);

                // Fallback: if marker is not found, use full content
                let afterMeta = "";
                if (metaIndex !== -1) {
                  afterMeta = newContent.substring(
                    metaIndex + metaMarker.length
                  );
                } else {
                  console.log(
                    "Metadata marker not found, using entire content as fallback."
                  );
                  afterMeta = newContent;
                }

                // Split the content by <br> to get individual parts
                const parts = afterMeta.split("<br>");

                // Extract tender title (second part, index 1) if available

                const title = parts.length > 1 && parts[0].trim();
                localStorage.setItem("tenderTitle", title);
                // setTenderTitle(title);
                console.log("PARTS:", parts);
                // Extract tender ID (third part, index 2) if available
                // Wait for up to 2 seconds for parts[2] to be available and parts.length > 2
                const getTenderIdWithDelay = async () => {
                  let attempts = 0;
                  let tenderId = undefined;
                  while (
                    (parts.length <= 2 || !(tenderId = parts[2]?.trim())) &&
                    attempts < 20
                  ) {
                    await new Promise((res) => setTimeout(res, 100));
                  }
                  if (parts.length > 2 && tenderId) {
                    localStorage.setItem("tenderId", tenderId);
                    setStoreTenderID(tenderId);
                  }
                };
                getTenderIdWithDelay();

                // Remove the metaMarker and afterMeta from newContent if metaMarker exists
                if (metaIndex !== -1) {
                  newContent = newContent.slice(0, metaIndex);
                }
                return newContent;
              }
            });
          });
          //--------------------- GET TENDER REPORT FOR NEW FILE UPLOAD -------------------------
          try {
            // Wait for tenderId to be available in localStorage (max 2s)
            let tenderId = localStorage.getItem("tenderId") || storeTenderID;
            let attempts = 0;
            while (!tenderId && attempts < 20) {
              await new Promise((res) => setTimeout(res, 100));
              tenderId = localStorage.getItem("tenderId") || storeTenderID;
              attempts++;
            }
            console.log("TENDER ID FOR REPORT:", tenderId);
            if (tenderId) {
              // console.log(
              //   "storeTenderID",
              //   storeTenderID,
              //   "AND",
              //   localStorage.getItem("tenderId")
              // );
              const companyId = localStorage.getItem("company_id");
              const fetchedReport = await fetchTenderReport({
                tender_id: tenderId,
                company_id: companyId,
                reevaluate: isReevaluate,
              });
              setIsReevaluate(false);
              setIsUploading(false);
              setReport(fetchedReport);
              localStorage.setItem(
                "tenderReport",
                JSON.stringify(fetchedReport)
              );
              setTenderTitle(fetchedReport?.data?.title || tenderTitle);
              if (fetchedReport && fetchedReport.data.tender_id) {
                localStorage.setItem("tenderId", fetchedReport.data.tender_id);
              }
              try {
                setIsTenderListLoading(true);
                const tenderListResponse = await fetchTenderList({});
                if (tenderListResponse && tenderListResponse.data) {
                  localStorage.setItem(
                    "tenderList",
                    JSON.stringify(tenderListResponse.data)
                  );
                }
              } catch (err) {
                console.error("Failed to fetch tender list:", err);
              } finally {
                setIsTenderListLoading(false);
              }
            } else {
              console.error(
                "Tender ID not found after upload. Report fetch skipped."
              );
            }
          } catch (err) {
            console.error("fetchTenderReport error:", err);
          }
        } catch (error) {
          console.error("Tender upload error:", error);
          setUploadResponse("Upload failed");
        } finally {
          setIsUploading(false);
          const companyId = localStorage.getItem("company_id");
          const tenderId = localStorage.getItem("tenderId") || storeTenderID;
          setTimeout(async () => {
            try {
              const data = await fetchTenderSummary();
              if (Array.isArray(data.data) && data.data.length > 0) {
                const lastSummary = data.data[data.data.length - 1].summary;
                if (lastSummary) {
                  setUploadResponse(lastSummary);
                }
              }
              if (filesToUpload && companyId && tenderId) {
                const eligibility = await fetchEligibility({
                  tender_id: tenderId,
                  company_id: companyId,
                  reevaluate: isReevaluate,
                });
                setEligibilityData(eligibility);
                setIsReevaluate(false);
              }
            } catch (err) {
              console.error(
                "fetchTenderSummary or fetchEligibility error:",
                err
              );
            }
          }, 1000);
        }
      };
      doUpload();
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, fileToUpload: null },
      });
      hasUploaded.current = false;
    }
  }, [location, navigate]);

  useEffect(() => {
    setActiveHash(location.hash);
  }, [location.hash]);

  useEffect(() => {
    const tourSeen = localStorage.getItem("exponaTourSeen");
    if (!tourSeen) {
      setIsTourVisible(true);
    }
  }, []);

  // ###### ========== FETCH TENDER SUMMARY/REPORT/Eligibility FOR OLD TENDERS ========== ######
  useEffect(() => {
    const tenderId = location.state?.id;
    const tenderFile = location.state?.filename;
    console.log("LOCATION", tenderId);
    if (tenderId) {
      // const fetchSummary = async () => {
      //   try {
      //     const response = await fetchTenderSummary();
      //     const summaryObj = response.data.find((item) => item.id === tenderId);
      //     if (summaryObj) {
      //       setStoredSummary(summaryObj.summary);
      //     } else {
      //       setStoredSummary("");
      //     }
      //   } catch (err) {
      //     setStoredSummary("");
      //   }
      // };
      // fetchSummary();

      const reportKey = `${tenderId}_${tenderFile}`;
      if (lastReportKey.current === reportKey) return;
      lastReportKey.current = reportKey;

      const fetchReportThenEligibility = async () => {
        try {
          const companyId = localStorage.getItem("company_id");
          // const filename = tenderFile;
          if (tenderId && companyId) {
            const fetchedReport = await fetchTenderReport({
              tender_id: tenderId,
              company_id: companyId,
            });
            setReport(fetchedReport);
            localStorage.setItem("tenderReport", JSON.stringify(fetchedReport));

            setTimeout(() => {
              fetchEligibility({ tender_id: tenderId, company_id: companyId })
                .then((eligibilityData) => {
                  setEligibilityData(eligibilityData);
                })
                .catch((eligErr) => {
                  console.error("fetchEligibility error:", eligErr);
                });
            }, 1000);
          }
        } catch (err) {
          console.error("fetchTenderReport error (from fetchReport):", err);
        }
      };
      fetchReportThenEligibility();
    }
  }, [location.state, user]);

  return {
    message,
    setMessage,
    rightSidebarCollapsed,
    setRightSidebarCollapsed,
    leftSidebarCollapsed,
    setLeftSidebarCollapsed,
    showSavedNote,
    setShowSavedNote,
    sources,
    setSources,
    activeHash,
    saved,
    setSaved,
    isTourVisible,
    setIsTourVisible,
    isDrawerOpen,
    setIsDrawerOpen,
    isModalOpen,
    setIsModalOpen,
    isLoading,
    isUploading,
    uploadResponse,
    hasFinalSummary,
    storedSummary,
    setStoredSummary,
    report,
    tenderTitle,
    eligibilityData,
    isTenderListLoading,
    showErrorModal,
    setShowErrorModal,
    openModal,
    closeModal,
    isNewTender,
    setIsNewTender,
    isReevaluate,
    setIsReevaluate,
  };
};
