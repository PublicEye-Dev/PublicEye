import axios, { type AxiosInstance } from "axios";
import type { Subcategory, SubcategoryCreatePayload } from "../Types/subcategory";
import type { PagedResponse } from "../Types/pagination";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

const subcategoryApi: AxiosInstance = axios.create({
  baseURL: `${normalizedBaseUrl}/api/subcategories`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

subcategoryApi.interceptors.request.use(
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

subcategoryApi.interceptors.response.use(
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

export interface SubcategoryListParams {
  page?: number;
  size?: number;
  categoryId?: number;
  categoryName?: string;
}

export async function listSubcategoriesPaginated(
  params?: SubcategoryListParams
): Promise<PagedResponse<Subcategory>> {
  const response = await subcategoryApi.get<PagedResponse<Subcategory>>("", {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      categoryId: params?.categoryId,
      categoryName: params?.categoryName,
    },
  });
  return response.data;
}

export async function createSubcategory(
  payload: SubcategoryCreatePayload
): Promise<Subcategory> {
  const response = await subcategoryApi.post<Subcategory>("", {
    name: payload.name,
    categoryId: payload.categoryId,
  });
  return response.data;
}

export async function updateSubcategory(
  id: number,
  payload: SubcategoryCreatePayload
): Promise<Subcategory> {
  const response = await subcategoryApi.put<Subcategory>(`/update/${id}`, {
    name: payload.name,
    categoryId: payload.categoryId,
  });
  return response.data;
}

export async function deleteSubcategory(id: number): Promise<void> {
  await subcategoryApi.delete(`/delete/${id}`);
}

export async function getSubcategoryById(id: number): Promise<Subcategory> {
  const response = await subcategoryApi.get<Subcategory>(`/${id}`);
  return response.data;
}

