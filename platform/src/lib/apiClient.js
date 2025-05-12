import { supabase } from "./supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"; // Default pour développement local

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session && session.access_token) {
    return {
      "Authorization": `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
  };
};

const apiClient = {
  get: async (path, params) => {
    const headers = await getAuthHeaders();
    const url = new URL(`${API_BASE_URL}${path}`);
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    return response.json();
  },

  post: async (path, data) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    return response.json();
  },

  put: async (path, data) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    return response.json();
  },

  delete: async (path) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    // DELETE peut ne pas retourner de contenu, ou un message de succès
    if (response.status === 204) return null; 
    return response.json();
  },
};

export default apiClient;

