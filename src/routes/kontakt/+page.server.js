import { fail } from "@sveltejs/kit";
import { sendContactEmail } from "$lib/server/email.js";
import {
  assertHoneypotEmpty,
  assertSameOrigin,
  enforceRateLimit,
  getClientAddress,
} from "$lib/server/security";

export const actions = {
  default: async (event) => {
    const { request } = event;

    try {
      assertSameOrigin(event);
      enforceRateLimit({
        key: `contact:${getClientAddress(event)}`,
        limit: 5,
        windowMs: 60 * 60 * 1000,
        message: "Poslali ste previše upita. Pokušajte ponovno za sat vremena.",
      });
    } catch (error) {
      return fail(error.status || 400, {
        errorMessage:
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
        errorMessage: "Zahtjev je odbijen.",
      });
    }
    const ime = String(formData.get("ime") || "").trim();
    const prezime = String(formData.get("prezime") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const telefon = String(formData.get("telefon") || "").trim();
    const apartman = String(formData.get("apartman") || "").trim();
    const dolazak = String(formData.get("dolazak") || "").trim();
    const odlazak = String(formData.get("odlazak") || "").trim();
    const osobe = String(formData.get("osobe") || "").trim();
    const poruka = String(formData.get("poruka") || "").trim();

    if (!ime || !prezime || !email) {
      return fail(400, {
        errorMessage: "Ime, prezime i email su obavezni.",
      });
    }

    try {
      await sendContactEmail({
        ime,
        prezime,
        email,
        telefon,
        apartman,
        dolazak,
        odlazak,
        osobe,
        poruka,
      });
    } catch (error) {
      console.error("Failed to send contact email", error);

      return fail(500, {
        errorMessage:
          "Došlo je do greške pri slanju poruke. Pokušajte ponovno ili nam se javite e-mailom.",
      });
    }

    return {
      successMessage: "Poruka je uspješno poslana. Javit ćemo vam se uskoro.",
    };
  },
};
