import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const EditableInput = forwardRef(
  (
    {
      label,
      placeholder,
      defaultValue,
      source = "GST Portal",
      fieldId,
      sectionId,
      editingSection,
      editingField,
      onEditClick,
      type = "text",
      className = "",
    },
    ref
  ) => {
    const isCurrentlyEditing =
      editingSection === sectionId && editingField === fieldId;

    const [value, setValue] = useState(defaultValue || "");

    // Reset value to defaultValue when editing starts
    // useEffect(() => {
    //   if (isCurrentlyEditing) {
    //     setValue(defaultValue || "");
    //   }
    //   if (!isCurrentlyEditing) {
    //     setValue(defaultValue || "");
    //   }
    // }, [isCurrentlyEditing, defaultValue]);
    useEffect(() => {
      setValue(defaultValue || "");
    }, [defaultValue]);
    const handleChange = (e) => {
      if (isCurrentlyEditing) {
        setValue(e.target.value);
      }
    };

    // Expose getValue to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        getValue: () => value,
      }),
      [value]
    );

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-white font-lexend text-sm font-normal">
          {label}
        </label>
        <div className="bg-gray-2d border border-gray-4f rounded-lg shadow-sm relative group">
          <input
            type={type}
            className={`w-full bg-transparent font-inter text-base p-3.5 outline-none transition-colors rounded-lg pr-12 ${
              isCurrentlyEditing
                ? "text-white border-blue-500 focus:border-blue-400"
                : "text-gray-ae focus:border-white"
            }`}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            readOnly={!isCurrentlyEditing}
          />
          <button
            onClick={() => onEditClick(fieldId, sectionId)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-ae hover:text-white"
            aria-label={`Edit ${label}`}
          >
            <img src="/images/edit-icon.svg" alt="edit" />
          </button>
        </div>
        <span className="text-gray-ae text-xs">Source: {source}</span>
      </div>
    );
  }
);

export default EditableInput;
