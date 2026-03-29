import { neon } from "@neondatabase/serverless";
import { env } from "$env/dynamic/private";

let sqlClient;
let schemaReadyPromise;

function getConnectionString() {
  return env.DATABASE_URL || env.NEON_DATABASE_URL || "";
}

export function hasDatabase() {
  return Boolean(getConnectionString());
}

export function getSql() {
  if (!sqlClient) {
    const connectionString = getConnectionString();

    if (!connectionString) {
      throw new Error("Missing DATABASE_URL for Neon/Postgres connection.");
    }

    sqlClient = neon(connectionString);
  }

  return sqlClient;
}

export async function ensureDatabaseSchema() {
  if (!hasDatabase()) {
    return;
  }

  if (!schemaReadyPromise) {
    const sql = getSql();
    schemaReadyPromise = (async () => {
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
    })();
  }

  await schemaReadyPromise;
}
