// src/context/auth.jsx

import React, { createContext, useContext, useEffect, useState } from "react";

import { API_URL } from "../utils/api.js";

const AuthCtx = createContext(null);
const LS_KEY = "__bz_auth__";
const TOKEN_KEY = "__bz_token__";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [entitlements, setEntitlements] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEntitlements = async (token) => {
    try {
      // Use provided token or get from storage
      const authToken = token || getToken();
      if (!authToken) {
        console.warn("No token available for fetching entitlements");
        return;
      }
      
      // Clean the token
      const cleanToken = authToken.trim().replace(/^["']|["']$/g, '');
      
      const response = await fetch(`${API_URL}/api/subscriptions/entitlements`, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setEntitlements(result.entitlements);
        }
      } else if (response.status === 401) {
        console.warn("Token expired or invalid when fetching entitlements");
        // Don't clear auth here, let the component handle it
      }
    } catch (error) {
      console.error("Fetch entitlements error:", error);
    }
  };

  // Load user from localStorage and verify with server
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const saved = localStorage.getItem(LS_KEY);
      
      if (token && saved) {
        try {
          // First, restore from localStorage immediately (optimistic restore)
          const parsed = JSON.parse(saved);
          if (parsed.user) {
            setUser(parsed.user);
            setEntitlements(parsed.entitlements || { ims: "none", parking: "none", school: "none", pharmacy: "none", reports: "none" });
          }

          // Clean token
          const cleanToken = token.trim().replace(/^["']|["']$/g, '');

          // Then verify token with server in background
          try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
              headers: {
                'Authorization': `Bearer ${cleanToken}`
              }
            });

            if (response.ok) {
              const result = await response.json();
              if (result.success) {
                // Update with fresh data from server
                setUser(result.user);
                // Fetch fresh entitlements
                await fetchEntitlements(cleanToken);
              } else {
                // Invalid token, clear storage
                console.warn("Token verification failed - clearing auth");
                clearAuth();
              }
            } else if (response.status === 401) {
              // Token expired or invalid
              console.warn("Token expired or invalid - clearing auth");
              clearAuth();
            } else {
              // Other error - keep local data but log error
              console.warn("Auth verification error, keeping local data:", response.status);
            }
          } catch (fetchError) {
            // Network error - keep local data
            console.warn("Network error during auth verification, keeping local data:", fetchError);
          }
        } catch (parseError) {
          // Invalid localStorage data
          console.error("Error parsing saved auth data:", parseError);
          clearAuth();
        }
      } else {
        // No saved data - user not logged in
        setUser(null);
        setEntitlements(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setEntitlements(null);
  };

  const save = (u, e, token) => {
    setUser(u);
    setEntitlements(e || { ims: "none", parking: "none", school: "none", pharmacy: "none", reports: "none" });
    localStorage.setItem(LS_KEY, JSON.stringify({ user: u, entitlements: e }));
    if (token) {
      // Clean token before storing (remove quotes, trim whitespace)
      let cleanToken = typeof token === 'string' ? token : String(token);
      cleanToken = cleanToken.trim();
      cleanToken = cleanToken.replace(/^["']+|["']+$/g, ''); // Remove quotes from start/end
      cleanToken = cleanToken.trim(); // Trim again after quote removal
      if (cleanToken && cleanToken.length > 0) {
        localStorage.setItem(TOKEN_KEY, cleanToken);
      }
    }
  };

  const loginUser = async (userData, token, serverEntitlements) => {
    // Use server entitlements if provided, otherwise fetch
    if (serverEntitlements) {
      save(userData, serverEntitlements, token);
    } else {
      save(userData, null, token);
      // Fetch fresh entitlements if not provided
      await fetchEntitlements(token);
    }
  };

  const loginAgent = async (userData, token) => {
    save(userData, null, token);
    // Agents don't have module entitlements
    setEntitlements(null);
  };

  const activateModules = async (mods) => {
    const e = { ...(entitlements || { ims: "none", parking: "none", school: "none", pharmacy: "none", reports: "none" }), ...mods };
    setEntitlements(e);
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      localStorage.setItem(LS_KEY, JSON.stringify({ user: parsed.user, entitlements: e }));
    }
  };

  const markEmailVerified = () => {
    if (user) {
      const updated = { ...user, verifiedEmail: true };
      setUser(updated);
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem(LS_KEY, JSON.stringify({ user: updated, entitlements: parsed.entitlements }));
      }
    }
  };

  const markMobileVerified = () => {
    if (user) {
      const updated = { ...user, verifiedMobile: true };
      setUser(updated);
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem(LS_KEY, JSON.stringify({ user: updated, entitlements: parsed.entitlements }));
      }
    }
  };

  const logout = () => {
    clearAuth();
  };

  const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    // Clean token if it has quotes or extra whitespace
    if (token) {
      // Remove all quotes (single and double) from start and end
      // Remove all whitespace from start and end
      // Remove any null/undefined characters
      let cleanToken = token.trim();
      cleanToken = cleanToken.replace(/^["']+|["']+$/g, ''); // Remove quotes from start/end
      cleanToken = cleanToken.trim(); // Trim again after quote removal
      // Ensure token is not empty after cleaning and has valid length
      if (cleanToken && cleanToken.length > 0) {
        return cleanToken;
      }
    }
    return null;
  };

  const hasAnySubscription = () => {
    if (!entitlements) return false;
    return Object.values(entitlements).some(val => val !== 'none');
  };

  return (
    <AuthCtx.Provider value={{ 
      user, 
      entitlements, 
      loading,
      loginUser, 
      loginAgent, 
      activateModules, 
      markEmailVerified, 
      markMobileVerified, 
      logout,
      getToken,
      hasAnySubscription,
      fetchEntitlements: () => fetchEntitlements(getToken())
    }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};