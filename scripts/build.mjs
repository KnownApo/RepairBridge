import { mkdir, copyFile, readdir, stat, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const distDir = join(process.cwd(), "dist");
const root = process.cwd();

const copyRecursive = async (src, dest) => {
  const info = await stat(src);
  if (info.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);
    await Promise.all(
      entries.map((entry) => copyRecursive(join(src, entry), join(dest, entry)))
    );
    return;
  }

  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);
};

const safeRemove = async (path) => {
  try {
    await rm(path, { recursive: true, force: true });
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
};

const main = async () => {
  await safeRemove(distDir);
  await mkdir(distDir, { recursive: true });

  const targets = [
    "index.html",
    "styles.css",
    "enhanced-styles.css",
    "layout-fix.css",
    "script.js",
    "modules",
    "data",
    "PRIVACY.md",
    "TERMS.md"
  ];

  await Promise.all(
    targets.map((target) => copyRecursive(join(root, target), join(distDir, target)))
  );

  console.log("Build complete → dist/");
};

main().catch((error) => {
  console.error("Build failed:", error);
  process.exitCode = 1;
});
