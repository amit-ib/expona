import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const EditableDropdown = forwardRef(
  (
    {
      label,
      defaultValue,
      fieldId,
      sectionId,
      editingSection,
      editingField,
      onEditClick,
      className = "",
    },
    ref
  ) => {
    const isCurrentlyEditing =
      editingSection === sectionId && editingField === fieldId;

    const [value, setValue] = useState(defaultValue || "no");

    useEffect(() => {
      setValue(defaultValue || "no");
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
          <select
            className={`w-full bg-transparent font-inter text-base p-3.5 outline-none transition-colors rounded-lg pr-12 appearance-none ${
              isCurrentlyEditing
                ? "text-white border-blue-500 focus:border-blue-400"
                : "text-gray-ae focus:border-white cursor-pointer"
            }`}
            value={value}
            onChange={handleChange}
            disabled={!isCurrentlyEditing}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center px-2 text-gray-ae">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
          {!isCurrentlyEditing && (
            <button
              onClick={() => onEditClick(fieldId, sectionId)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-ae hover:text-white"
              aria-label={`Edit ${label}`}
            >
              <img src="/images/edit-icon.svg" alt="edit" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default EditableDropdown;
