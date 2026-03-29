import { createHash, timingSafeEqual } from "node:crypto";
import { env } from "$env/dynamic/private";

export const AUTH_COOKIE_NAME = "apartmani_ante_session";

export function getAdminCredentials() {
  const username = env.ADMIN_USERNAME || "";
  const password = env.ADMIN_PASSWORD || "";
  const secret = env.SESSION_SECRET || "";

  if (!username || !password || !secret) {
    throw new Error(
      "Missing admin auth configuration. Set ADMIN_USERNAME, ADMIN_PASSWORD and SESSION_SECRET in .env.",
    );
  }

  return {
    username,
    password,
    secret,
  };
}

function hashValue(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function createSessionToken(username, password, secret) {
  return hashValue(`${username}:${password}:${secret}`);
}

export function isValidCredential(input, expected) {
  const left = Buffer.from(input || "");
  const right = Buffer.from(expected || "");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function getSessionCookieValue() {
  const { username, password, secret } = getAdminCredentials();
  return createSessionToken(username, password, secret);
}
