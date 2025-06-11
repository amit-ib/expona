import React from 'react';

const MessageInput = ({ message, setMessage, isDisabled }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 pb-4">
      <div className=" flex items-center border border-gray-5c bg-gray-37 rounded-2xl px-4 py-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask more about your tender"
          className={`flex-1 bg-transparent text-white border-none outline-none ${isDisabled ? 'placeholder:text-gray-5c' : 'placeholder:text-gray-2ae'}`}
          disabled={isDisabled}
        />
        <div className="ml-2 w-8 h-8 rounded-full bg-white/12 flex items-center justify-center cursor-pointer">
          <button disabled={isDisabled} className={`${isDisabled ? 'opacity-50' : ''}`}><img src="/images/send-icon.svg" alt="Send" width="32" height="32" /></button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput; 