import React from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  heading = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonClass = "bg-expona-red hover:bg-red-700",
  cancelButtonClass = "bg-gray-2d hover:bg-gray-37",
  iconSrc = "images/alert-circle.svg",
  iconAlt = "Alert",
  isLoading = false,
  loadingText = "Processing...",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-24 rounded-lg p-8 shadow-lg w-[400px] max-w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 text-center flex flex-col justify-center items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-42 mb-2">
              <span className="bg-white p-1 inline-block rounded-full">
                <span className="flex rounded-full p-1 inline-block">
                  <img src={iconSrc} alt={iconAlt} />
                </span>
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">{heading}</h2>
            <p className="text-gray-ae font-light text-center">{message}</p>
          </div>
          <div className="flex w-full gap-4 mt-4">
            {cancelButtonText && (
              <button
                className={`flex-1 py-2 rounded text-white ${cancelButtonClass}`}
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelButtonText}
              </button>
            )}
            <button
              className={`${
                cancelButtonText ? "flex-1" : "w-full"
              } py-2 rounded text-white ${confirmButtonClass}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? loadingText : confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
