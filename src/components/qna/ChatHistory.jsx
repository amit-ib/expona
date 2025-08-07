import React from "react";
import ChatActions from "../chat/ChatActions";
import { markdownComponents } from "../../utils";
import Markdown from "react-markdown";
import { FetchChatHistory } from "../../api/apiHelper";
import remarkGfm from "remark-gfm";

const ChatHistory = ({
  showOtherPrompts,
  setShowOtherPrompts,
  setShowSavedNote,
  scrollToSection,
  qnaResponse,
  pendingMessage,
  report,
  isChatHistoryLoading,
  setIsChatHistoryLoading,
}) => {
  const otherPromptsRef = React.useRef(null);
  const [messages, setMessages] = React.useState([]);
  const justSentMessage = React.useRef(false);

  const fetchChatHistory = React.useCallback(async () => {
    const tenderId = localStorage.getItem("TENDER_ID");
    if (!tenderId) return;
    setIsChatHistoryLoading(true);
    try {
      const chatHistory = await FetchChatHistory({
        tender_id: tenderId,
      });
      setMessages(chatHistory?.data?.messages || []);
    } finally {
      setIsChatHistoryLoading(false);
    }
  }, [setIsChatHistoryLoading]);

  // Function to scroll to otherPrompts
  const scrollToOtherPrompts = () => {
    otherPromptsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to otherPrompts when it becomes visible
  React.useEffect(() => {
    if (showOtherPrompts && otherPromptsRef.current) {
      scrollToOtherPrompts();
    }
  }, [showOtherPrompts]);

  React.useEffect(() => {
    // Fetch chat history when qnaResponse changes and tenderId is available
    const tenderId = localStorage.getItem("TENDER_ID");
    if (!tenderId) return;
    if (report.status === "success") {
      fetchChatHistory();
    }
  }, [qnaResponse, report, fetchChatHistory]);

  React.useEffect(() => {
    if (pendingMessage) {
      justSentMessage.current = true;
      setIsChatHistoryLoading(true);
    }
  }, [pendingMessage]);

  React.useEffect(() => {
    if (justSentMessage.current) {
      setTimeout(() => {
        const chatContentDiv = document.querySelector(".chat-scrollbar");
        if (chatContentDiv) {
          chatContentDiv.scrollTop = chatContentDiv.scrollHeight;
        }
      }, 100);
      justSentMessage.current = false;
    }
  }, [messages]);

  // console.log("pendingMessage", pendingMessage, message);
  return (
    <div className="w-full " id="otherPrompts" ref={otherPromptsRef}>
      {/* Messages or empty state */}
      {messages.length > 0 &&
        messages.map((msg, idx) => (
          <div key={idx} className="mt-10">
            <div className="text-sm font-light flex flex-col">
              <div className="self-end max-w-xl bg-gray-4f px-4 py-2 rounded-md">
                {msg.question}
              </div>
            </div>
            <div className="group">
              <div className="text-sm font-light  my-5 qna-response">
                <Markdown
                  components={markdownComponents}
                  remarkPlugins={[remarkGfm]}
                >
                  {msg.answer}
                </Markdown>
              </div>
              <ChatActions
                setShowSavedNote={setShowSavedNote}
                showOtherPrompts={showOtherPrompts}
                saved={msg.saved}
                answer={msg.answer}
                messageId={msg.answer_id}
                isfeedbackSent={msg.liked}
                fetchChatHistory={fetchChatHistory}
              />
            </div>
          </div>
        ))}
      {/* Loader at the bottom */}
      {isChatHistoryLoading && (
        <>
          <div className="text-sm font-light flex flex-col">
            <div className="self-end max-w-xl bg-gray-4f px-4 py-2 rounded-md">
              {pendingMessage}
            </div>
          </div>
          <div className="flex">
            <span className="animate-pulse bg-gradient-to-r from-expona-red via-gray-200 inline-block text-transparent bg-clip-text mt-3">
              Analysing.....
            </span>
          </div>
        </>
      )}
      {/* Actions Section */}
    </div>
  );
};

export default ChatHistory;
