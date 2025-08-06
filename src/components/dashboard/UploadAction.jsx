import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const UploadAction = ({
  projectsVisibility,
  fullHeight,
  onFileSelect,
  isNewTender,
  setIsNewTender,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  // console.log("UPLOAD IS NEW TENDER:", isNewTender);
  const onDrop = useCallback(
    (acceptedFiles) => {
      setError("");
      // Only clear items if isNewTender is true
      if (isNewTender) {
        localStorage.removeItem("TENDER_REPORT");
        localStorage.removeItem("TENDER_TITLE");
        localStorage.removeItem("TENDER_ID");
        console.log("Cleared local storage for new tender upload-1");
        setIsNewTender(false);
      }
      if (acceptedFiles.length > 0) {
        // Pass all files for multi-upload
        navigate("/chat", { state: { fileToUpload: acceptedFiles } });
        if (onFileSelect) {
          onFileSelect();
        }
      }
    },
    [navigate, onFileSelect, isNewTender]
  );

  const onDropRejected = (fileRejections) => {
    if (fileRejections.length > 0) {
      const firstError = fileRejections[0].errors[0];
      if (firstError.code === "file-invalid-type") {
        setError("Invalid file type. Please upload a PDF or DOCX file.");
      } else if (firstError.code === "file-too-large") {
        setError("File is too large. Maximum size is 20MB.");
      } else if (firstError.code === "too-many-files") {
        setError("You can only upload a maximum of 3 files at a time.");
      } else {
        setError(firstError.message);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 20971520, // 20MB in bytes
    maxFiles: 3,
  });

  return (
    <div
      className={`flex   ${
        projectsVisibility ? "w-[480px]" : "flex-col w-8/12 mx-auto"
      } ${fullHeight ? "h-full w-full" : ""}`}
    >
      {!projectsVisibility && (
        <div className="flex flex-col items-center gap-3 text-center w-full mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Upload tender files. I'll do the rest.
          </h1>
          <p className="text-sm font-light text-white opacity-80">
            Get a quick summary, checklist, and answers to your questions
          </p>
        </div>
      )}
      <div
        {...getRootProps()}
        className={`w-full flex-1 min-h-48 bg-gray-32 border  border-dashed border-gray-ae rounded-lg flex flex-col items-center justify-center py-10 px-6  transition-shadow hover:shadow-lg  ${
          projectsVisibility ? "" : "max-h-[calc(100vh-280px)]"
        } ${isDragActive ? "border-ib-red" : ""}  `}
        tabIndex={0}
        aria-label="Upload file"
      >
        <input {...getInputProps()} />
        <span className="inline-block pt-2.5 pb-0 px-3.5 bg-ib-red hover:bg-ib-red-dark rounded-full  transition-all duration-500 ">
          <img
            src="/images/upload-figma-icon.svg"
            alt="Upload"
            width="25"
            height="32"
            className="mb-3"
          />
        </span>
        <div className="text-center mt-4">
          <div className="font-light mb-2 relative">
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>
                Drag & drop files here{" "}
                <span className="text-gray-ae inline-block mx-1">or</span>{" "}
                <span className="underline cursor-pointer">Choose Files</span>
              </p>
            )}
          </div>
          <div className="text-sm font-thin text-gray-ae">
            PDF, DOCX (Max file size 20 mb)
          </div>
          {error && (
            <div className="text-sm font-thin text-red-500 mt-2">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadAction;
