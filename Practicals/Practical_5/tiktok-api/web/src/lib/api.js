export function getApiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5050";
  return raw.replace(/\/$/, "").replace(/\/api\/?$/i, "");
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tiktok_token");
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("tiktok_token", token);
  else localStorage.removeItem("tiktok_token");
}

/**
 * @param {string} path - begins with /api/...
 * @param {RequestInit} [options]
 */
export async function apiFetch(path, options = {}) {
  const base = getApiBase();
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  } else if (isFormData) {
    // Let the browser set multipart boundary
    delete headers["Content-Type"];
  }
  const res = await fetch(`${base}${path}`, { ...options, headers });
  const text = await res.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* leave as string */
  }
  if (!res.ok) {
    const msg = typeof data === "object" && data?.message ? data.message : res.statusText;
    throw new Error(msg);
  }
  return data;
}
