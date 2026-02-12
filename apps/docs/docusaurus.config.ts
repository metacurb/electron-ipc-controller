/* eslint-disable @typescript-eslint/no-require-imports */
import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import path from "path";
import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const corePkgPath = path.resolve(process.cwd(), "..", "..", "packages", "core", "package.json");
const { version } = require(corePkgPath) as { version: string };

const GITHUB_REPO = "https://github.com/metacurb/electron-ipc-bridge";
const GITHUB_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';

const config: Config = {
  baseUrl: "/electron-ipc-bridge/",
  favicon: "img/favicon.ico",
  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
  },
  onBrokenLinks: "throw",

  organizationName: "metacurb",
  presets: [
    [
      "classic",
      {
        blog: false,
        docs: {
          editUrl: "https://github.com/metacurb/electron-ipc-bridge/tree/main/apps/docs/",
          remarkPlugins: [[require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }]],
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  projectName: "electron-ipc-bridge",

  tagline: "Type-safe IPC for Electron",

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} OPISTA`,
      links: [
        {
          items: [
            {
              href: "https://github.com/metacurb/electron-ipc-bridge",
              label: "Repository",
            },
            {
              href: "https://github.com/metacurb/electron-ipc-bridge/issues",
              label: "Issues",
            },
          ],
          title: "GitHub",
        },
        {
          items: [
            { href: "https://www.npmjs.com/", label: "@electron-ipc-bridge/core" },
            { href: "https://www.npmjs.com/", label: "@electron-ipc-bridge/vite-plugin" },
          ],
          title: "Packages",
        },
      ],
      style: "dark",
    },
    navbar: {
      items: [
        {
          label: "Docs",
          position: "left",
          sidebarId: "tutorialSidebar",
          type: "docSidebar",
        },
        {
          position: "right",
          type: "html",
          value: `<a href="${GITHUB_REPO}/releases" target="_blank" rel="noopener noreferrer" class="navbar__version-link">v${version}</a>`,
        },
        {
          position: "right",
          type: "html",
          value: `<a href="${GITHUB_REPO}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" class="navbar__github-icon">${GITHUB_ICON_SVG}</a>`,
        },
      ],
      logo: {
        alt: "Electron IPC Bridge",
        src: "img/logo.png",
      },
      title: "Electron IPC Bridge",
    },
    prism: {
      darkTheme: prismThemes.oneDark,
      theme: prismThemes.oneLight,
    },
  } satisfies Preset.ThemeConfig,

  themes: ["@docusaurus/theme-mermaid"],

  title: "Electron IPC Bridge",

  url: "https://metacurb.github.io",
};

export default config;
