/**
 * Copies text to the clipboard, falling back to a hidden textarea when the
 * async Clipboard API is unavailable — it needs a secure context, so it is
 * missing on plain-http origins and in some in-app browsers.
 *
 * Returns whether the copy succeeded so callers can show honest feedback
 * rather than claiming success unconditionally.
 */
export async function copyToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}
