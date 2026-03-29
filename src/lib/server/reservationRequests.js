import { randomUUID } from "node:crypto";
import {
  readRuntimeJsonFile,
  writeRuntimeJsonFile,
} from "$lib/server/storage.js";

const REQUESTS_FILE = "reservation-requests.json";

async function readRequests() {
  const contents = await readRuntimeJsonFile(REQUESTS_FILE, "[]\n");

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

  await writeRuntimeJsonFile(
    REQUESTS_FILE,
    `${JSON.stringify([...requests, nextRequest], null, 2)}\n`,
    "[]\n",
  );

  return nextRequest;
}
