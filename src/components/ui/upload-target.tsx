"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { UploadTarget } from "@/lib/space-files";

// Where member uploads made on this page go. A space's layout sets it, so
// every upload control inside a space visitors can't open (composer, rich
// editor, resources, journal, photo pickers) stores into that space's private
// folder without each form having to pass the space down. Outside a space, or
// in a space open to visitors, it's null: the public 'uploads' bucket.
const UploadTargetContext = createContext<UploadTarget>(null);

export function UploadTargetProvider({ target, children }: { target: UploadTarget; children: ReactNode }) {
  return <UploadTargetContext.Provider value={target}>{children}</UploadTargetContext.Provider>;
}

export function useUploadTarget(): UploadTarget {
  return useContext(UploadTargetContext);
}
