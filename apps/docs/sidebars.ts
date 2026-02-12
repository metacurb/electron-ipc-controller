import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    "intro",
    "quickstart",
    "architecture",
    {
      items: [
        {
          items: [
            "guides/decorators/class-decorators",
            "guides/decorators/method-decorators",
            "guides/decorators/parameter-decorators",
            "guides/decorators/custom-parameter-decorators",
          ],
          label: "Decorators",
          type: "category",
        },
        "guides/preload",
        "guides/dependency-injection",
        "guides/correlation",
        "guides/lifecycle",
        "guides/error-handling",
        "guides/security",
        "guides/channels",
      ],
      label: "Guides",
      type: "category",
    },
    {
      items: [
        "reference/index",
        {
          items: [
            "reference/core/index",
            "reference/core/runtime-api",
            "reference/core/decorators-reference",
            "reference/core/preload-api",
            "reference/core/advanced-helpers",
          ],
          label: "Core package (@electron-ipc-bridge/core)",
          type: "category",
        },
        {
          items: [
            "reference/vite-plugin/index",
            "reference/vite-plugin/plugin-options",
            "reference/vite-plugin/generation-behaviour",
          ],
          label: "Vite plugin (@electron-ipc-bridge/vite-plugin)",
          type: "category",
        },
      ],
      label: "Reference",
      type: "category",
    },
    {
      items: ["migration/from-manual-ipc", "troubleshooting"],
      label: "Operations",
      type: "category",
    },
    "examples",
  ],
};

export default sidebars;
