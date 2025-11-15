import axios, { type AxiosInstance } from "axios";
import type { User } from "../Types/user";
import type { Role } from "../Types/auth";
import type { PagedResponse } from "../Types/pagination";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

const userApiClient: AxiosInstance = axios.create({
  baseURL: `${normalizedBaseUrl}/api/manage-users`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

userApiClient.interceptors.request.use(
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

userApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const payload = error.response.data as { message?: string } | string;
      let message = "Eroare de la server";
      if (typeof payload === "string") {
        message = payload;
      } else if (payload?.message) {
        message = payload.message;
      }
      if (error.response.status === 401) {
        localStorage.removeItem("admin-auth-storage");
      }
      throw new Error(message);
    }
    if (error.request) {
      throw new Error("Serverul nu a răspuns. Verifică backend-ul.");
    }
    throw new Error("Eroare la configurarea request-ului.");
  }
);

export interface UserListParams {
  name?: string;
  role?: Role;
  page?: number;
  size?: number;
  sortDir?: "ASC" | "DESC";
}

export async function listUsers(
  params: UserListParams = {}
): Promise<PagedResponse<User>> {
  const response = await userApiClient.get<PagedResponse<User>>("/users", {
    params: {
      name: params.name,
      role: params.role,
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortDir: params.sortDir ?? "ASC",
    },
  });
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await userApiClient.delete(`/delete/${id}`);
}

export { userApiClient };

