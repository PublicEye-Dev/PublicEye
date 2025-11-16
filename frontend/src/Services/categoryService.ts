import axios, { type AxiosInstance, type AxiosError } from "axios";

export interface CategoryItem {
  id: number;
  name: string;
}

export interface SubcategoryItem {
  id: number;
  name: string;
  categoryId?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

function withAuth(client: AxiosInstance): AxiosInstance {
  client.interceptors.request.use((config) => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token as string | undefined;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // ignore
      }
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        const responseData = error.response.data as { message?: string } | string;
        let message = "Eroare de la server";
        if (typeof responseData === "string") message = responseData;
        else if (responseData?.message) message = responseData.message;
        if (error.response.status === 401) {
          localStorage.removeItem("auth-storage");
        }
        return Promise.reject(new Error(message));
      }
      if (error.request) return Promise.reject(new Error("Nu s-a primit răspuns de la server"));
      return Promise.reject(new Error("Eroare la configurarea request-ului"));
    }
  );

  return client;
}

const categoriesClient: AxiosInstance = withAuth(
  axios.create({
    baseURL: `${normalizedBaseUrl}/api/categories`,
    timeout: 30000,
  })
);

const subcategoriesClient: AxiosInstance = withAuth(
  axios.create({
    baseURL: `${normalizedBaseUrl}/api/subcategories`,
    timeout: 30000,
  })
);

export async function getCategoriesList(): Promise<CategoryItem[]> {
  const response = await categoriesClient.get<CategoryItem[]>("/list");
  return response.data;
}

export async function getSubcategoriesList(categoryId: number): Promise<SubcategoryItem[]> {
  // endpoint corect: /api/subcategories/category/{categoryId}
  const response = await subcategoriesClient.get<SubcategoryItem[]>(`/category/${categoryId}`);
  return response.data;
}
