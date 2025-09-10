import React from "react";

const MessageInput = ({
  message,
  setMessage,
  isDisabled,
  onSendMessage,
  setPendingMessage,
}) => {
  const handleSend = () => {
    if (message.trim() && !isDisabled) {
      if (setPendingMessage) setPendingMessage(message);
      onSendMessage(message);
      // Scroll the chat content div to the bottom after sending
      setTimeout(() => {
        const chatContentDiv = document.querySelector(".chat-scrollbar");
        if (chatContentDiv) {
          chatContentDiv.scrollTop = chatContentDiv.scrollHeight;
        }
      }, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="lg:absolute relative bottom-0 lg:left-0  lg:right-0 pb-4">
      <div className="flex items-center border border-gray-5c bg-gray-37 rounded-2xl px-4 py-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask more about your tender"
          className={`flex-1 bg-transparent text-white border-none outline-none ${
            isDisabled
              ? "placeholder:text-gray-5c"
              : "placeholder:text-gray-2ae"
          }`}
          disabled={isDisabled}
        />
        <div className="ml-2 w-8 h-8 rounded-full bg-white/12 flex items-center justify-center cursor-pointer">
          <button
            type="button"
            onClick={handleSend}
            disabled={isDisabled || !message.trim()}
            aria-label="Send message"
            className={`${
              message.trim() ? "bg-expona-red" : "bg-gray-5c"
            } rounded-full p-1.5 ${
              isDisabled || !message.trim() ? "opacity-50" : ""
            }`}
          >
            <img src="/images/send-icon.svg" alt="" aria-hidden="true" />
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
