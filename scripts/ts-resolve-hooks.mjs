// Making Node's own test runner able to import this repo's TypeScript.
//
// Node 22 strips types from .ts files on its own (--experimental-strip-types),
// which is the whole compiler this repo's tests need. What it does NOT do is
// rewrite import specifiers, and TypeScript source writes them the TypeScript
// way: `./time` with no extension, and `@/types/database` through the path
// alias in tsconfig. ESM resolution refuses both.
//
// So: two rules, which is all of it. `@/` means `src/`, and a specifier that
// resolves to nothing gets `.ts`, `.tsx` or `/index.ts` tried on the end —
// exactly what tsc does, and nothing more clever than that.
//
// The alternative was a test-runner dependency and its transform pipeline. This
// is thirty lines and no dependency at all, which for running pure functions
// over a data file is the right size of tool.

import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXTENSIONS = [".ts", ".tsx", "/index.ts", "/index.tsx"];

export async function resolve(specifier, context, next) {
  const spec = specifier.startsWith("@/")
    ? pathToFileURL(path.join(root, "src", specifier.slice(2))).href
    : specifier;

  try {
    return await next(spec, context);
  } catch (error) {
    for (const extension of EXTENSIONS) {
      try {
        return await next(spec + extension, context);
      } catch {
        // Try the next one; the original error is thrown if none work.
      }
    }
    throw error;
  }
}
