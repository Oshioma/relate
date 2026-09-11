// Registers the resolver above. Used as `node --import ./scripts/ts-resolve.mjs`.
import { register } from "node:module";
register(new URL("./ts-resolve-hooks.mjs", import.meta.url));
