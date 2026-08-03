import { useCallback } from "react";

const CONTROL_SELECTOR = "input, select, textarea";

const isFilled = (el: HTMLElement) => {
  if (el instanceof HTMLInputElement) {
    if (el.type === "checkbox" || el.type === "radio") return el.checked;
    return el.value.trim().length > 0;
  }
  if (el instanceof HTMLSelectElement) return el.value !== "";
  if (el instanceof HTMLTextAreaElement) return el.value.trim().length > 0;
  return true;
};

const isAvailable = (el: HTMLElement) => {
  const control = el as HTMLInputElement;
  if (control.disabled || control.readOnly) return false;
  if (control.type === "hidden") return false;
  // offsetParent is null for anything display:none or detached.
  return control.offsetParent !== null;
};

/**
 * Returns an onKeyDown handler for a <form>.
 *
 * Enter behaves the way people expect on a multi-field form:
 *   - on an empty field, it stays put rather than submitting an incomplete form
 *   - on a filled field, it jumps to the next field still needing a value
 *   - when nothing is left empty, it falls through and submits
 *
 * Textareas are left alone so Enter still inserts a newline.
 */
export function useEnterAdvance() {
  return useCallback((event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;

    const target = event.target as HTMLElement;
    if (target instanceof HTMLTextAreaElement) return;
    if (target instanceof HTMLButtonElement) return;

    const form = event.currentTarget;
    // Cast rather than use the generic: TypeScript cannot resolve a typed
    // querySelectorAll against a comma-separated selector list.
    const controls = (Array.from(form.querySelectorAll(CONTROL_SELECTOR)) as HTMLElement[]).filter(isAvailable);

    const index = controls.indexOf(target);
    if (index === -1) return;

    // Empty field: hold focus here instead of submitting something incomplete.
    if (!isFilled(target)) {
      event.preventDefault();
      return;
    }

    // Prefer the next empty field after this one, then wrap to any earlier gap.
    const nextEmpty =
      controls.slice(index + 1).find((el) => !isFilled(el)) ?? controls.slice(0, index).find((el) => !isFilled(el));

    if (nextEmpty) {
      event.preventDefault();
      nextEmpty.focus();
      if (nextEmpty instanceof HTMLInputElement) nextEmpty.select();
      return;
    }

    // Everything is filled — let the form submit normally.
  }, []);
}
