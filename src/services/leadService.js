import { API_URL } from "../utils/api.js";
import { getMasterAdminToken } from "../utils/masterAdminAuth.js";

function buildUrl(path = "") {
  return `${API_URL}/api/leads${path}`;
}

function authHeaders() {
  const token = getMasterAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export async function getLeads({ search = "", status = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  const qs = params.toString();
  const response = await fetch(buildUrl(qs ? `?${qs}` : ""), {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await parseJson(response);
  return {
    rows: Array.isArray(data.rows) ? data.rows : [],
    stats: data.stats || null,
  };
}

export async function createLead(payload) {
  const response = await fetch(buildUrl(), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJson(response);
  return data.entry;
}

export async function updateLead(id, payload) {
  const response = await fetch(buildUrl(`/${encodeURIComponent(id)}`), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJson(response);
  return data.entry;
}

export async function deleteLead(id) {
  const response = await fetch(buildUrl(`/${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  await parseJson(response);
}
