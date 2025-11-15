import axios, { type AxiosError, type AxiosInstance } from "axios";
import type { AdministrationLoginRequest, AuthResponse } from "../Types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const authClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

authClient.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("admin-auth-storage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const payload = error.response.data as { message?: string } | string;
      let message = "A apărut o eroare. Încearcă din nou.";
      if (typeof payload === "string") {
        message = payload;
      } else if (payload?.message) {
        message = payload.message;
      }
      if (error.response.status === 401) {
        localStorage.removeItem("admin-auth-storage");
      }
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(
        new Error("Serverul nu a răspuns. Încearcă din nou.")
      );
    }
    return Promise.reject(new Error("Eroare la trimiterea cererii."));
  }
);

export async function loginAdministration(
  payload: AdministrationLoginRequest
): Promise<AuthResponse> {
  const response = await authClient.post<AuthResponse>(
    "/administration/login",
    payload
  );
  return response.data;
}

export { authClient };

