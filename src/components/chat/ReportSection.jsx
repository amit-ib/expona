import React, { useState } from "react";
import Markdown from "react-markdown";
import { copyToClipboard } from "../../utils.js";

const ReportSection = ({
  report,
  markdownComponents,
  headers,
  dataRows,
  exportPopup,
  handleExportClick,
  exportPopupRef,
  closeExportPopup,
  chatContent,
  handleCitationClick,
}) => {
  const [copied, setCopied] = useState(false);
  if (!report || !report.data) return null;
  const { Summary, Timeline, Todos, Checklist, Eligibility } =
    report.data || {};

  // Utility to handle copy for different sections
  const handleCopyClick = (content) => {
    copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="">
      {Summary && (
        <Markdown components={markdownComponents}>{Summary}</Markdown>
      )}
      {Timeline && Timeline.trim() !== "" && (
        // <div className="mb-4">
        //     <h3 className="font-semibold mb-1">Timeline</h3>
        //     {/* Table rendering if headers/dataRows available */}
        //     {headers && headers.length > 0 && (
        //         <div className="rw-full mb-8 mt-0 border border-gray-42 rounded-md  boder-gray-5c">
        //             <table className="w-full border-collapse mb-2">
        //                 <thead>
        //                     <tr>
        //                         {headers.map((header, idx) => (
        //                             <th key={idx} className="border px-2 py-1 text-left">{header}</th>
        //                         ))}
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {dataRows.map((row, rowIdx) => (
        //                         <tr key={rowIdx}>
        //                             {row.map((cell, cellIdx) => (
        //                                 <td key={cellIdx} className="border px-2 py-1">{cell}</td>
        //                             ))}
        //                         </tr>
        //                     ))}
        //                 </tbody>
        //             </table>
        //         </div>
        //     )}
        //     {/* Fallback to Markdown if no table */}
        //     {(!headers || headers.length === 0) && (
        //         <Markdown components={markdownComponents}>{Timeline}</Markdown>
        //     )}
        // </div>
        <>
          <div className="group" id="datetime">
            <div className="flex mb-6 mt-6 items-center relative">
              <strong className="block py-2">
                Important Dates & Timelines
              </strong>
              <div
                className={`ml-3 flex space-x-3 group-hover:block ${
                  exportPopup.visible ? "" : "hidden group-hover:block"
                }`}
              >
                <button
                  className="p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f"
                  onClick={() => handleCopyClick(Timeline)}
                >
                  <img
                    className="w-4 h-4"
                    src={
                      copied
                        ? "/images/right-icon.svg"
                        : "/images/copy-icon.svg"
                    }
                    alt={copied ? "Copied" : "Copy"}
                  />
                </button>
                <button
                  onClick={handleExportClick}
                  className="p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f"
                >
                  <img
                    src="/images/export-icon.svg"
                    alt="Export"
                    title="Export"
                  />
                </button>
              </div>
              {/* Export Popup */}
              {exportPopup.visible && (
                <div
                  ref={exportPopupRef}
                  className="absolute z-50 bg-gray-2d rounded shadow-lg p-2"
                  style={{ top: 40, left: 290 }}
                >
                  <button
                    className="block w-full text-left py-2 px-4 hover:bg-gray-24 rounded-lg text-xs"
                    onClick={() => {
                      /* Export as CSV logic here */ closeExportPopup();
                    }}
                  >
                    Export as CSV
                  </button>
                  <button
                    className="block w-full text-left py-2 pl-4 pr-8 hover:bg-gray-24 rounded-lg text-xs"
                    onClick={() => {
                      /* Export as Image logic here */ closeExportPopup();
                    }}
                  >
                    Export as Image
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="rw-full mb-8 mt-0 border border-gray-42 rounded-md  boder-gray-5c">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-b-gray-42 bg-gray-2d">
                    {headers.map((header, idx) => (
                      <th
                        key={idx}
                        className={`py-3.5 px-3 text-left ${
                          idx === 0
                            ? "rounded-tl-md border-r border-gray-5c"
                            : "rounded-tr-md"
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((cols, i) => (
                    <tr
                      key={i}
                      className={`text-sm ${
                        i !== dataRows.length - 1
                          ? "border-b border-b-gray-5c"
                          : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 relative border-r border-gray-5c rounded">
                        {cols[0]}
                      </td>
                      <td className="py-2.5 px-3 relative rounded">
                        {cols[1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="w-full border-collapse  hidden">
                <thead>
                  <tr className="border-b border-b-gray-42 bg-gray-2d ">
                    <th className="py-3.5 px-3 text-left  rounded-tl-md border-r border-gray-5c">
                      Timeline
                    </th>
                    <th className="py-3.5 px-3 text-left  rounded-tr-md">
                      Important Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chatContent.tableData.map((row, index) => (
                    <tr
                      key={index}
                      className={`text-sm ${
                        index !== chatContent.tableData.length - 1
                          ? "border-b border-b-gray-5c"
                          : ""
                      }  `}
                    >
                      <td className="py-2.5 px-3  relative border-r border-gray-5c rounded">
                        {row.feature}
                      </td>
                      <td className="py-2.5 px-3  relative  rounded">
                        {row.value}
                        {row.citation && (
                          <span
                            className="px-2 py-1 bg-gray-4f text-xs rounded-full w-6 h-6 ml-2 cursor-pointer"
                            onClick={(event) =>
                              handleCitationClick(
                                event,
                                row.citation,
                                index,
                                event.clientX,
                                event.clientY
                              )
                            }
                          >
                            {row.citation}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Show Markdown for Timeline */}
            {/* {report && report.data && report.data.Timeline && (
                      <Markdown components={markdownComponents}>{report.data.Timeline}</Markdown>
                    )} */}
          </div>
          {/* Separator */}
          <div className="w-full h-px bg-gray-42 my-5"></div>
        </>
      )}
      {Todos && Todos.trim() !== "" && (
        <>
          <div id="todo" className="group">
            <div className="flex mb-4 mt-6 items-center">
              <strong className="py-2">List of To-Do's</strong>
              <div className="hidden ml-3 group-hover:inline-block flex space-x-3">
                <button
                  className="p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f"
                  onClick={() => handleCopyClick(Todos)}
                >
                  <img
                    className="w-4 h-4"
                    src={
                      copied
                        ? "/images/right-icon.svg"
                        : "/images/copy-icon.svg"
                    }
                    alt={copied ? "Copied" : "Copy"}
                  />
                </button>
              </div>
            </div>
            <div className="text-sm font-light">
              {report?.data?.Todos && (
                <Markdown components={markdownComponents}>{Todos}</Markdown>
              )}
            </div>
          </div>
          {/* Separator */}
          <div className="w-full h-px bg-gray-42 mt-8 mb-4"></div>
        </>
      )}
      {Checklist && Checklist.trim() !== "" && (
        <>
          <div className="mb-8 relative group" id="presubmisssion">
            <div className="flex mb-4 mt-6 items-center">
              <strong className="py-2"> Pre-submission Checklist</strong>
              <div className="hidden ml-3 group-hover:inline-block flex space-x-3">
                <button
                  className="p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f"
                  onClick={() => handleCopyClick(Checklist)}
                >
                  <img
                    className="w-4 h-4"
                    src={
                      copied
                        ? "/images/right-icon.svg"
                        : "/images/copy-icon.svg"
                    }
                    alt={copied ? "Copied" : "Copy"}
                  />
                </button>
              </div>
            </div>
            <div className="text-sm font-light">
              {report?.data?.Checklist && (
                <Markdown components={markdownComponents}>{Checklist}</Markdown>
              )}
            </div>
          </div>
          {/* Separator */}
          <div className="w-full h-px bg-gray-42 mt-8 mb-4"></div>
        </>
      )}
      {Eligibility && Eligibility.trim() !== "" && (
        <>
          <div className="mb-8 relative group" id="eval">
            <div className="flex mb-4 mt-6 items-center">
              <strong className="py-2"> Evaluation Criteria</strong>
              <div className="hidden ml-3 group-hover:inline-block flex space-x-3">
                <button
                  className="p-2 rounded-lg border border-gray-24 hover:border-gray-5c hover:bg-gray-4f"
                  onClick={() => handleCopyClick(Eligibility)}
                >
                  <img
                    className="w-4 h-4"
                    src={
                      copied
                        ? "/images/right-icon.svg"
                        : "/images/copy-icon.svg"
                    }
                    alt={copied ? "Copied" : "Copy"}
                  />
                </button>
              </div>
            </div>
            <div className="text-sm font-light">
              {report?.data?.Eligibility && (
                <Markdown components={markdownComponents}>
                  {Eligibility}
                </Markdown>
              )}
            </div>
          </div>
          {/* Separator */}
          <div className="w-full h-px bg-gray-42 my-4"></div>
        </>
      )}
    </div>
  );
};

export default ReportSection;
