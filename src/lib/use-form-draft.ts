"use client";

import { useCallback, useEffect, useRef } from "react";

// Every draft lives under this prefix so signing out can sweep them all.
const PREFIX = "form-draft:";

// Fields that must never be written to the browser: passwords, and anything
// the browser itself would autofill as payment-card data.
function isSensitive(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
  if (el instanceof HTMLInputElement && (el.type === "password" || el.type === "hidden" || el.type === "file")) {
    return true;
  }
  const autocomplete = (el.getAttribute("autocomplete") ?? "").toLowerCase();
  return autocomplete.startsWith("cc-") || /card|cvc|cvv/i.test(el.name);
}

function draftFields(form: HTMLFormElement) {
  return Array.from(form.elements).filter(
    (el): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
      (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) &&
      Boolean(el.name) &&
      !isSensitive(el)
  );
}

// Auto-saves an uncontrolled form's fields to localStorage as they're typed and
// puts them back after a refresh. Attach `formRef` to the <form>, and call
// `clearDraft` once the submit has succeeded. Storage can be unavailable
// (private windows, blocked site data), so every access is best-effort.
export function useFormDraft(key: string) {
  const formRef = useRef<HTMLFormElement>(null);
  const storageKey = PREFIX + key;

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const values = JSON.parse(saved) as Record<string, string | boolean>;
        for (const el of draftFields(form)) {
          if (!(el.name in values)) continue;
          const value = values[el.name];
          if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
            el.checked = Boolean(value);
          } else {
            el.value = String(value);
          }
        }
      }
    } catch {
      // A corrupt or unreadable draft just means starting from the saved values.
    }

    const save = () => {
      const values: Record<string, string | boolean> = {};
      for (const el of draftFields(form)) {
        values[el.name] =
          el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio") ? el.checked : el.value;
      }
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(values));
      } catch {
        // Out of quota or blocked — the form still works, just without a draft.
      }
    };

    form.addEventListener("input", save);
    form.addEventListener("change", save);
    return () => {
      form.removeEventListener("input", save);
      form.removeEventListener("change", save);
    };
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Nothing to clear.
    }
  }, [storageKey]);

  return { formRef, clearDraft };
}

// Drops every saved form draft — called on sign-out so the next person on this
// browser doesn't find someone else's half-typed text.
export function clearAllFormDrafts() {
  try {
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(PREFIX)) window.localStorage.removeItem(k);
    }
  } catch {
    // Storage unavailable — there were no drafts to leave behind.
  }
}
