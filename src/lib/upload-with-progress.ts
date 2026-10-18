// Sending a file from the browser with a real progress bar.
//
// fetch() still can't report upload progress, and supabase-js's upload is
// built on fetch, so a large recording would sit on a spinner for minutes
// with no sign it is moving. XMLHttpRequest reports every chunk. Used for
// lesson recordings, which run to hundreds of MB.

export type UploadResult = { status: number; body: string };

export class UploadAborted extends Error {
  constructor() {
    super("Upload cancelled.");
    this.name = "UploadAborted";
  }
}

export function uploadWithProgress(options: {
  method: "POST" | "PUT";
  url: string;
  headers: Record<string, string>;
  body: Blob;
  onProgress: (loaded: number, total: number) => void;
  // Lets the caller cancel: abort() rejects the promise with UploadAborted.
  signal?: AbortSignal;
}): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url);
    for (const [name, value] of Object.entries(options.headers)) xhr.setRequestHeader(name, value);

    xhr.upload.onprogress = (event) => {
      options.onProgress(event.loaded, event.lengthComputable ? event.total : options.body.size);
    };
    xhr.onload = () => resolve({ status: xhr.status, body: xhr.responseText });
    // A network failure, a CORS refusal and a server that hung up mid-body all
    // look the same from here: status 0 and no detail.
    xhr.onerror = () => reject(new Error("The upload was cut off."));
    xhr.onabort = () => reject(new UploadAborted());

    if (options.signal) {
      if (options.signal.aborted) {
        reject(new UploadAborted());
        return;
      }
      options.signal.addEventListener("abort", () => xhr.abort(), { once: true });
    }
    xhr.send(options.body);
  });
}

// The "error" / "message" / "detail" a JSON error body carries, if any —
// Supabase Storage says "message", FastAPI says "detail".
export function uploadErrorMessage(body: string): string | null {
  try {
    const parsed = JSON.parse(body) as { message?: unknown; error?: unknown; detail?: unknown };
    for (const value of [parsed.detail, parsed.message, parsed.error]) {
      if (typeof value === "string" && value.trim()) return value;
    }
  } catch {
    // Not JSON — a proxy's HTML error page, say. Nothing worth showing.
  }
  return null;
}
