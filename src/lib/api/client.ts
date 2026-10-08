const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 12_000;

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  detail?: string | Array<{ msg?: string }>;
  data: T;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function cookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
  return value ? decodeURIComponent(value) : null;
}

function errorMessage(payload: Partial<ApiEnvelope<unknown>>, fallback: string) {
  if (typeof payload.detail === "string") return payload.detail;
  if (Array.isArray(payload.detail)) {
    const messages = payload.detail.map((item) => item.msg).filter(Boolean);
    if (messages.length) return messages.join(". ");
  }
  return payload.message || fallback;
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abort = () => controller.abort();
  init.signal?.addEventListener("abort", abort, { once: true });
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ApiError("The API did not respond. Confirm the backend is running and try again.", 0);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
    init.signal?.removeEventListener("abort", abort);
  }
}

async function refreshSession() {
  const csrf = cookie("csrf_token");
  if (!csrf) return false;
  const response = await fetchWithTimeout(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRF-Token": csrf },
    cache: "no-store",
  });
  return response.ok;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retryAuthentication = true,
): Promise<ApiEnvelope<T>> {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrf = cookie("csrf_token");
    if (csrf) headers.set("X-CSRF-Token", csrf);
  }

  const response = await fetchWithTimeout(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (
    response.status === 401
    && retryAuthentication
    && !path.startsWith("/api/auth/login")
    && !path.startsWith("/api/auth/refresh")
    && !path.startsWith("/api/public/")
    && await refreshSession()
  ) {
    return request<T>(path, init, false);
  }

  const payload = await response.json().catch(() => ({})) as Partial<ApiEnvelope<T>>;
  if (!response.ok) {
    throw new ApiError(errorMessage(payload, `Request failed (${response.status})`), response.status);
  }
  return payload as ApiEnvelope<T>;
}

async function download(path: string) {
  let response = await fetchWithTimeout(`${API_URL}${path}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (response.status === 401 && await refreshSession()) {
    response = await fetchWithTimeout(`${API_URL}${path}`, {
      credentials: "include",
      cache: "no-store",
    });
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as Partial<ApiEnvelope<unknown>>;
    throw new ApiError(errorMessage(payload, "Download failed"), response.status);
  }
  return response;
}

export const apiClient = {
  request,
  download,
  csrfToken: () => cookie("csrf_token"),
  async healthCheck() {
    const response = await fetchWithTimeout(`${API_URL}/health/ready`, { cache: "no-store" });
    return response.ok;
  },
  async getApiStatus() {
    return request<{ status: string }>("/health/ready", {}, false);
  },
};

export default apiClient;
