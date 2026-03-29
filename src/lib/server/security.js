const rateLimitStore = new Map();

function now() {
  return Date.now();
}

function cleanupExpiredEntries(currentTime) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= currentTime) {
      rateLimitStore.delete(key);
    }
  }
}

export function getClientAddress(event) {
  const forwardedFor = event.request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return event.getClientAddress?.() || "unknown";
}

export function assertSameOrigin(event) {
  const origin = event.request.headers.get("origin");

  if (origin && origin !== event.url.origin) {
    throw new Error("Neispravan izvor zahtjeva.");
  }
}

export function assertHoneypotEmpty(formData, fieldName = "company") {
  if (String(formData.get(fieldName) || "").trim()) {
    throw new Error("Zahtjev je odbijen.");
  }
}

export function enforceRateLimit({
  key,
  limit,
  windowMs,
  message = "Previše pokušaja. Pokušajte ponovno malo kasnije.",
}) {
  const currentTime = now();
  cleanupExpiredEntries(currentTime);

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= currentTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: currentTime + windowMs,
    });
    return;
  }

  if (entry.count >= limit) {
    const error = new Error(message);
    error.status = 429;
    throw error;
  }

  entry.count += 1;
}
