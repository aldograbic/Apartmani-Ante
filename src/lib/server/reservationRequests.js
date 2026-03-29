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

export async function readReservationRequests() {
  if (hasDatabase()) {
    await ensureDatabaseSchema();
    const sql = getSql();
    const rows = await sql`
      SELECT
        id,
        apartment_id AS "apartmentId",
        apartment_name AS "apartmentName",
        check_in::text AS "checkIn",
        check_out::text AS "checkOut",
        name,
        email,
        phone,
        adults,
        children,
        arrival_time AS "arrivalTime",
        comment,
        status,
        created_at AS "createdAt"
      FROM reservation_requests
      ORDER BY created_at DESC
    `;

    return rows.map((row) => ({
      id: row.id,
      apartmentId: row.apartmentId,
      apartmentName: row.apartmentName,
      checkIn: row.checkIn,
      checkOut: row.checkOut,
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      adults: Number(row.adults || 0),
      children: Number(row.children || 0),
      arrivalTime: row.arrivalTime || "",
      comment: row.comment || "",
      status: row.status || "new",
      createdAt:
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : String(row.createdAt || ""),
    }));
  }

  const requests = await readRequestsFromJson();

  return requests
    .map((request) => ({
      id: request.id,
      apartmentId: request.apartmentId,
      apartmentName: request.apartmentName || "",
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      name: request.name || "",
      email: request.email || "",
      phone: request.phone || "",
      adults: Number(request.adults || 0),
      children: Number(request.children || 0),
      arrivalTime: request.arrivalTime || "",
      comment: request.comment || "",
      status: request.status || "new",
      createdAt: request.createdAt || "",
    }))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
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
