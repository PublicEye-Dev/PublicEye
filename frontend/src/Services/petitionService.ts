import axios, { type AxiosInstance } from "axios";
import type {
  Petition,
  PetitionCreateRequest,
  PetitionVoteRequest,
} from "../Types/petition";
import type { PagedResponse } from "../Types/pagination";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

const petitionApiClient: AxiosInstance = axios.create({
  baseURL: `${normalizedBaseUrl}/api/petitions`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

petitionApiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
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

petitionApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const responseData = error.response.data as { message?: string } | string;
      let message = "Eroare de la server";

      if (typeof responseData === "string") {
        message = responseData;
      } else if (responseData?.message) {
        message = responseData.message;
      }

      if (error.response.status === 401) {
        localStorage.removeItem("auth-storage");
      }

      throw new Error(message);
    } else if (error.request) {
      throw new Error("Nu s-a primit răspuns de la server");
    } else {
      throw new Error("Eroare la configurarea request-ului");
    }
  }
);

export async function createPetition(
  request: PetitionCreateRequest,
  imageFile?: File | null
): Promise<Petition> {
  const formData = new FormData();
  formData.append("title", request.title);
  formData.append("receiver", request.receiver);
  formData.append("problem", request.problem);
  formData.append("solution", request.solution);
  if (typeof request.userId === "number") {
    formData.append("userId", String(request.userId));
  }
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await petitionApiClient.post<Petition>("", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getUserPetitions(userId: number): Promise<Petition[]> {
  const response = await petitionApiClient.get<Petition[]>(`/user/${userId}`);
  return response.data;
}

export async function getPetitionById(id: number): Promise<Petition> {
  const response = await petitionApiClient.get<Petition>(`/${id}`);
  return response.data;
}

export interface PetitionQuery {
  status?: "ACTIVE" | "CLOSED" | "BANNED" | "ALL";
  createdAfter?: string; // ISO date-time
  createdBefore?: string; // ISO date-time
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export async function getPetitionsPaginated(
  query: PetitionQuery
): Promise<PagedResponse<Petition>> {
  const response = await petitionApiClient.get<PagedResponse<Petition>>(
    "/get-petitions-paginated",
    {
      params: {
        status: query.status && query.status !== "ALL" ? query.status : undefined,
        createdAfter: query.createdAfter,
        createdBefore: query.createdBefore,
        page: query.page ?? 0,
        size: query.size ?? 10,
        sortBy: query.sortBy ?? "createdAt",
        sortDir: query.sortDir ?? "DESC",
      },
    }
  );
  return response.data;
}

export async function votePetition(
  petitionId: number,
  payload: PetitionVoteRequest
): Promise<Petition> {
  const response = await petitionApiClient.post<Petition>(
    `/${petitionId}/vote`,
    payload
  );
  return response.data;
}

export { petitionApiClient };


