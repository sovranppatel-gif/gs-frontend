import { API_URL } from "./api.js";
import { getMasterAdminToken } from "./masterAdminAuth.js";

export const defaultLandingSettings = {
  companyName: "Grow Skills Tech",
  tagline: "Innovation. Technology. Growth.",
  contactPhone: "+917470834876",
  contactEmail: "growskillstech@gmail.com",
  socialLinks: {
    facebook: "https://www.facebook.com/profile.php?id=61576749813417",
    instagram: "https://www.instagram.com/scholarsmediatech/?hl=en",
    linkedin: "https://www.linkedin.com/company/scholars-mediatech-pvt-ltd/",
    twitter: "https://x.com/scholarsmediatech",
    youtube: "https://www.youtube.com/@scholarsmediatech",
  },
  legalLinks: {
    privacy: "#",
    terms: "#",
  },
};

function buildUrl() {
  return `${API_URL}/api/site-settings/landing`;
}

export async function getLandingSettings() {
  const response = await fetch(buildUrl(), { method: "GET" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to load landing settings");
  }
  return { ...defaultLandingSettings, ...(data.settings || {}) };
}

export async function updateLandingSettings(payload) {
  const token = getMasterAdminToken();
  const response = await fetch(buildUrl(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to update landing settings");
  }
  return { ...defaultLandingSettings, ...(data.settings || {}) };
}
