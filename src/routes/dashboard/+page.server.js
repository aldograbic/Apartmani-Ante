import { fail, redirect } from "@sveltejs/kit";
import { apartments } from "$lib/data/apartments.js";
import { AUTH_COOKIE_NAME } from "$lib/server/auth";
import {
  addBooking,
  countUpcomingBookings,
  readBookings,
  removeBooking,
} from "$lib/server/bookings";
import { readReservationRequests } from "$lib/server/reservationRequests";

export const actions = {
  addBooking: async ({ request }) => {
    const formData = await request.formData();
    const apartmentId = String(formData.get("apartmentId") || "");
    const checkIn = String(formData.get("checkIn") || "");
    const checkOut = String(formData.get("checkOut") || "");
    const guestName = String(formData.get("guestName") || "");
    const note = String(formData.get("note") || "");

    if (!apartmentId || !checkIn || !checkOut) {
      return fail(400, {
        bookingError: "Odaberite apartman, datum dolaska i datum odlaska.",
      });
    }

    if (checkOut <= checkIn) {
      return fail(400, {
        bookingError: "Datum odlaska mora biti nakon datuma dolaska.",
      });
    }

    if (!apartments.some((apartment) => apartment.id === apartmentId)) {
      return fail(400, {
        bookingError: "Odabrani apartman ne postoji.",
      });
    }

    try {
      await addBooking({
        apartmentId,
        checkIn,
        checkOut,
        guestName,
        note,
      });
    } catch (error) {
      return fail(400, {
        bookingError:
          error instanceof Error
            ? error.message
            : "Rezervaciju trenutno nije moguce spremiti.",
      });
    }

    return { bookingSuccess: "Rezervacija je spremljena." };
  },
  deleteBooking: async ({ request }) => {
    const formData = await request.formData();
    const apartmentId = String(formData.get("apartmentId") || "");
    const bookingId = String(formData.get("bookingId") || "");

    if (!apartmentId || !bookingId) {
      return fail(400, {
        bookingError: "Nedostaje rezervacija za uklanjanje.",
      });
    }

    await removeBooking(apartmentId, bookingId);

    return { bookingSuccess: "Rezervacija je uklonjena." };
  },
  logout: async ({ cookies }) => {
    cookies.delete(AUTH_COOKIE_NAME, { path: "/" });
    throw redirect(303, "/login");
  },
};

export async function load({ locals }) {
  const bookingsByApartment = await readBookings();
  const reservationRequests = await readReservationRequests();

  return {
    user: locals.user,
    apartments: apartments.map((apartment) => ({
      ...apartment,
      bookings: bookingsByApartment[apartment.id] || [],
    })),
    reservationRequests,
    stats: {
      apartmentCount: apartments.length,
      upcomingBookings: countUpcomingBookings(bookingsByApartment),
      reservationRequestCount: reservationRequests.length,
    },
  };
}
