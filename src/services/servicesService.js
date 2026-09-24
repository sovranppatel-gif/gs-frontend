import axios from "axios";
import { API_URL } from "../utils/api.js";
import { getMasterAdminToken } from "../utils/masterAdminAuth.js";

const servicesApi = axios.create({
  baseURL: `${API_URL}/api/services`,
  headers: { "Content-Type": "application/json" },
});

servicesApi.interceptors.request.use((config) => {
  const token = getMasterAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function extractError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export async function fetchServicesList(params = {}) {
  try {
    const response = await servicesApi.get("/", { params });
    return response.data?.data || { rows: [], pagination: {} };
  } catch (error) {
    throw new Error(extractError(error, "Unable to load services sections"));
  }
}

export async function fetchActiveServices() {
  try {
    const response = await servicesApi.get("/active");
    return response.data?.data || null;
  } catch (error) {
    throw new Error(extractError(error, "Unable to load active services section"));
  }
}

export async function createServices(payload) {
  try {
    const response = await servicesApi.post("/", payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to create services section"));
  }
}

export async function updateServices(id, payload) {
  try {
    const response = await servicesApi.put(`/${id}`, payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to update services section"));
  }
}

export async function removeServices(id) {
  try {
    await servicesApi.delete(`/${id}`);
    return true;
  } catch (error) {
    throw new Error(extractError(error, "Unable to delete services section"));
  }
}

export async function toggleServicesVisibility(id) {
  try {
    const response = await servicesApi.patch(`/toggle/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle visibility"));
  }
}

export async function toggleServicesPublish(id) {
  try {
    const response = await servicesApi.patch(`/publish/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle publish status"));
  }
}
