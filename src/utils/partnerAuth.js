// Frontend-only partner session (server auth later)

const SESSION_KEY = "__partner_session__";

export function getPartnerSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isPartnerLoggedIn() {
  const session = getPartnerSession();
  return Boolean(session?.loggedIn);
}

export function persistPartnerSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user?.email,
      name: user?.name || "Partner",
      loggedIn: true,
      timestamp: Date.now(),
    })
  );
}

export function clearPartnerSession() {
  localStorage.removeItem(SESSION_KEY);
}

export { SESSION_KEY };
