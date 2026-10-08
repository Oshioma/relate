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
//
// Two entry points share this engine: useFormDraft(key) hands back a formRef
// to attach (simple uncontrolled forms), and useFormDraftRef(formRef, key,
// options) works with a ref the caller already owns and adds onRestore /
// saveNow for controlled fields.

// Every draft lives under this prefix so signing out can sweep them all.
const PREFIX = "form-draft:";
const SENSITIVE = /(pass(word)?|card|cc-|cvc|cvv|csc|iban|sort.?code|account.?number|security.?code|expiry|exp-?date)/i;

// Signing out must win against a save that's already queued: clicking "Log
// out" blurs the field being typed in, which fires `change` and schedules a
// save that would otherwise land after the sweep and put the draft back.
// Every pending save is tracked here, and saves are ignored briefly after a
// sweep (the page is navigating away by then).
const pendingSaves = new Set<ReturnType<typeof setTimeout>>();
let suppressSavesUntil = 0;

// Checkbox groups are saved as the list of checked values; single values as
// strings. Booleans are an older per-field checkbox format, still restored.
type DraftValues = Record<string, string | string[] | boolean>;

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
  try {
    storage()?.removeItem(PREFIX + key);
  } catch {
    // Nothing to clear.
  }
}

// Drops every saved form draft — called on sign-out so the next person on this
// browser doesn't find someone else's half-typed text.
export function clearAllFormDrafts() {
  pendingSaves.forEach((t) => clearTimeout(t));
  pendingSaves.clear();
  suppressSavesUntil = Date.now() + 3000;
  const store = storage();
  if (!store) return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (k?.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => store.removeItem(k));
  } catch {
    // Storage unavailable — there were no drafts to leave behind.
  }
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

function writeDraft(key: string, form: HTMLFormElement) {
  if (Date.now() < suppressSavesUntil) return; // just signed out
  try {
    storage()?.setItem(PREFIX + key, JSON.stringify(collect(form)));
  } catch {
    // Quota exceeded or blocked: drafts are a convenience, never an error.
  }
}

function apply(form: HTMLFormElement, values: DraftValues) {
  for (const el of Array.from(form.elements)) {
    if (!isSavable(el) || !(el.name in values)) continue;
    const saved = values[el.name];
    if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
      el.checked = typeof saved === "boolean" ? saved : Array.isArray(saved) ? saved.includes(el.value) : saved === el.value;
    } else if (el instanceof HTMLSelectElement && el.multiple && Array.isArray(saved)) {
      for (const option of Array.from(el.options)) option.selected = saved.includes(option.value);
    } else if (typeof saved === "string" && !(el instanceof HTMLInputElement && el.type === "hidden")) {
      el.value = saved;
    }
  }
}

export function useFormDraftRef(
  formRef: RefObject<HTMLFormElement | null>,
  key: string,
  options: { onRestore?: (values: Record<string, string | string[]>) => void; enabled?: boolean } = {}
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
      // Controlled fields are always saved as strings (their hidden input), so
      // the legacy boolean checkbox values never reach onRestore callers.
      onRestoreRef.current?.(saved as Record<string, string | string[]>);
    }

    const save = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        pendingSaves.delete(timerRef.current);
      }
      const timer = setTimeout(() => {
        pendingSaves.delete(timer);
        writeDraft(key, form);
      }, 300);
      timerRef.current = timer;
      pendingSaves.add(timer);
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
    if (form) writeDraft(key, form);
  }, [formRef, key]);

  const clear = useCallback(() => {
    clearTimeout(timerRef.current);
    clearFormDraft(key);
  }, [key]);
  return { clear, saveNow };
}

// Auto-saves an uncontrolled form's fields as they're typed and puts them back
// after a refresh. Attach `formRef` to the <form>, and call `clearDraft` once
// the submit has succeeded.
export function useFormDraft(key: string) {
  const formRef = useRef<HTMLFormElement>(null);
  const { clear } = useFormDraftRef(formRef, key);
  return { formRef, clearDraft: clear };
}
