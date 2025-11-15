import axios, { type AxiosInstance } from "axios";
import type { PagedResponse } from "../Types/pagination";
import type {
  Petition,
  PetitionStatus,
  PetitionUpdatePayload,
} from "../Types/petition";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

const petitionApi: AxiosInstance = axios.create({
  baseURL: `${normalizedBaseUrl}/api/petitions`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

petitionApi.interceptors.request.use(
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
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

petitionApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const payload = error.response.data as { message?: string } | string;
      let message = "Eroare de la server.";
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
        new Error("Nu s-a primit răspuns de la server. Verifică backend-ul.")
      );
    }
    return Promise.reject(
      new Error("A apărut o eroare la configurarea cererii.")
    );
  }
);

export interface AdminPetitionQuery {
  status?: PetitionStatus | "ALL";
  createdAfter?: string;
  createdBefore?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export async function fetchAdminPetitions(
  params: AdminPetitionQuery
): Promise<PagedResponse<Petition>> {
  const response = await petitionApi.get<PagedResponse<Petition>>("/admin", {
    params: {
      status:
        params.status && params.status !== "ALL" ? params.status : undefined,
      createdAfter: params.createdAfter,
      createdBefore: params.createdBefore,
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? "createdAt",
      sortDir: params.sortDir ?? "DESC",
    },
  });
  return response.data;
}

export async function getPetitionById(id: number): Promise<Petition> {
  const response = await petitionApi.get<Petition>(`/${id}`);
  return response.data;
}

export async function updatePetitionStatus(
  id: number,
  payload: PetitionUpdatePayload
): Promise<Petition> {
  const response = await petitionApi.patch<Petition>(
    `/${id}/status`,
    payload
  );
  return response.data;
}

export async function deletePetition(id: number): Promise<void> {
  await petitionApi.delete(`/delete/${id}`);
}

