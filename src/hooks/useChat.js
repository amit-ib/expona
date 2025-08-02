import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ChatConversation } from "../api/apiHelper";

export const useChat = (report, message, setMessage, setQnaResponse) => {
  const location = useLocation();
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = useCallback(
    async (query) => {
      if (!query.trim() || isSending) return;

      setIsSending(true);
      setMessage(""); // Clear input immediately for better UX

      try {
        const companyId = localStorage.getItem("company_id");
        const tenderId = localStorage.getItem("tenderId");

        if (!companyId || !tenderId) {
          console.error(
            "Missing required parameters for ChatConversation API",
            tenderId
          );
          return;
        }

        const QnaResponse = await ChatConversation({
          company_id: companyId,
          query: query,
          tender_id: tenderId,
        });

        setQnaResponse(QnaResponse.data);
      } catch (error) {
        console.error("Error calling ChatConversation API:", error);
      } finally {
        setIsSending(false);
      }
    },
    [report, location.state, setMessage, isSending, setQnaResponse]
  );

  return {
    handleSendMessage,
    isSending,
  };
};
