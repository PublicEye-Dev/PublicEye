import axios, { type AxiosInstance, isAxiosError } from "axios";
import type {
  CategoryOption,
  Department,
  DepartmentCreatePayload,
  DepartmentOperatorPayload,
  DepartmentUpdatePayload,
} from "../Types/department";
import type { User } from "../Types/user";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

const departmentApi: AxiosInstance = axios.create({
  baseURL: `${normalizedBaseUrl}`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

departmentApi.interceptors.request.use(
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

departmentApi.interceptors.response.use(
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
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(
        new Error("Nu s-a primit răspuns de la server. Verifică backend-ul.")
      );
    }
    return Promise.reject(new Error("Eroare la configurarea request-ului."));
  }
);

export async function listDepartments(): Promise<Department[]> {
  const response = await departmentApi.get<Department[]>("/api/departments");
  return response.data;
}

export async function createDepartment(
  payload: DepartmentCreatePayload
): Promise<Department> {
  const response = await departmentApi.post<Department>(
    "/api/admin/departments",
    payload
  );
  return response.data;
}

export async function deleteDepartment(id: number): Promise<void> {
  await departmentApi.delete(`/api/departments/delete/${id}`);
}

export async function listDepartmentsWithoutOperator(): Promise<
  Array<{ id: number; name: string }>
> {
  const response = await departmentApi.get<
    Array<{ id: number; name: string }>
  >("/api/manage-users/departments-without-operator");
  return response.data;
}

export async function createDepartmentOperator(
  payload: DepartmentOperatorPayload
): Promise<User> {
  const response = await departmentApi.post<User>(
    "/api/admin/operators",
    payload
  );
  return response.data;
}

export async function getDepartmentById(id: number): Promise<Department> {
  const response = await departmentApi.get<Department>(`/api/departments/${id}`);
  return response.data;
}

export async function updateDepartmentDetails(
  payload: DepartmentUpdatePayload
): Promise<Department> {
  const response = await departmentApi.put<Department>(
    "/api/departments/update-department",
    payload
  );
  return response.data;
}

export async function getDepartmentOperator(
  id: number
): Promise<User | null> {
  try {
    const response = await departmentApi.get<User>(
      `/api/admin/departments/${id}/operator`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        return null;
      }
    }
    throw error instanceof Error
      ? error
      : new Error("Nu s-a putut încărca operatorul departamentului.");
  }
}

export { departmentApi };

export async function listCategories(): Promise<CategoryOption[]> {
  const response = await departmentApi.get<CategoryOption[]>("/api/categories/list");
  return response.data;
}

export async function assignCategoryToDepartment(
  categoryId: number,
  categoryName: string,
  departmentId: number
): Promise<void> {
  await departmentApi.put(`/api/categories/${categoryId}/details`, {
    name: categoryName,
    departmentId,
  });
}

export async function removeCategoryFromDepartment(
  categoryId: number,
  categoryName: string
): Promise<void> {
  await departmentApi.put(`/api/categories/${categoryId}/details`, {
    name: categoryName,
    departmentId: null,
  });
}

