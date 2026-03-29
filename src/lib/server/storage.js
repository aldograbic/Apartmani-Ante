import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const isVercel = process.env.VERCEL === "1";
const bundledDataDirectory = path.join(process.cwd(), "data");
const runtimeDataDirectory = isVercel
  ? path.join(tmpdir(), "apartmani-ante-data")
  : bundledDataDirectory;

function getBundledFilePath(filename) {
  return path.join(bundledDataDirectory, filename);
}

function getRuntimeFilePath(filename) {
  return path.join(runtimeDataDirectory, filename);
}

export async function ensureRuntimeJsonFile(filename, fallbackContents) {
  const runtimeFile = getRuntimeFilePath(filename);

  try {
    await readFile(runtimeFile, "utf8");
    return runtimeFile;
  } catch {
    await mkdir(runtimeDataDirectory, { recursive: true });

    const bundledFile = getBundledFilePath(filename);
    const initialContents = existsSync(bundledFile)
      ? await readFile(bundledFile, "utf8")
      : fallbackContents;

    await writeFile(runtimeFile, initialContents, "utf8");
    return runtimeFile;
  }
}

export async function readRuntimeJsonFile(filename, fallbackContents) {
  const filePath = await ensureRuntimeJsonFile(filename, fallbackContents);
  return readFile(filePath, "utf8");
}

export async function writeRuntimeJsonFile(filename, contents, fallbackContents) {
  const filePath = await ensureRuntimeJsonFile(filename, fallbackContents);
  await writeFile(filePath, contents, "utf8");
  return filePath;
}
