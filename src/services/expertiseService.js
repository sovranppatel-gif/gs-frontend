import axios from "axios";
import { API_URL } from "../utils/api.js";
import { getMasterAdminToken } from "../utils/masterAdminAuth.js";

const expertiseApi = axios.create({
  baseURL: `${API_URL}/api/expertise`,
  headers: { "Content-Type": "application/json" },
});

expertiseApi.interceptors.request.use((config) => {
  const token = getMasterAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function extractError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export async function fetchExpertiseList(params = {}) {
  try {
    const response = await expertiseApi.get("/", { params });
    return response.data?.data || { rows: [], pagination: {} };
  } catch (error) {
    throw new Error(extractError(error, "Unable to load expertise sections"));
  }
}

export async function fetchActiveExpertise() {
  try {
    const response = await expertiseApi.get("/active");
    return response.data?.data || null;
  } catch (error) {
    throw new Error(extractError(error, "Unable to load active expertise section"));
  }
}

export async function createExpertise(payload) {
  try {
    const response = await expertiseApi.post("/", payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to create expertise section"));
  }
}

export async function updateExpertise(id, payload) {
  try {
    const response = await expertiseApi.put(`/${id}`, payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to update expertise section"));
  }
}

export async function removeExpertise(id) {
  try {
    await expertiseApi.delete(`/${id}`);
    return true;
  } catch (error) {
    throw new Error(extractError(error, "Unable to delete expertise section"));
  }
}

export async function toggleExpertiseVisibility(id) {
  try {
    const response = await expertiseApi.patch(`/toggle/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle visibility"));
  }
}

export async function toggleExpertisePublish(id) {
  try {
    const response = await expertiseApi.patch(`/publish/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle publish status"));
  }
}
