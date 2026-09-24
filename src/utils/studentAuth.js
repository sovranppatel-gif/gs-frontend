// Student JWT session helpers

const TOKEN_KEY = "__student_token__";
const SESSION_KEY = "__student_session__";

export function getStudentToken() {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  return raw.trim().replace(/^["']|["']$/g, "") || null;
}

export function decodeStudentJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

export function getStudentSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isStudentLoggedIn() {
  const token = getStudentToken();
  if (token) {
    const payload = decodeStudentJwtPayload(token);
    if (payload?.role === "student" && payload.exp && payload.exp * 1000 > Date.now()) {
      return true;
    }
    // Expired token — clear
    clearStudentSession();
    return false;
  }
  // Legacy local-only session fallback (pre-JWT)
  const session = getStudentSession();
  return Boolean(session?.loggedIn);
}

export function persistStudentSession({ token, user }) {
  if (token) {
    const clean =
      typeof token === "string" ? token.trim().replace(/^["']|["']$/g, "") : "";
    if (clean) localStorage.setItem(TOKEN_KEY, clean);
  }
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user?.email,
      name: user?.name || "Student",
      mobile: user?.mobile || null,
      promoCode: user?.promoCode || null,
      loggedIn: true,
      timestamp: Date.now(),
    })
  );
}

export function clearStudentSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export { TOKEN_KEY, SESSION_KEY };
