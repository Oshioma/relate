import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Links go through @/components/ui/link, which writes a community's
  // /c/<slug>/… links as clean paths on its own host (no redirect per click).
  {
    rules: {
      "no-restricted-imports": [
        "error",
        { paths: [{ name: "next/link", message: "Import Link from \"@/components/ui/link\" instead." }] },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
