import React from "react";

const SectionEditButtons = ({ onCancel, onSave }) => (
  <div className="flex justify-end gap-4 mt-6 pt-4 ">
    <button
      onClick={onCancel}
      className="bg-gray-24 text-white px-12 py-2 rounded-lg font-medium hover:bg-gray-4f transition-colors"
    >
      Cancel
    </button>
    <button
      onClick={onSave}
      className="bg-expona-red text-white px-6 py-2 rounded-lg font-medium hover:bg-ib-red transition-colors"
    >
      Save changes
    </button>
  </div>
);

export default SectionEditButtons;
