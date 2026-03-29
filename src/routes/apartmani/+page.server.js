import { readBookings } from "$lib/server/bookings";

export async function load() {
  const bookingsByApartment = await readBookings();

  return {
    bookingsByApartment: Object.fromEntries(
      Object.entries(bookingsByApartment).map(([apartmentId, bookings]) => [
        apartmentId,
        bookings.map((booking) => ({
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
        })),
      ]),
    ),
  };
}
