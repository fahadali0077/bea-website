export function focusWaitlistField(fieldId: string) {
  window.setTimeout(() => {
    const el = document.getElementById(fieldId);
    if (!el || !(el instanceof HTMLElement)) {
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
    el.classList.add("waitlist-field--highlight");

    const clearHighlight = () => {
      el.classList.remove("waitlist-field--highlight");
    };

    el.addEventListener("input", clearHighlight, { once: true });
    el.addEventListener("change", clearHighlight, { once: true });
    el.addEventListener("blur", clearHighlight, { once: true });
  }, 0);
}
