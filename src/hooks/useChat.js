import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ChatConversation } from "../api/apiHelper";

export const useChat = (report, message, setMessage) => {
  const location = useLocation();
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = useCallback(
    async (query) => {
      if (!query.trim() || isSending) return;

      setIsSending(true);

      try {
        const companyId = localStorage.getItem("company_id");
        const rawFilename = location.state?.filename || report?.data?.filename;
        const tenderId = report?.data?.tender_id || location.state?.id;

        if (!rawFilename || !companyId || !tenderId) {
          console.error(
            "Missing required parameters for ChatConversation API",
            rawFilename
          );
          return;
        }

        // Remove the last 3 characters from the filename
        const filename = rawFilename.slice(0, -4);

        const response = await ChatConversation({
          filename: filename,
          company_id: companyId,
          query: query,
          tender_id: tenderId,
        });

        console.log("ChatConversation API response:", response);

        // Clear the input after successful send
        setMessage("");
      } catch (error) {
        console.error("Error calling ChatConversation API:", error);
      } finally {
        setIsSending(false);
      }
    },
    [report, location.state, message, setMessage, isSending]
  );

  return {
    handleSendMessage,
    isSending,
  };
};
