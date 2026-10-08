"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

// FORM DRAFTS THAT SURVIVE A REFRESH.
//
// The house rule: whatever someone has typed into a form is kept in this
// browser until they submit it or sign out, so a reload, a dropped connection
// or a mis-tap on "back" never costs them their words.
//
// How: the hook listens to input/change events on the form and saves the
// fields to localStorage under `relate-draft:<key>`; on mount it writes the
// saved values back into the fields. Forms using it should be uncontrolled
// (defaultValue / defaultChecked) so restoring is just setting the DOM value.
// Controlled bits (a photo list, a toggle kept in state) put their value in a
// hidden input marked `data-draft` and receive it back through `onRestore`.
//
// Never saved, whatever the form says: password fields, file inputs, hidden
// inputs not marked `data-draft`, anything marked `data-no-draft`, and any
// field whose name or autocomplete looks like a card or bank detail.
//
// Cleared: by calling the returned `clear()` after a successful submit, and
// for every form at once by clearAllFormDrafts(), which the Log out button
// calls (see src/components/layout/logout-button.tsx).

const PREFIX = "relate-draft:";
const SENSITIVE = /(pass(word)?|card|cc-|cvc|cvv|csc|iban|sort.?code|account.?number|security.?code|expiry|exp-?date)/i;

type DraftValues = Record<string, string | string[]>;

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null; // blocked storage: the form still works, just without drafts
  }
}

function isSavable(el: Element): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) return false;
  if (!el.name || el.disabled) return false;
  if (el.hasAttribute("data-no-draft")) return false;
  if (SENSITIVE.test(el.name) || SENSITIVE.test(el.getAttribute("autocomplete") ?? "")) return false;
  if (el instanceof HTMLInputElement) {
    if (el.type === "password" || el.type === "file" || el.type === "submit" || el.type === "button") return false;
    if (el.type === "hidden" && !el.hasAttribute("data-draft")) return false;
  }
  return true;
}

export function readFormDraft(key: string): DraftValues | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(PREFIX + key);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as DraftValues) : null;
  } catch {
    return null;
  }
}

export function clearFormDraft(key: string) {
  storage()?.removeItem(PREFIX + key);
}

export function clearAllFormDrafts() {
  const store = storage();
  if (!store) return;
  const keys: string[] = [];
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (k?.startsWith(PREFIX)) keys.push(k);
  }
  keys.forEach((k) => store.removeItem(k));
}

function collect(form: HTMLFormElement): DraftValues {
  const values: DraftValues = {};
  for (const el of Array.from(form.elements)) {
    if (!isSavable(el)) continue;
    if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
      const list = (values[el.name] as string[] | undefined) ?? [];
      if (el.checked) list.push(el.value);
      values[el.name] = list;
    } else if (el instanceof HTMLSelectElement && el.multiple) {
      values[el.name] = Array.from(el.selectedOptions).map((o) => o.value);
    } else {
      values[el.name] = el.value;
    }
  }
  return values;
}

function apply(form: HTMLFormElement, values: DraftValues) {
  for (const el of Array.from(form.elements)) {
    if (!isSavable(el) || !(el.name in values)) continue;
    const saved = values[el.name];
    if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
      el.checked = Array.isArray(saved) ? saved.includes(el.value) : saved === el.value;
    } else if (el instanceof HTMLSelectElement && el.multiple && Array.isArray(saved)) {
      for (const option of Array.from(el.options)) option.selected = saved.includes(option.value);
    } else if (typeof saved === "string" && !(el instanceof HTMLInputElement && el.type === "hidden")) {
      el.value = saved;
    }
  }
}

export function useFormDraft(
  formRef: RefObject<HTMLFormElement | null>,
  key: string,
  options: { onRestore?: (values: DraftValues) => void; enabled?: boolean } = {}
) {
  const { onRestore, enabled = true } = options;
  const onRestoreRef = useRef(onRestore);
  // The pending debounced save, shared with clear() so a submit can cancel a
  // save scheduled by the last keystroke (otherwise it lands after the clear
  // and resurrects the draft of a form that was just sent).
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    onRestoreRef.current = onRestore;
  }, [onRestore]);

  useEffect(() => {
    const form = formRef.current;
    if (!form || !enabled) return;

    const saved = readFormDraft(key);
    if (saved) {
      apply(form, saved);
      onRestoreRef.current?.(saved);
    }

    const save = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        try {
          storage()?.setItem(PREFIX + key, JSON.stringify(collect(form)));
        } catch {
          // Quota exceeded or blocked: drafts are a convenience, never an error.
        }
      }, 300);
    };
    form.addEventListener("input", save);
    form.addEventListener("change", save);
    return () => {
      clearTimeout(timerRef.current);
      form.removeEventListener("input", save);
      form.removeEventListener("change", save);
    };
  }, [formRef, key, enabled]);

  // Controlled fields change their hidden input programmatically, which fires
  // no event — they call this to save straight away.
  const saveNow = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    try {
      storage()?.setItem(PREFIX + key, JSON.stringify(collect(form)));
    } catch {
      // ignore
    }
  }, [formRef, key]);

  const clear = useCallback(() => {
    clearTimeout(timerRef.current);
    clearFormDraft(key);
  }, [key]);
  return { clear, saveNow };
}
