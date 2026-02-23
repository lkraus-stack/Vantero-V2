import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const itemsToCopy = [
  "index.html",
  "styles.css",
  "app.js",
  "assets",
  "lemon_milk",
  "lp",
];

const pathExists = async (target) => {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
};

const copyItem = async (src, dest) => {
  const stats = await fs.stat(src);
  await fs.rm(dest, { recursive: true, force: true });

  if (stats.isDirectory()) {
    await fs.cp(src, dest, { recursive: true, force: true });
    return;
  }

  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
};

await fs.mkdir(distDir, { recursive: true });

for (const item of itemsToCopy) {
  const src = path.join(rootDir, item);
  if (!(await pathExists(src))) {
    continue;
  }
  const dest = path.join(distDir, item);
  await copyItem(src, dest);
}

const aiFlowSrc = path.join(distDir, "ai-flow");
const aiFlowDest = path.join(distDir, "dist", "ai-flow");

if (await pathExists(aiFlowSrc)) {
  await fs.rm(path.join(distDir, "dist"), { recursive: true, force: true });
  await fs.mkdir(path.dirname(aiFlowDest), { recursive: true });
  await fs.cp(aiFlowSrc, aiFlowDest, { recursive: true, force: true });
}
