import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const REQUESTS_FILE = path.join(DATA_DIRECTORY, "reservation-requests.json");

async function ensureRequestsFile() {
  try {
    await readFile(REQUESTS_FILE, "utf8");
  } catch {
    await mkdir(DATA_DIRECTORY, { recursive: true });
    await writeFile(REQUESTS_FILE, "[]\n", "utf8");
  }
}

async function readRequests() {
  await ensureRequestsFile();
  const contents = await readFile(REQUESTS_FILE, "utf8");

  try {
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function createReservationRequest(payload) {
  const requests = await readRequests();
  const nextRequest = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  await writeFile(
    REQUESTS_FILE,
    `${JSON.stringify([...requests, nextRequest], null, 2)}\n`,
    "utf8",
  );

  return nextRequest;
}
