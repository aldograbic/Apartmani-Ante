import { redirect } from "@sveltejs/kit";
import {
  AUTH_COOKIE_NAME,
  getAdminCredentials,
  getSessionCookieValue,
  isValidCredential,
} from "$lib/server/auth";

const PROTECTED_ROUTES = ["/dashboard"];
const GUEST_ONLY_ROUTES = ["/login"];
const LEGACY_REDIRECTS = {
  "/home": "/",
  "/apartman-1": "/apartmani/apartman-1",
  "/apartman-2": "/apartmani/apartman-2",
  "/studio-apartman": "/apartmani/studio",
  "/en": "/",
  "/en/home": "/",
  "/en/apartments": "/apartmani",
  "/en/apartment-1": "/apartmani/apartman-1",
  "/en/apartment-2": "/apartmani/apartman-2",
  "/en/studio": "/apartmani/studio",
  "/en/studio-apartment": "/apartmani/studio",
  "/en/about-us": "/o-nama",
  "/en/contact": "/kontakt",
};

function pathMatches(pathname, routes) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function handle({ event, resolve }) {
  const legacyPath =
    event.url.pathname.length > 1
      ? event.url.pathname.replace(/\/+$/, "")
      : event.url.pathname;
  const redirectTarget = LEGACY_REDIRECTS[legacyPath];

  if (redirectTarget) {
    throw redirect(308, `${redirectTarget}${event.url.search}`);
  }

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
