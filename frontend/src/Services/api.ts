import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { AuthResponse, OtpRequest, OtpVerifyRequest } from "../Types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//interceptor pentru request (adauga token JWT autentificat in header)
apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage"); //preia tokenul din localStorage
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage); //parseaza stringul in obiect
        const token = parsed?.state?.token; //preia tokenul din obiect
        if (token) {
          config.headers.Authorization = `Bearer ${token}`; //adauga tokenul in header pentru backend
        }
      } catch (error) {}
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//interceptor pentru response (preia datele din body si trateaza erorile)
apiClient.interceptors.response.use(
  (response) => {
    return response.data; //returneaza doar data
  },
  (error: AxiosError) => {
    if (error.response) {
      //backendul a raspuns cu o eroare
      const responseData = error.response.data as { message?: string } | string;
      let message = "Eroare de la server"; //mesajul implicit pentru erori

      if (typeof responseData === "string") {
        message = responseData;
      } else if (responseData?.message) {
        message = responseData.message;
      }

      //daca token e invalid sau expirat
      if (error.response.status === 401) {
        localStorage.removeItem("auth-storage");
        //nu redirectioneaza aici, componenta gestioneaza asta
      }

      throw new Error(message);
    } else if (error.request) {
      throw new Error("Nu s-a primit răspuns de la server");
    } else {
      throw new Error("Eroare la configurarea request-ului");
    }
  }
);

export async function requestOtp(identifier: string): Promise<void> {
  const request: OtpRequest = { identifier };
  await apiClient.post<void>("/user/request-otp", request);
}

export async function verifyOtp(
  identifier: string,
  otp: string
): Promise<AuthResponse> {
  const request: OtpVerifyRequest = { identifier, otp };
  return apiClient
    .post<AuthResponse>("/user/verify-otp", request)
    .then((response) => response.data);
}

export { apiClient };
