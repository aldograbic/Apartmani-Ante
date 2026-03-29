import { fail, redirect } from "@sveltejs/kit";
import {
  AUTH_COOKIE_NAME,
  getAdminCredentials,
  getSessionCookieValue,
  isValidCredential,
} from "$lib/server/auth";
import {
  assertHoneypotEmpty,
  assertSameOrigin,
  enforceRateLimit,
  getClientAddress,
} from "$lib/server/security";

export const actions = {
  default: async (event) => {
    const { cookies, request, url } = event;
    const clientAddress = getClientAddress(event);

    try {
      assertSameOrigin(event);
      enforceRateLimit({
        key: `login:${clientAddress}`,
        limit: 5,
        windowMs: 15 * 60 * 1000,
        message: "Previše pokušaja prijave. Pokušajte ponovno za 15 minuta.",
      });
    } catch (error) {
      return fail(error.status || 400, {
        error:
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
        error: "Zahtjev je odbijen.",
      });
    }
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");
    const next = url.searchParams.get("next") || "/dashboard";
    const credentials = getAdminCredentials();

    const usernameValid = isValidCredential(username, credentials.username);
    const passwordValid = isValidCredential(password, credentials.password);

    if (!usernameValid || !passwordValid) {
      return fail(400, {
        error: "Neispravno korisničko ime ili lozinka.",
        username,
      });
    }

    cookies.set(AUTH_COOKIE_NAME, getSessionCookieValue(), {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: url.protocol === "https:",
      maxAge: 60 * 60 * 24 * 30,
    });

    throw redirect(303, next.startsWith("/") ? next : "/dashboard");
  },
};
