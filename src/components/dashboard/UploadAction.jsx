import React from "react";
import { useNavigate } from "react-router-dom";

const UploadAction = ({ projectsVisibility, fullHeight, onFileSelect }) => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    // navigate("/chat");
  };

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      // You might want to do something with the selected file here
      // before navigating, but for now, we'll just navigate.
      navigate("/chat");
      if (onFileSelect) {
        onFileSelect();
      }
    }
  };

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
        className={`w-full flex-1 bg-gray-32 border  border-dashed border-gray-ae rounded-lg flex flex-col items-center justify-center py-10 px-6  transition-shadow hover:shadow-lg  ${projectsVisibility ? '' : 'max-h-[calc(100vh-280px)]'}  `}
        // onClick={handleUploadClick}
        tabIndex={0}

        aria-label="Upload file"
      >
        <span className="inline-block pt-2.5 pb-0 px-3.5 bg-ib-red hover:bg-ib-red-dark rounded-full  transition-all duration-500 "><img
          src="/images/upload-figma-icon.svg"
          alt="Upload"
          width="25"
          height="32"
          className="mb-3"
        /></span>
        <div className="text-center mt-4">
          <div className="font-light mb-2 relative">
            Drag & drop files here <span className="text-gray-ae inline-block mx-1">or</span> <span className="underline cursor-pointer">Choose File</span><span className="cursor-pointer"><input type="file" className="absolute -top-6 left-52 opacity-0 w-20 cursor-pointer h-16" onChange={handleFileSelect} /></span>
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