// Master admin JWT (client checks expiry only; server verifies on API)

const TOKEN_KEY = "__master_admin_token__";
const SESSION_KEY = "__master_admin__";

export function getMasterAdminToken() {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  return raw.trim().replace(/^["']|["']$/g, "") || null;
}

export function decodeMasterAdminJwtPayload(token) {
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

export function isMasterAdminTokenValid() {
  const token = getMasterAdminToken();
  if (!token) return false;
  const payload = decodeMasterAdminJwtPayload(token);
  if (!payload || payload.role !== "master_admin") return false;
  if (!payload.exp) return false;
  return payload.exp * 1000 > Date.now();
}

export function clearMasterAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function persistMasterAdminSession({ token, user }) {
  const clean = typeof token === "string" ? token.trim().replace(/^["']|["']$/g, "") : "";
  if (clean) localStorage.setItem(TOKEN_KEY, clean);
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user?.email,
      name: user?.name || "Master Admin",
      loggedIn: true,
      timestamp: Date.now(),
    })
  );
}

export const MASTER_ADMIN_THEME_KEY = '__master_admin_theme__'

export { TOKEN_KEY, SESSION_KEY };
