// Utility to extract Company_ID from user object
export function getCompanyIdFromUser(user) {
  if (
    user &&
    Array.isArray(user.company_profile) &&
    user.company_profile.length > 0
  ) {
    const companyId = user.company_profile[0].Company_ID;
    if (companyId) {
      localStorage.setItem("company_id", companyId);
    }
    return companyId;
  }
  return undefined;
}

// Markdown components for react-markdown
export const markdownComponents = {
  p: ({ node, ...props }) => <p className="mb-5" {...props} />,
  ul: ({ node, ...props }) => {
    const depth = node?.position?.start?.column || 0;
    const isNested = depth > 2;
    return (
      <ul
        className={
          isNested
            ? "list-disc ml-8 mb-4 text-sm mt-3 space-y-1"
            : "list-disc ml-5 mb-5 text-sm space-y-1"
        }
        {...props}
      />
    );
  },
  ol: ({ node, ...props }) => <ul className="list-decimal" {...props} />,
  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold" {...props} />,
  h3: ({ node, ...props }) => <h3 className="font-semibold mb-4" {...props} />,
  a: ({ node, ...props }) => <a className="text-white underline" {...props} />,
};

// Utility to format array-like strings for display in textboxes
export function formatArrayStringForDisplay(value) {
  if (typeof value !== "string") return value;
  try {
    // Try to parse as JSON array
    const arr = JSON.parse(value);
    if (Array.isArray(arr)) {
      return arr.join(", ");
    }
  } catch (e) {
    // Not a JSON array, fallback: remove brackets and quotes
    return value.replace(/\[|\]|"/g, "");
  }
  return value;
}

// Converts a comma-separated display string back to a JSON array string for API submission
export function formatDisplayStringToArrayString(value) {
  if (typeof value !== "string") return value;
  const arr = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return JSON.stringify(arr);
}

// Truncate a string to a maximum number of words, adding ellipsis if exceeded
export function truncateWords(text, maxWords) {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

// Truncate a string to a given word limit, adding ellipsis if exceeded
export function truncateWordsLimit(text, wordLimit) {
  return truncateWords(text, wordLimit);
}

// Truncate a string to a maximum number of characters, adding ellipsis if exceeded
export function truncateString(text, maxChars) {
  // console.log("FILE NAME:", text);
  if (!text) return "";
  if (typeof text !== "string") return text;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "...";
}

/**
 * Copies the provided text to the clipboard.
 * Uses the Clipboard API if available, falls back to execCommand.
 * @param {string} text - The text to copy.
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}
