import { fail, error } from "@sveltejs/kit";
import { apartments } from "$lib/data/apartments.js";
import { readBookings } from "$lib/server/bookings";
import { sendReservationEmails } from "$lib/server/email.js";
import {
  assertHoneypotEmpty,
  assertSameOrigin,
  enforceRateLimit,
  getClientAddress,
} from "$lib/server/security";
import { createReservationRequest } from "$lib/server/reservationRequests";

function getTodayInZagreb() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Zagreb",
  }).format(new Date());
}

function hasOverlap(existingBookings, checkIn, checkOut) {
  return existingBookings.some(
    (booking) => checkIn < booking.checkOut && checkOut > booking.checkIn,
  );
}

export async function load({ params }) {
  const apartment = apartments.find((item) => item.id === params.slug);

  if (!apartment) {
    throw error(404, "Apartman nije pronađen");
  }

  const bookings = await readBookings();

  return {
    apartment,
    bookings: (bookings[apartment.id] || []).map((booking) => ({
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    })),
  };
}

export const actions = {
  reserve: async (event) => {
    const { params, request } = event;
    const apartment = apartments.find((item) => item.id === params.slug);

    if (!apartment) {
      throw error(404, "Apartman nije pronađen");
    }

    try {
      assertSameOrigin(event);
      enforceRateLimit({
        key: `reservation:${getClientAddress(event)}:${apartment.id}`,
        limit: 5,
        windowMs: 60 * 60 * 1000,
        message: "Poslali ste previše rezervacijskih upita. Pokušajte ponovno za sat vremena.",
      });
    } catch (error) {
      return fail(error.status || 400, {
        reservationError:
          error instanceof Error
            ? error.message
            : "Zahtjev je odbijen.",
      });
    }

    const formData = await request.formData();
    try {
      assertHoneypotEmpty(formData);
    } catch {
      return fail(400, {
        reservationError: "Zahtjev je odbijen.",
      });
    }
    const checkIn = String(formData.get("checkIn") || "");
    const checkOut = String(formData.get("checkOut") || "");
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const adults = String(formData.get("adults") || "").trim();
    const children = String(formData.get("children") || "").trim();
    const arrivalTime = String(formData.get("arrivalTime") || "").trim();
    const comment = String(formData.get("comment") || "").trim();

    if (!checkIn || !checkOut) {
      return fail(400, {
        reservationError: "Odaberite datum dolaska i odlaska.",
      });
    }

    if (checkOut <= checkIn) {
      return fail(400, {
        reservationError: "Datum odlaska mora biti nakon datuma dolaska.",
      });
    }

    if (checkIn < getTodayInZagreb()) {
      return fail(400, {
        reservationError:
          "Nije moguće rezervirati datume prije današnjeg dana.",
      });
    }

    if (!name || !email || !phone) {
      return fail(400, {
        reservationError: "Ime, email i telefon su obavezni.",
      });
    }

    if (!adults || children === "") {
      return fail(400, {
        reservationError: "Odaberite broj odraslih i broj djece.",
      });
    }

    const bookings = await readBookings();
    const apartmentBookings = bookings[apartment.id] || [];

    if (hasOverlap(apartmentBookings, checkIn, checkOut)) {
      return fail(400, {
        reservationError: "Odabrani termin više nije dostupan.",
      });
    }

    const reservationRequest = await createReservationRequest({
      apartmentId: apartment.id,
      apartmentName: apartment.name,
      checkIn,
      checkOut,
      name,
      email,
      phone,
      adults,
      children,
      arrivalTime,
      comment,
      status: "new",
    });

    let reservationNotice = "";

    try {
      await sendReservationEmails(reservationRequest);
    } catch (mailError) {
      console.error("Failed to send reservation emails", mailError);
      reservationNotice =
        "Upit je zaprimljen, ali potvrda e-mailom trenutno nije poslana.";
    }

    return {
      reservationSuccess: "Upit je poslan. Javit ćemo vam se uskoro.",
      reservationNotice,
    };
  },
};
