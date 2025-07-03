import React from 'react';

const CompanyFileList = ({ uploadedFiles = [], onFileUpload }) => {
    if (!uploadedFiles.length) return null;
    return (
        <>
            {uploadedFiles.map((file, idx) => (
                <div key={idx} className="border border-gray-4f rounded-lg p-4 flex items-center gap-3">
                    <img src="/images/file-icon.svg" className='h-6' alt="upload-icon" />
                    <div className="flex-1">
                        <h5 className="text-white font-medium text-sm">
                            {file.url ? (
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-expona-red">{file.name}</a>
                            ) : (
                                file.name
                            )}
                        </h5>
                        <p className="text-gray-ae text-xs">{file.date || ''}</p>
                    </div>
                    <button className="text-gray-ae hover:text-white transition-colors" onClick={() => onFileUpload && onFileUpload(file, 'remove')}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </>
    );
};

export default CompanyFileList; 