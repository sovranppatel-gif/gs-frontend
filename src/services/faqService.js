import axios from "axios";
import { API_URL } from "../utils/api.js";
import { getMasterAdminToken } from "../utils/masterAdminAuth.js";

const faqApi = axios.create({
  baseURL: `${API_URL}/api/faq`,
  headers: { "Content-Type": "application/json" },
});

faqApi.interceptors.request.use((config) => {
  const token = getMasterAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function extractError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export async function fetchFaqList(params = {}) {
  try {
    const response = await faqApi.get("/", { params });
    return response.data?.data || { rows: [], pagination: {} };
  } catch (error) {
    throw new Error(extractError(error, "Unable to load FAQ sections"));
  }
}

export async function fetchActiveFaq() {
  try {
    const response = await faqApi.get("/active");
    return response.data?.data || null;
  } catch (error) {
    throw new Error(extractError(error, "Unable to load active FAQ section"));
  }
}

export async function createFaq(payload) {
  try {
    const response = await faqApi.post("/", payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to create FAQ section"));
  }
}

export async function updateFaq(id, payload) {
  try {
    const response = await faqApi.put(`/${id}`, payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to update FAQ section"));
  }
}

export async function removeFaq(id) {
  try {
    await faqApi.delete(`/${id}`);
    return true;
  } catch (error) {
    throw new Error(extractError(error, "Unable to delete FAQ section"));
  }
}

export async function toggleFaqVisibility(id) {
  try {
    const response = await faqApi.patch(`/toggle/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle visibility"));
  }
}

export async function toggleFaqPublish(id) {
  try {
    const response = await faqApi.patch(`/publish/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle publish status"));
  }
}
