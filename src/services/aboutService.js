import axios from "axios";
import { API_URL } from "../utils/api.js";
import { getMasterAdminToken } from "../utils/masterAdminAuth.js";

const aboutApi = axios.create({
  baseURL: `${API_URL}/api/about`,
  headers: { "Content-Type": "application/json" },
});

aboutApi.interceptors.request.use((config) => {
  const token = getMasterAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function extractError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export async function fetchAboutList(params = {}) {
  try {
    const response = await aboutApi.get("/", { params });
    return response.data?.data || { rows: [], pagination: {} };
  } catch (error) {
    throw new Error(extractError(error, "Unable to load about sections"));
  }
}

export async function fetchActiveAbout() {
  try {
    const response = await aboutApi.get("/active");
    return response.data?.data || null;
  } catch (error) {
    throw new Error(extractError(error, "Unable to load active about section"));
  }
}

export async function createAbout(payload) {
  try {
    const response = await aboutApi.post("/", payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to create about section"));
  }
}

export async function updateAbout(id, payload) {
  try {
    const response = await aboutApi.put(`/${id}`, payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to update about section"));
  }
}

export async function removeAbout(id) {
  try {
    await aboutApi.delete(`/${id}`);
    return true;
  } catch (error) {
    throw new Error(extractError(error, "Unable to delete about section"));
  }
}

export async function toggleAboutVisibility(id) {
  try {
    const response = await aboutApi.patch(`/toggle/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle visibility"));
  }
}

export async function toggleAboutPublish(id) {
  try {
    const response = await aboutApi.patch(`/publish/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle publish status"));
  }
}
