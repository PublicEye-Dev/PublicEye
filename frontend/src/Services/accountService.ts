import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { UserDto } from "../Types/user";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

const accountApiClient: AxiosInstance = axios.create({
  baseURL: `${normalizedBaseUrl}/api/account`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor pentru request (adaugă token JWT autentificat în header)
accountApiClient.interceptors.request.use(
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

// Interceptor pentru response (tratează erorile)
accountApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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

export async function getUserInfo(): Promise<UserDto> {
  const response = await accountApiClient.get<UserDto>("/info");
  return response.data;
}

export async function updateUserInfo(userDto: UserDto): Promise<UserDto> {
  const response = await accountApiClient.put<UserDto>("/update-info", userDto);
  return response.data;
}

export { accountApiClient };

