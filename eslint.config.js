import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    languageOptions: {
      globals: {
        ...globals.node,       // ✅ Add Node.js globals like `process`, `__dirname`
        ...globals.es2021,     // Optional: Include ES2021 globals
      },
    },
    extends: ["js/recommended"],
  },
]);
