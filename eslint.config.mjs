import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import perfectionist from "eslint-plugin-perfectionist";
import unusedImports from "eslint-plugin-unused-imports";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  {
    ignores: ["eslint.config.mjs", "dist/**", "node_modules/**"],
  },
  eslintConfigPrettier,
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      perfectionist,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"],
            ["^@?\\w"],
            ["^@", "^"],
            ["^\\./"],
          ],
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "perfectionist/sort-objects": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
      "perfectionist/sort-interfaces": ["error"],
      "perfectionist/sort-classes": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "index-signature",
            "static-property",
            "private-property",
            "property",
            "constructor",
            "static-method",
            "private-method",
            "method",
            ["get-method", "set-method"],
            "unknown",
          ],
        },
      ],
    },
  },
]);
