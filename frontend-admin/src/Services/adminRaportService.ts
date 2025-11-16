import axios, { type AxiosInstance } from "axios";
import type { RaportGeneral, RaportRequest } from "../Types/raport";
import { departmentApi } from "./departmentService";

const baseApi: AxiosInstance = departmentApi ?? axios.create({
	baseURL: (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, ""),
	timeout: 30000,
	headers: { "Content-Type": "application/json" },
});

export async function genereazaRaport(request: RaportRequest): Promise<RaportGeneral> {
	const response = await baseApi.post<RaportGeneral>("/api/admin/genereaza-raport", request);
	return response.data;
}


