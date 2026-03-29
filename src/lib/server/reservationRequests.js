import { randomUUID } from "node:crypto";
import {
  readRuntimeJsonFile,
  writeRuntimeJsonFile,
} from "$lib/server/storage.js";
import {
  ensureDatabaseSchema,
  getSql,
  hasDatabase,
} from "$lib/server/db.js";

const REQUESTS_FILE = "reservation-requests.json";

async function readRequestsFromJson() {
  const contents = await readRuntimeJsonFile(REQUESTS_FILE, "[]\n");

  try {
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function createReservationRequest(payload) {
  const nextRequest = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  if (hasDatabase()) {
    await ensureDatabaseSchema();
    const sql = getSql();

    await sql`
      INSERT INTO reservation_requests (
        id,
        apartment_id,
        apartment_name,
        check_in,
        check_out,
        name,
        email,
        phone,
        adults,
        children,
        arrival_time,
        comment,
        status,
        created_at
      ) VALUES (
        ${nextRequest.id},
        ${nextRequest.apartmentId},
        ${nextRequest.apartmentName},
        ${nextRequest.checkIn},
        ${nextRequest.checkOut},
        ${nextRequest.name},
        ${nextRequest.email},
        ${nextRequest.phone},
        ${Number(nextRequest.adults)},
        ${Number(nextRequest.children)},
        ${nextRequest.arrivalTime || ""},
        ${nextRequest.comment || ""},
        ${nextRequest.status || "new"},
        ${nextRequest.createdAt}
      )
    `;

    return nextRequest;
  }

  const requests = await readRequestsFromJson();
  await writeRuntimeJsonFile(
    REQUESTS_FILE,
    `${JSON.stringify([...requests, nextRequest], null, 2)}\n`,
    "[]\n",
  );

  return nextRequest;
}
