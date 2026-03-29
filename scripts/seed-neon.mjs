import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");

function parseEnvValue(value) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

async function loadLocalEnvFile() {
  const envPath = path.join(rootDir, ".env");

  try {
    const contents = await readFile(envPath, "utf8");

    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1);

      if (!key || process.env[key] !== undefined) {
        continue;
      }

      process.env[key] = parseEnvValue(value);
    }
  } catch {
    // Ignore missing local .env file and rely on existing environment variables.
  }
}

await loadLocalEnvFile();

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL or NEON_DATABASE_URL.");
  process.exit(1);
}

const sql = neon(connectionString);

async function readJson(relativePath, fallback) {
  try {
    const contents = await readFile(path.join(dataDir, relativePath), "utf8");
    return JSON.parse(contents);
  } catch {
    return fallback;
  }
}

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      apartment_id TEXT NOT NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      guest_name TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS bookings_apartment_check_in_idx
    ON bookings (apartment_id, check_in)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reservation_requests (
      id TEXT PRIMARY KEY,
      apartment_id TEXT NOT NULL,
      apartment_name TEXT NOT NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      adults INTEGER NOT NULL,
      children INTEGER NOT NULL,
      arrival_time TEXT NOT NULL DEFAULT '',
      comment TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS reservation_requests_apartment_created_idx
    ON reservation_requests (apartment_id, created_at DESC)
  `;
}

async function seedBookings() {
  const bookingsByApartment = await readJson("bookings.json", {});
  let inserted = 0;

  for (const [apartmentId, bookings] of Object.entries(bookingsByApartment)) {
    if (!Array.isArray(bookings)) {
      continue;
    }

    for (const booking of bookings) {
      if (!booking?.id || !booking?.checkIn || !booking?.checkOut) {
        continue;
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
          ${booking.id},
          ${apartmentId},
          ${booking.checkIn},
          ${booking.checkOut},
          ${booking.guestName || ""},
          ${booking.note || ""},
          ${booking.createdAt || new Date().toISOString()}
        )
        ON CONFLICT (id) DO NOTHING
      `;
      inserted += 1;
    }
  }

  return inserted;
}

async function seedReservationRequests() {
  const requests = await readJson("reservation-requests.json", []);
  let inserted = 0;

  for (const request of Array.isArray(requests) ? requests : []) {
    if (!request?.id || !request?.apartmentId || !request?.checkIn || !request?.checkOut) {
      continue;
    }

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
        ${request.id},
        ${request.apartmentId},
        ${request.apartmentName || ""},
        ${request.checkIn},
        ${request.checkOut},
        ${request.name || ""},
        ${request.email || ""},
        ${request.phone || ""},
        ${Number(request.adults || 0)},
        ${Number(request.children || 0)},
        ${request.arrivalTime || ""},
        ${request.comment || ""},
        ${request.status || "new"},
        ${request.createdAt || new Date().toISOString()}
      )
      ON CONFLICT (id) DO NOTHING
    `;
    inserted += 1;
  }

  return inserted;
}

async function main() {
  await ensureSchema();
  const bookings = await seedBookings();
  const requests = await seedReservationRequests();

  console.log(`Seed complete. Processed ${bookings} bookings and ${requests} reservation requests.`);
}

main().catch((error) => {
  console.error("Failed to seed Neon database.");
  console.error(error);
  process.exit(1);
});
