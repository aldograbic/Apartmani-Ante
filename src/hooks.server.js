import { redirect } from "@sveltejs/kit";
import {
  AUTH_COOKIE_NAME,
  getAdminCredentials,
  getSessionCookieValue,
  isValidCredential,
} from "$lib/server/auth";

const PROTECTED_ROUTES = ["/dashboard"];
const GUEST_ONLY_ROUTES = ["/login"];

function pathMatches(pathname, routes) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function handle({ event, resolve }) {
  const sessionCookie = event.cookies.get(AUTH_COOKIE_NAME);
  const credentials = getAdminCredentials();
  const expectedSession = getSessionCookieValue();
  const isAuthenticated =
    Boolean(sessionCookie) && isValidCredential(sessionCookie, expectedSession);

  event.locals.user = isAuthenticated
    ? { username: credentials.username }
    : null;

  if (!isAuthenticated && pathMatches(event.url.pathname, PROTECTED_ROUTES)) {
    const next = `${event.url.pathname}${event.url.search}`;
    throw redirect(303, `/login?next=${encodeURIComponent(next)}`);
  }

  if (isAuthenticated && pathMatches(event.url.pathname, GUEST_ONLY_ROUTES)) {
    throw redirect(303, "/dashboard");
  }

  return resolve(event);
}
