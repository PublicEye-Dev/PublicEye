import axios, { type AxiosInstance } from "axios";
import type {
  ReportListParams,
  Status,
  Report,
  ReportCreateRequest,
} from "../Types/report";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, ""); //scoate slashul final daca exista

//client-ul pentru API-ul de sesizari
const reportApiClient: AxiosInstance = axios.create({
  baseURL: `${normalizedBaseUrl}/api/complaints`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

reportApiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Eroare la parsarea token-ului", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

reportApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
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

//listarea de sesizari
export async function listReports(
  params?: ReportListParams
): Promise<Report[]> {
  const requestParams = new URLSearchParams();

  if (params?.status?.length) {
    params.status.forEach((status: Status) => {
      requestParams.append("status", status);
    });
  }

  if (params?.period) {
    requestParams.append("perioada", params.period);
  }

  const response = await reportApiClient.get<Report[]>("", {
    params: requestParams,
  });

  return response.data;
}

//crearea unei sesizari
export async function createReport(
  request: ReportCreateRequest,
  imageFile: File
): Promise<Report> {
  //crearea unui form data pentru a trimite request-ul si imaginea
  const formData = new FormData();

  //adaugarea request-ului in form data(asa asteapta backendul)
  formData.append(
    "data",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  );

  //adauga imaginea in form data
  formData.append("image", imageFile);

  //trimite request-ul la backend
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

//votarea unei sesizari
export async function voteReport(id: number): Promise<Report> {
  const response = await reportApiClient.post<Report>(`/${id}/vote`);
  return response.data;
}

export { reportApiClient };
