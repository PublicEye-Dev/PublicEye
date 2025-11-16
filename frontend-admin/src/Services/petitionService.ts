import axios, { type AxiosInstance } from "axios";
import type { PagedResponse } from "../Types/pagination";
import type {
  Petition,
  PetitionStatus,
  PetitionUpdatePayload,
} from "../Types/petition";
import { departmentApi } from "./departmentService";

// Reuse the authenticated admin axios instance to ensure consistent Authorization headers
const petitionApi: AxiosInstance = departmentApi;

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
      if (error.response.status === 403) {
        message =
          "Nu aveți permisiunea de a accesa această resursă. Încercați să vă autentificați cu un cont ADMIN.";
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
  // Backend endpoint that supports ADMIN/USER/OPERATOR: /api/petitions/get-petitions-paginated
  const response = await petitionApi.get<PagedResponse<Petition>>("/api/petitions/get-petitions-paginated", {
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
  const response = await petitionApi.get<Petition>(`/api/petitions/${id}`);
  return response.data;
}

export async function updatePetitionStatus(
  id: number,
  payload: PetitionUpdatePayload
): Promise<Petition> {
  const response = await petitionApi.patch<Petition>(`/api/petitions/${id}/status`, payload);
  return response.data;
}

export async function deletePetition(id: number): Promise<void> {
  await petitionApi.delete(`/api/petitions/delete/${id}`);
}

