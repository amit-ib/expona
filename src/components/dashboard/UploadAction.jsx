import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const UploadAction = ({ projectsVisibility, fullHeight, onFileSelect }) => {
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    localStorage.removeItem('tenderReport');
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      navigate("/chat", { state: { fileToUpload: file } });
      if (onFileSelect) {
        onFileSelect();
      }
    }
  }, [navigate, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className={`flex   ${projectsVisibility ? 'w-[480px]' : 'flex-col w-8/12 mx-auto'} ${fullHeight ? 'h-full w-full' : ''}`}
    >
      {!projectsVisibility && (
        <div className="flex flex-col items-center gap-3 text-center w-full mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Upload a tender file. I'll do the rest.
          </h1>
          <p className="text-sm font-light text-white opacity-80">
            Get a quick summary, checklist, and answers to your questions
          </p>
        </div>)}
      <div
        {...getRootProps()}
        className={`w-full flex-1 bg-gray-32 border  border-dashed border-gray-ae rounded-lg flex flex-col items-center justify-center py-10 px-6  transition-shadow hover:shadow-lg  ${projectsVisibility ? '' : 'max-h-[calc(100vh-280px)]'} ${isDragActive ? 'border-ib-red' : ''}  `}
        tabIndex={0}
        aria-label="Upload file"
      >
        <input {...getInputProps()} />
        <span className="inline-block pt-2.5 pb-0 px-3.5 bg-ib-red hover:bg-ib-red-dark rounded-full  transition-all duration-500 "><img
          src="/images/upload-figma-icon.svg"
          alt="Upload"
          width="25"
          height="32"
          className="mb-3"
        /></span>
        <div className="text-center mt-4">
          <div className="font-light mb-2 relative">
            {
              isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag & drop files here <span className="text-gray-ae inline-block mx-1">or</span> <span className="underline cursor-pointer">Choose File</span></p>
            }
          </div>
          <div className="text-sm font-thin text-gray-ae">
            PDF, DOC, TXT (Max file size 20 mb)
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAction; 