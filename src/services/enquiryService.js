import { API_URL } from "../utils/api.js";
import { getMasterAdminToken } from "../utils/masterAdminAuth.js";

function buildUrl(path = "") {
  return `${API_URL}/api/enquiries${path}`;
}

function authHeaders() {
  const token = getMasterAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function addEnquiry(payload) {
  const url = buildUrl();
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[enquiries] network error:", url, err);
    throw new Error(
      "Could not reach the server. Make sure the backend is running on port 3000."
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    console.error("[enquiries] API error:", response.status, data);
    throw new Error(data.message || "Unable to submit enquiry");
  }

  if (import.meta.env.DEV && data.entry?._id) {
    console.log("[enquiries] saved to server:", data.entry._id);
  }

  return data.entry;
}

export async function getEnquiries() {
  const response = await fetch(buildUrl(), {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to load enquiries");
  }
  return Array.isArray(data.rows) ? data.rows : [];
}

/** Master admin: create entry via POST /api/enquiries/admin */
export async function createEnquiryAdmin(payload) {
  const response = await fetch(buildUrl("/admin"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to create enquiry");
  }
  return data.entry;
}

export async function updateEnquiry(id, payload) {
  const response = await fetch(buildUrl(`/${encodeURIComponent(id)}`), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to update enquiry");
  }
  return data.entry;
}

export async function deleteEnquiry(id) {
  const response = await fetch(buildUrl(`/${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to delete enquiry");
  }
}

/** Convert an existing enquiry into a lead (idempotent if already linked). */
export async function convertEnquiryToLead(id) {
  const response = await fetch(
    buildUrl(`/${encodeURIComponent(id)}/convert-to-lead`),
    {
      method: "POST",
      headers: authHeaders(),
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to convert enquiry to lead");
  }
  return data;
}
