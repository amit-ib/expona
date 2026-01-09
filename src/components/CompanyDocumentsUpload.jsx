import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CompanyFileList from "./CompanyFileList";
import { truncateString } from "../utils";

const CompanyDocumentsUpload = ({
  uploadedFiles = [],
  onFileUpload,
  style,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0 && onFileUpload) {
        onFileUpload(acceptedFiles[0], "add");
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        {/* Drag & Drop Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed border-gray-4f rounded-lg p-11 text-center transition-shadow hover:shadow-lg ${
            isDragActive ? "border-white" : ""
          } ${style === "compact" ? "px-11 py-3" : ""}`}
          tabIndex={0}
          aria-label="Upload file"
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-3">
            {style !== "compact" ? (
              <div className="w-12 h-12 bg-ib-red rounded-full flex items-center justify-center">
                <img
                  src="/images/upload-figma-icon.svg"
                  className="h-6"
                  alt="upload-icon"
                />
              </div>
            ) : (
              <img
                src="/images/upload-icon.svg"
                className="h-6"
                alt="upload-icon"
              />
            )}
            <div>
              <div className="text-white text-sm font-medium mb-1">
                {isDragActive ? (
                  <>Drop the files here ...</>
                ) : style === "compact" ? (
                  <>Upload</>
                ) : (
                  <>
                    Drag & drop files here{" "}
                    <span className="text-gray-ae">or</span>{" "}
                    <span className="underline cursor-pointer">click here</span>
                  </>
                )}
              </div>
              {style !== "compact" && (
                <p className="text-gray-ae text-xs">
                  PDF, DOCX (Max file size 20 mb)
                </p>
              )}
            </div>
          </div>
          {style === "compact" && (
            <div>
              <span className="text-xs font-light text-gray-ae ">
                PDF, DOCX (Max file size 20 mb)
              </span>
            </div>
          )}
          {/* Show file name below the icon and upload text if a file is uploaded */}
          {uploadedFiles && uploadedFiles.length > 0 && (
            <div className="text-white text-xs mt-2 w-full flex">
              {truncateString(uploadedFiles[0].name, 35)}
              <img
                src="/images/close-red.svg"
                className="inline-block h-4 ml-2 cursor-pointer"
                alt="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileUpload(uploadedFiles[0], "remove");
                }}
              />
            </div>
          )}
        </div>
        {/* Uploaded Files List */}
        {style !== "compact" &&
          uploadedFiles.length > 0 &&
          uploadedFiles.map((file, idx) => (
            <CompanyFileList
              key={file.name || idx}
              uploadedFiles={uploadedFiles}
              onFileUpload={onFileUpload}
            />
          ))}
      </div>
    </>
  );
};

export default CompanyDocumentsUpload;
