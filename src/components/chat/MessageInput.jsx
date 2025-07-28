import React from "react";

const MessageInput = ({ message, setMessage, isDisabled, onSendMessage }) => {
  const handleSend = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 pb-4">
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
            onClick={handleSend}
            disabled={isDisabled}
            className={`${
              message.trim() ? "bg-expona-red" : "bg-gray-5c"
            } rounded-full p-1.5 ${isDisabled ? "opacity-50" : ""}`}
          >
            <img src="/images/send-icon.svg" alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
