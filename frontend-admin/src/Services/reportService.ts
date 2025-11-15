import axios, { type AxiosInstance } from "axios";
import type {
  Report,
  ReportCreateRequest,
  ReportListParams,
  Status,
} from "../Types/report";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

const reportApiClient: AxiosInstance = axios.create({
  baseURL: `${normalizedBaseUrl}/api/complaints`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

reportApiClient.interceptors.request.use(
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

reportApiClient.interceptors.response.use(
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
      throw new Error(
        "Nu s-a primit răspuns de la server. Verifică dacă backend-ul rulează."
      );
    }
    throw new Error("Eroare la configurarea request-ului");
  }
);

export async function listReports(
  params?: ReportListParams
): Promise<Report[]> {
  const queryParams = new URLSearchParams();

  if (params?.status?.length) {
    params.status.forEach((status: Status) => {
      queryParams.append("status", status);
    });
  }

  if (params?.period) {
    queryParams.append("perioada", params.period);
  }

  const response = await reportApiClient.get<Report[]>("", {
    params: queryParams,
  });
  return response.data;
}

export async function createReport(
  request: ReportCreateRequest,
  imageFile: File
): Promise<Report> {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  );
  formData.append("image", imageFile);

  const response = await reportApiClient.post<Report>(
    "/add-complaint",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function voteReport(id: number): Promise<Report> {
  const response = await reportApiClient.post<Report>(`/${id}/vote`);
  return response.data;
}

export async function getReportById(id: number): Promise<Report> {
  const response = await reportApiClient.get<Report>(`/complaint/${id}`);
  return response.data;
}

export { reportApiClient };

