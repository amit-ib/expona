import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDuplicateFile, setIsDuplicateFile] = useState(false);
  const [isAllowNewTenderUpload, setIsAllowNewTenderUpload] = useState(false);
  const [showSavedNote, setShowSavedNote] = useState(false);

  return (
    <AppContext.Provider value={{ isDuplicateFile, setIsDuplicateFile, isAllowNewTenderUpload, setIsAllowNewTenderUpload, showSavedNote, setShowSavedNote }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
