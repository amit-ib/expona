import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [qnaResponse, setQnaResponse] = useState(null);

  return (
    <ChatContext.Provider value={{ qnaResponse, setQnaResponse }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
