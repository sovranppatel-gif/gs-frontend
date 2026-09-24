import axios from "axios";
import { API_URL } from "../utils/api.js";
import { getMasterAdminToken } from "../utils/masterAdminAuth.js";

const heroLeftApi = axios.create({
  baseURL: `${API_URL}/api/hero-left`,
  headers: { "Content-Type": "application/json" },
});

heroLeftApi.interceptors.request.use((config) => {
  const token = getMasterAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function extractError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export async function fetchHeroLeftList(params = {}) {
  try {
    const response = await heroLeftApi.get("/", { params });
    return response.data?.data || { rows: [], pagination: {} };
  } catch (error) {
    throw new Error(extractError(error, "Unable to load hero left sections"));
  }
}

export async function fetchActiveHeroLeft() {
  try {
    const response = await heroLeftApi.get("/active");
    return response.data?.data || null;
  } catch (error) {
    throw new Error(extractError(error, "Unable to load active hero left section"));
  }
}

export async function createHeroLeft(payload) {
  try {
    const response = await heroLeftApi.post("/", payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to create hero left section"));
  }
}

export async function updateHeroLeft(id, payload) {
  try {
    const response = await heroLeftApi.put(`/${id}`, payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to update hero left section"));
  }
}

export async function removeHeroLeft(id) {
  try {
    await heroLeftApi.delete(`/${id}`);
    return true;
  } catch (error) {
    throw new Error(extractError(error, "Unable to delete hero left section"));
  }
}

export async function toggleHeroLeftVisibility(id) {
  try {
    const response = await heroLeftApi.patch(`/toggle/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle visibility"));
  }
}

export async function toggleHeroLeftPublish(id) {
  try {
    const response = await heroLeftApi.patch(`/publish/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle publish status"));
  }
}

/** Multipart upload — use fetch so boundary is set correctly */
export async function uploadHeroLeftAvatar(file) {
  if (!file || !(file instanceof Blob)) {
    throw new Error("Choose an image file");
  }
  const formData = new FormData();
  formData.append("file", file);
  const token = getMasterAdminToken();
  try {
    const response = await fetch(`${API_URL}/api/hero-left/upload-avatar`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(json.message || "Unable to upload image");
    }
    const url = json.data?.url;
    if (!url) throw new Error("Upload response missing URL");
    return url;
  } catch (error) {
    throw new Error(error.message || "Unable to upload image");
  }
}
