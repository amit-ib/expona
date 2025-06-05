import React from 'react';

const SourcesSidebar = ({ sources }) => {
  return (
    <div className="w-[305px] bg-black/20 rounded-2xl mb-5">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/images/source-icon.svg" alt="Sources" width="20" height="20" />
          <h3 className="font-semibold">Sources</h3>
        </div>
      </div>
      
      <div className="p-4 flex flex-col h-[calc(100vh-180px)]">
        <h4 className="text-sm font-medium mb-4">Added files</h4>
        
        <div className="space-y-4 flex-grow">
          {sources.map((source, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <img src="/images/file-icon.svg" alt="File" width="20" height="20" />
                <div>
                  <p className="text-sm">{source.name}</p>
                  <p className="text-xs text-white/50">{source.date}</p>
                </div>
              </div>
              <button>
                <img src="/images/close-icon.svg" alt="Remove" width="16" height="16" />
              </button>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-auto py-3.5 flex items-center justify-center gap-2 border border-white/30 rounded hover:bg-white/5 transition-colors">
          <img src="/images/add-file-icon.svg" alt="Add file" width="20" height="20" />
          <span className="text-sm font-medium">Add file</span>
        </button>
      </div>
    </div>
  );
};

export default SourcesSidebar; 