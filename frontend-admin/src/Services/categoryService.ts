import axios, { type AxiosInstance } from "axios";
import type { Category, CategoryCreatePayload } from "../Types/category";
import type { PagedResponse } from "../Types/pagination";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

const categoryApi: AxiosInstance = axios.create({
  baseURL: `${normalizedBaseUrl}/api/categories`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

categoryApi.interceptors.request.use(
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

categoryApi.interceptors.response.use(
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

export interface CategoryListParams {
  page?: number;
  size?: number;
  departmentId?: number;
  departmentName?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export async function listCategoriesPaginated(
  params?: CategoryListParams
): Promise<PagedResponse<Category>> {
  const response = await categoryApi.get<PagedResponse<Category>>("", {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sortBy: params?.sortBy ?? "name",
      sortDir: params?.sortDir ?? "ASC",
      departmentId: params?.departmentId,
      departmentName: params?.departmentName,
    },
  });
  return response.data;
}

export async function searchCategories(keyword: string): Promise<Category[]> {
  const response = await categoryApi.get<Category[]>("/search", {
    params: { keyword },
  });
  return response.data;
}

export async function createCategory(
  payload: CategoryCreatePayload
): Promise<Category> {
  const response = await categoryApi.post<Category>("/create-category", {
    name: payload.name,
    departmentId: payload.departmentId,
  });
  return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await categoryApi.delete(`/${id}`);
}

