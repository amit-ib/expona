import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import CompanyFileList from './CompanyFileList';

const CompanyDocumentsUpload = ({ uploadedFiles = [], onFileUpload }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0 && onFileUpload) {
            onFileUpload(acceptedFiles[0], 'add');
        }
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Drag & Drop Upload Area */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed border-gray-4f rounded-lg p-11 flex items-center justify-center gap-4 text-center transition-shadow hover:shadow-lg ${isDragActive ? 'border-green-500' : ''}`}
                    tabIndex={0}
                    aria-label="Upload file"
                >
                    <input {...getInputProps()} />
                    <div className="w-12 h-12 bg-ib-red rounded-full flex items-center justify-center">
                        <img src="/images/upload-figma-icon.svg" className='h-6' alt="upload-icon" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium mb-1">
                            {isDragActive ? (
                                <>Drop the files here ...</>
                            ) : (
                                <>
                                    Drag & drop files here <span className="text-gray-ae">or</span> <span className="underline cursor-pointer">click here</span>
                                </>
                            )}
                        </p>
                        <p className="text-gray-ae text-xs">PDF, DOC, TXT (Max file size 20 mb)</p>
                    </div>
                </div>
                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && uploadedFiles.map((file, idx) => (
                    <CompanyFileList uploadedFiles={uploadedFiles} onFileUpload={onFileUpload} />
                ))}
            </div>
        </>
    );
};

export default CompanyDocumentsUpload; 