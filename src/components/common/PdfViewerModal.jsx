import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// Update the worker import
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewerModal = ({ isOpen, onClose, fileUrl }) => {
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Reset page number when modal opens or file changes
        if (isOpen) {
            setCurrentPage(1);
        }
    }, [isOpen, fileUrl]);

    if (!isOpen) return null;

    // Extract file name from URL
    const fileName = fileUrl ? fileUrl.split('/').pop() : 'Document';

    const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
    };

    const handlePageInputChange = (event) => {
        const pageNumber = Number(event.target.value);
        if (pageNumber > 0 && pageNumber <= numPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setCurrentPage(1); // Reset to page 1 on new document load
    };

    return (
        <div style={styles.overlay}>
            {/* File name display */}
            <div style={styles.fileNameDisplay}>{fileName}</div>

            {/* Close button */}

            <button onClick={onClose} className="fixed top-5 right-5 bg-gray-32 color-white rounded py-1 px-2 cursor-pointer font-bold">✕</button>

            {/* Modal content */}

            <div className="flex flex-col relative h-[calc(100vh-80px)] bg-white py-3 rounded max-w-[700px] w-11/12 ">
                <div className="overflow-auto flex-1 mb-0">
                    <Document
                        file={fileUrl}
                        onLoadSuccess={handleLoadSuccess}
                        loading="Loading PDF..."
                    >
                        <Page
                            key={`page_${currentPage}`}
                            pageNumber={currentPage}
                            scale={scale}
                        />
                    </Document>
                </div>

                <div className="text-xs font-light w-72 mx-auto flex justify-between items-center bg-gray-24 px-4 py-2 rounded-full ">
                    <div className="flex items-center gap-1">
                        <span >Page</span>
                        <button onClick={goToPreviousPage} disabled={currentPage <= 1} className="py-1  px-2 bg-gray-32 rounded-lg hover:bg-gray-42">&lt;</button>
                        <input
                            type="number"
                            value={currentPage}
                            onChange={handlePageInputChange}
                            className="bg-gray-32 text-center py-1"

                            min="1"
                            max={numPages || 1}
                        />
                        <button onClick={goToNextPage} disabled={currentPage >= numPages} className="py-1 px-2 bg-gray-32 rounded-lg hover:bg-gray-42">&gt;</button>
                        <span>/ {numPages || '-'}</span>
                    </div>

                    <div className="flex items-center gap-2" >
                        <button onClick={zoomOut}>−</button>
                        <img src="/images/zoom.svg" alt="Zoom" width={18} />
                        <button onClick={zoomIn}>＋</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    fileNameDisplay: {
        position: "fixed", // Fixed position
        top: 20, // Adjusted position
        left: 20, // Adjusted position
        color: "#fff", // White text color
        fontSize: "16px",
        fontWeight: "bold",
        zIndex: 1002, // Higher z-index
        // Adding some basic text overflow handling
        maxWidth: "calc(100% - 100px)", // Leave space for close button
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    pdfContainer: {
        flex: 1,
        overflow: "auto",
        // Removed background-color and padding
        borderRadius: "4px",
        marginBottom: "0",
    },
};

export default PdfViewerModal;
