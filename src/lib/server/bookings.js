import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BOOKINGS_DIRECTORY = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(BOOKINGS_DIRECTORY, "bookings.json");

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

async function ensureBookingsFile() {
  try {
    await readFile(BOOKINGS_FILE, "utf8");
  } catch {
    await mkdir(BOOKINGS_DIRECTORY, { recursive: true });
    await writeFile(BOOKINGS_FILE, "{}\n", "utf8");
  }
}

export async function readBookings() {
  await ensureBookingsFile();
  const fileContents = await readFile(BOOKINGS_FILE, "utf8");

  try {
    return normalizeBookings(JSON.parse(fileContents));
  } catch {
    return {};
  }
}

async function writeBookings(data) {
  await mkdir(BOOKINGS_DIRECTORY, { recursive: true });
  await writeFile(BOOKINGS_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function hasOverlap(existingBookings, nextBooking) {
  return existingBookings.some(
    (booking) =>
      nextBooking.checkIn < booking.checkOut && nextBooking.checkOut > booking.checkIn,
  );
}

export async function addBooking({
  apartmentId,
  checkIn,
  checkOut,
  guestName = "",
  note = "",
}) {
  const bookings = await readBookings();
  const apartmentBookings = bookings[apartmentId] || [];
  const nextBooking = {
    id: randomUUID(),
    checkIn,
    checkOut,
    guestName: guestName.trim(),
    note: note.trim(),
    createdAt: new Date().toISOString(),
  };

  if (hasOverlap(apartmentBookings, nextBooking)) {
    throw new Error("Odabrani termin se preklapa s postojecom rezervacijom.");
  }

  const nextBookings = {
    ...bookings,
    [apartmentId]: [...apartmentBookings, nextBooking].sort((left, right) =>
      left.checkIn.localeCompare(right.checkIn),
    ),
  };

  await writeBookings(nextBookings);

  return nextBooking;
}

export async function removeBooking(apartmentId, bookingId) {
  const bookings = await readBookings();
  const apartmentBookings = bookings[apartmentId] || [];

  const nextBookings = {
    ...bookings,
    [apartmentId]: apartmentBookings.filter((booking) => booking.id !== bookingId),
  };

  await writeBookings(nextBookings);
}

export function countUpcomingBookings(bookingsByApartment) {
  const today = new Date().toISOString().slice(0, 10);

  return Object.values(bookingsByApartment).reduce(
    (count, bookings) =>
      count + bookings.filter((booking) => booking.checkOut >= today).length,
    0,
  );
}
