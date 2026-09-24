import axios from "axios";
import { API_URL } from "../utils/api.js";
import { getMasterAdminToken } from "../utils/masterAdminAuth.js";

const processApi = axios.create({
  baseURL: `${API_URL}/api/process`,
  headers: { "Content-Type": "application/json" },
});

processApi.interceptors.request.use((config) => {
  const token = getMasterAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function extractError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export async function fetchProcessList(params = {}) {
  try {
    const response = await processApi.get("/", { params });
    return response.data?.data || { rows: [], pagination: {} };
  } catch (error) {
    throw new Error(extractError(error, "Unable to load process sections"));
  }
}

export async function fetchActiveProcess() {
  try {
    const response = await processApi.get("/active");
    return response.data?.data || null;
  } catch (error) {
    throw new Error(extractError(error, "Unable to load active process section"));
  }
}

export async function createProcess(payload) {
  try {
    const response = await processApi.post("/", payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to create process section"));
  }
}

export async function updateProcess(id, payload) {
  try {
    const response = await processApi.put(`/${id}`, payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to update process section"));
  }
}

export async function removeProcess(id) {
  try {
    await processApi.delete(`/${id}`);
    return true;
  } catch (error) {
    throw new Error(extractError(error, "Unable to delete process section"));
  }
}

export async function toggleProcessVisibility(id) {
  try {
    const response = await processApi.patch(`/toggle/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle visibility"));
  }
}

export async function toggleProcessPublish(id) {
  try {
    const response = await processApi.patch(`/publish/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle publish status"));
  }
}
