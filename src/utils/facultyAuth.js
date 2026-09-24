// Faculty portal session — backed by the real /api/faculties/auth endpoints.
// The JWT is the source of truth; the session blob is just a display cache.
import { API_URL } from "./api.js";

const TOKEN_KEY = "__faculty_token__";
const SESSION_KEY = "__faculty_session__";

export function getFacultyToken() {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  return raw.trim().replace(/^["']|["']$/g, "") || null;
}

function decodeJwtPayload(token) {
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

export function getFacultySession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isFacultyLoggedIn() {
  const token = getFacultyToken();
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload || payload.role !== "faculty") return false;
  if (!payload.exp) return false;
  return payload.exp * 1000 > Date.now();
}

export function persistFacultySession({ token, user }) {
  const clean = typeof token === "string" ? token.trim().replace(/^["']|["']$/g, "") : "";
  if (clean) localStorage.setItem(TOKEN_KEY, clean);
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user?.email,
      name: user?.name || "Faculty",
      facultyId: user?.facultyId || "",
      designation: user?.designation || "",
      loggedIn: true,
      timestamp: Date.now(),
    })
  );
}

export function clearFacultySession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

/**
 * POST /api/faculties/auth/login — throws a readable Error on failure,
 * otherwise persists the session and returns { token, user }.
 */
export async function loginFaculty(identifier, password) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch(`${API_URL}/api/faculties/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: identifier, email: identifier, password }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw new Error("Login timed out. Check your connection and retry.");
    throw new Error("Could not reach the server. Make sure the backend is running.");
  } finally {
    window.clearTimeout(timer);
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Invalid username or password");
  }

  persistFacultySession({ token: result.token, user: result.user });
  return result;
}

export { TOKEN_KEY, SESSION_KEY };
