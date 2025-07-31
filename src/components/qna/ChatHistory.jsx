import React from "react";
import ChatActions from "../chat/ChatActions";
import { markdownComponents } from "../../utils";
import Markdown from "react-markdown";
import { FetchChatHistory } from "../../api/apiHelper";

const ChatHistory = ({
  showOtherPrompts,
  setShowOtherPrompts,
  setShowSavedNote,
  saved,
  setSaved,
  scrollToSection,
  qnaResponse,
  pendingMessage,
  report,
}) => {
  const otherPromptsRef = React.useRef(null);
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

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
    const tenderId = localStorage.getItem("tenderId");
    if (!tenderId) return;
    if (report.status === "success") {
      const fetchChatHistory = async () => {
        setLoading(true);
        try {
          const chatHistory = await FetchChatHistory({
            tender_id: tenderId,
          });
          // console.log("chatHistory", chatHistory);
          setMessages(chatHistory?.data?.messages || []);
        } finally {
          setLoading(false);
          // Scroll the chat content div to the bottom after sending
          setTimeout(() => {
            const chatContentDiv = document.querySelector(".chat-scrollbar");
            if (chatContentDiv) {
              chatContentDiv.scrollTop = chatContentDiv.scrollHeight;
            }
          }, 100);
        }
      };
      fetchChatHistory();
    }
  }, [qnaResponse, report]);

  React.useEffect(() => {
    if (report.status === "success") {
      setLoading(true);
    }
  }, [pendingMessage]);

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
              <div className="text-sm  my-5">{msg.answer}</div>
              <ChatActions
                setShowSavedNote={setShowSavedNote}
                showOtherPrompts={showOtherPrompts}
                saved={saved}
                setSaved={setSaved}
                answer={msg.answer}
                messageId={msg.answer_id}
                isfeedbackSent={msg.liked}
              />
            </div>
          </div>
        ))}
      {/* Loader at the bottom */}
      {loading && (
        <>
          <div className="text-sm font-light flex flex-col">
            <div className="self-end max-w-xl bg-gray-4f px-4 py-2 rounded-md">
              {pendingMessage}
            </div>
          </div>
          <div className="flex">
            <span className="animate-pulse bg-gradient-to-r from-expona-red via-gray-200 inline-block text-transparent bg-clip-text">
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
