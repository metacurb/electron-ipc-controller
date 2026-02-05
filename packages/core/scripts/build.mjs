import { exec } from "child_process";
import * as esbuild from "esbuild";
import { promisify } from "util";

const execAsync = promisify(exec);

const commonConfig = {
  bundle: true,
  external: ["electron", "reflect-metadata"],
  minify: false,
  platform: "node",
  sourcemap: true,
  target: "node18",
};

/**
 * @param {string} path
 * @param {esbuild.Format} format
 */
const buildEntry = (path, format) =>
  esbuild.build({
    ...commonConfig,
    entryPoints: [`src/${path}.ts`],
    format,
    outfile: `dist/${path}.${format === "esm" ? "mjs" : "js"}`,
  });

/**
 * @param {string} path
 * @param {esbuild.Format[]} formats
 */
const buildFormats = (path, formats) => Promise.all(formats.map((format) => buildEntry(path, format)));

async function build() {
  console.log("🚀 Starting build...");

  try {
    const start = Date.now();

    console.log("📦 Building Main Entry...");
    await buildFormats("index", ["cjs", "esm"]);

    console.log("📦 Building Preload Helper...");
    await buildFormats("preload/index", ["cjs", "esm"]);

    console.log("📦 Building Preload Bundle...");
    await buildEntry("preload/preload.entry", "cjs");

    console.log("📝 Generating Types...");
    await execAsync("tsc -p tsconfig.build.json --emitDeclarationOnly");

    const end = Date.now();
    console.log(`✅ Build completed in ${(end - start) / 1000}s`);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build().catch(console.error);
