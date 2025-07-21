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
