import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const EditableTextarea = forwardRef(
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
      className = "",
      rows = 3,
    },
    ref
  ) => {
    const isCurrentlyEditing =
      editingSection === sectionId && editingField === fieldId;

    const [value, setValue] = useState(defaultValue || "");

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
          <textarea
            className="w-full bg-transparent text-gray-ae font-inter text-base p-3.5 outline-none focus:border-white transition-colors rounded-lg pr-12 resize-none"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            readOnly={!isCurrentlyEditing}
            rows={rows}
          />
          <button
            onClick={() => onEditClick(fieldId, sectionId)}
            className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-ae hover:text-white"
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

export default EditableTextarea;
