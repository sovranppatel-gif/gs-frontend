import { API_URL } from "../utils/api.js";
import { getMasterAdminToken } from "../utils/masterAdminAuth.js";

function buildUrl(path = "") {
  return `${API_URL}/api/workshop-registrations${path}`;
}

function authHeaders() {
  const token = getMasterAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function submitWorkshopRegistration(payload) {
  const url = buildUrl();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      console.error("[workshop] API error:", response.status, data);
      throw new Error(data.message || "Unable to submit registration");
    }

    return {
      success: true,
      isDuplicate: data.isDuplicate || false,
      entry: data.entry,
    };
  } catch (err) {
    console.error("[workshop] network error:", url, err);
    throw err;
  }
}

export async function getWorkshopRegistrations(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.referralCode) params.append("referralCode", filters.referralCode);
    if (filters.universityId) params.append("universityId", filters.universityId);
    if (filters.course) params.append("course", filters.course);
    if (filters.semesterYear) params.append("semesterYear", filters.semesterYear);
    if (filters.search) params.append("search", filters.search);

    const url = `${buildUrl()}?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: authHeaders(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to load registrations");
    }

    return Array.isArray(data.rows) ? data.rows : [];
  } catch (err) {
    console.error("[workshop] list error:", err);
    throw err;
  }
}

export async function getWorkshopRegistrationDetail(id) {
  try {
    const response = await fetch(buildUrl(`/${encodeURIComponent(id)}`), {
      method: "GET",
      headers: authHeaders(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to load registration");
    }

    return data.entry;
  } catch (err) {
    console.error("[workshop] detail error:", err);
    throw err;
  }
}

export async function updateWorkshopRegistrationStatus(id, status) {
  try {
    const response = await fetch(buildUrl(`/${encodeURIComponent(id)}/status`), {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to update registration");
    }

    return data.entry;
  } catch (err) {
    console.error("[workshop] update error:", err);
    throw err;
  }
}

export async function deleteWorkshopRegistration(id) {
  try {
    const response = await fetch(buildUrl(`/${encodeURIComponent(id)}`), {
      method: "DELETE",
      headers: authHeaders(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to delete registration");
    }

    return true;
  } catch (err) {
    console.error("[workshop] delete error:", err);
    throw err;
  }
}

export async function getWorkshopReferralSummary() {
  try {
    const response = await fetch(buildUrl("/summary/referral"), {
      method: "GET",
      headers: authHeaders(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to load summary");
    }

    return data.data;
  } catch (err) {
    console.error("[workshop] summary error:", err);
    throw err;
  }
}

export async function createReferralLink(payload) {
  try {
    const response = await fetch(buildUrl("/referral-links"), {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to create referral link");
    }

    return data.entry;
  } catch (err) {
    console.error("[workshop] referral link create error:", err);
    throw err;
  }
}

export async function updateReferralLink(id, payload) {
  const response = await fetch(buildUrl(`/referral-links/${encodeURIComponent(id)}`), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) throw new Error(data.message || "Unable to update referral link");
  return data.entry;
}

export async function getReferralLinkByCode(code) {
  const response = await fetch(buildUrl(`/referral-links/${encodeURIComponent(code)}`));
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) throw new Error(data.message || "Unable to load workshop details");
  return data.entry;
}

export async function getReferralLinks() {
  try {
    const response = await fetch(buildUrl("/referral-links"), {
      method: "GET",
      headers: authHeaders(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to load referral links");
    }

    return Array.isArray(data.rows) ? data.rows : [];
  } catch (err) {
    console.error("[workshop] referral link list error:", err);
    throw err;
  }
}

export async function deleteReferralLink(id) {
  try {
    const response = await fetch(buildUrl(`/referral-links/${encodeURIComponent(id)}`), {
      method: "DELETE",
      headers: authHeaders(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to delete referral link");
    }

    return true;
  } catch (err) {
    console.error("[workshop] referral link delete error:", err);
    throw err;
  }
}

export async function getActiveColleges() {
  try {
    const response = await fetch(buildUrl("/colleges/active"), {
      method: "GET",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to load colleges");
    }

    return Array.isArray(data.rows) ? data.rows : [];
  } catch (err) {
    console.error("[workshop] colleges error:", err);
    throw err;
  }
}

export async function getWorkshopMetadata() {
  try {
    const response = await fetch(buildUrl("/metadata/all"), {
      method: "GET",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to load metadata");
    }

    return data.data;
  } catch (err) {
    console.error("[workshop] metadata error:", err);
    throw err;
  }
}
