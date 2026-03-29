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

const BOOKINGS_FILE = "bookings.json";

function normalizeBookings(rawData) {
  if (!rawData || typeof rawData !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(rawData).map(([apartmentId, bookings]) => [
      apartmentId,
      Array.isArray(bookings)
        ? bookings
            .filter(
              (booking) =>
                booking &&
                typeof booking.id === "string" &&
                typeof booking.checkIn === "string" &&
                typeof booking.checkOut === "string",
            )
            .sort((left, right) => left.checkIn.localeCompare(right.checkIn))
        : [],
    ]),
  );
}

async function readBookingsFromJson() {
  const fileContents = await readRuntimeJsonFile(BOOKINGS_FILE, "{}\n");

  try {
    return normalizeBookings(JSON.parse(fileContents));
  } catch {
    return {};
  }
}

async function writeBookingsToJson(data) {
  await writeRuntimeJsonFile(
    BOOKINGS_FILE,
    `${JSON.stringify(data, null, 2)}\n`,
    "{}\n",
  );
}

async function readBookingsFromDatabase() {
  await ensureDatabaseSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT
      id,
      apartment_id AS "apartmentId",
      check_in::text AS "checkIn",
      check_out::text AS "checkOut",
      guest_name AS "guestName",
      note,
      created_at AS "createdAt"
    FROM bookings
    ORDER BY apartment_id ASC, check_in ASC, created_at ASC
  `;

  return rows.reduce((grouped, row) => {
    const apartmentBookings = grouped[row.apartmentId] || [];
    apartmentBookings.push({
      id: row.id,
      checkIn: row.checkIn,
      checkOut: row.checkOut,
      guestName: row.guestName || "",
      note: row.note || "",
      createdAt:
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : String(row.createdAt || ""),
    });
    grouped[row.apartmentId] = apartmentBookings;
    return grouped;
  }, {});
}

function hasOverlap(existingBookings, nextBooking) {
  return existingBookings.some(
    (booking) =>
      nextBooking.checkIn < booking.checkOut && nextBooking.checkOut > booking.checkIn,
  );
}

export async function readBookings() {
  if (hasDatabase()) {
    return readBookingsFromDatabase();
  }

  return readBookingsFromJson();
}

export async function addBooking({
  apartmentId,
  checkIn,
  checkOut,
  guestName = "",
  note = "",
}) {
  const nextBooking = {
    id: randomUUID(),
    checkIn,
    checkOut,
    guestName: guestName.trim(),
    note: note.trim(),
    createdAt: new Date().toISOString(),
  };

  if (hasDatabase()) {
    await ensureDatabaseSchema();
    const sql = getSql();
    const overlapping = await sql`
      SELECT id
      FROM bookings
      WHERE apartment_id = ${apartmentId}
        AND ${checkIn} < check_out
        AND ${checkOut} > check_in
      LIMIT 1
    `;

    if (overlapping.length > 0) {
      throw new Error("Odabrani termin se preklapa s postojecom rezervacijom.");
    }

    await sql`
      INSERT INTO bookings (
        id,
        apartment_id,
        check_in,
        check_out,
        guest_name,
        note,
        created_at
      ) VALUES (
        ${nextBooking.id},
        ${apartmentId},
        ${checkIn},
        ${checkOut},
        ${nextBooking.guestName},
        ${nextBooking.note},
        ${nextBooking.createdAt}
      )
    `;

    return nextBooking;
  }

  const bookings = await readBookingsFromJson();
  const apartmentBookings = bookings[apartmentId] || [];

  if (hasOverlap(apartmentBookings, nextBooking)) {
    throw new Error("Odabrani termin se preklapa s postojecom rezervacijom.");
  }

  const nextBookings = {
    ...bookings,
    [apartmentId]: [...apartmentBookings, nextBooking].sort((left, right) =>
      left.checkIn.localeCompare(right.checkIn),
    ),
  };

  await writeBookingsToJson(nextBookings);

  return nextBooking;
}

export async function removeBooking(apartmentId, bookingId) {
  if (hasDatabase()) {
    await ensureDatabaseSchema();
    const sql = getSql();
    await sql`
      DELETE FROM bookings
      WHERE apartment_id = ${apartmentId}
        AND id = ${bookingId}
    `;
    return;
  }

  const bookings = await readBookingsFromJson();
  const apartmentBookings = bookings[apartmentId] || [];

  const nextBookings = {
    ...bookings,
    [apartmentId]: apartmentBookings.filter((booking) => booking.id !== bookingId),
  };

  await writeBookingsToJson(nextBookings);
}

export function countUpcomingBookings(bookingsByApartment) {
  const today = new Date().toISOString().slice(0, 10);

  return Object.values(bookingsByApartment).reduce(
    (count, bookings) =>
      count + bookings.filter((booking) => booking.checkOut >= today).length,
    0,
  );
}
