import axios from "axios";
import { API_URL } from "../utils/api.js";
import { getMasterAdminToken } from "../utils/masterAdminAuth.js";

const caseStudyApi = axios.create({
  baseURL: `${API_URL}/api/case-study`,
  headers: { "Content-Type": "application/json" },
});

caseStudyApi.interceptors.request.use((config) => {
  const token = getMasterAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function extractError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export async function fetchCaseStudyList(params = {}) {
  try {
    const response = await caseStudyApi.get("/", { params });
    return response.data?.data || { rows: [], pagination: {} };
  } catch (error) {
    throw new Error(extractError(error, "Unable to load case study strips"));
  }
}

export async function fetchActiveCaseStudy() {
  try {
    const response = await caseStudyApi.get("/active");
    return response.data?.data || null;
  } catch (error) {
    throw new Error(extractError(error, "Unable to load active case study strip"));
  }
}

export async function createCaseStudy(payload) {
  try {
    const response = await caseStudyApi.post("/", payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to create case study strip"));
  }
}

export async function updateCaseStudy(id, payload) {
  try {
    const response = await caseStudyApi.put(`/${id}`, payload);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to update case study strip"));
  }
}

export async function removeCaseStudy(id) {
  try {
    await caseStudyApi.delete(`/${id}`);
    return true;
  } catch (error) {
    throw new Error(extractError(error, "Unable to delete case study strip"));
  }
}

export async function toggleCaseStudyVisibility(id) {
  try {
    const response = await caseStudyApi.patch(`/toggle/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle visibility"));
  }
}

export async function toggleCaseStudyPublish(id) {
  try {
    const response = await caseStudyApi.patch(`/publish/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractError(error, "Unable to toggle publish status"));
  }
}
