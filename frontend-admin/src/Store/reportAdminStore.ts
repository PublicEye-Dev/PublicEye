import { create } from "zustand";
import type { Report, Status } from "../Types/report";
import {
  listReportsPaginated,
  searchReports,
  type ReportPaginationParams,
} from "../Services/reportService";
import type { PagedResponse } from "../Types/pagination";

type SortDir = "ASC" | "DESC";

interface ReportAdminState {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  statusFilter: Status | "ALL";
  sortBy: string;
  sortDir: SortDir;
  searchTerm: string;
  isSearching: boolean;
  searchResults: Report[] | null;
}

interface ReportAdminActions {
  fetchReports: (override?: Partial<ReportPaginationParams>) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setStatusFilter: (status: Status | "ALL") => void;
  setSort: (sortBy: string, sortDir: SortDir) => void;
  setSearchTerm: (term: string) => void;
  executeSearch: () => Promise<void>;
  clearSearch: () => Promise<void>;
}

type ReportAdminStore = ReportAdminState & ReportAdminActions;

const initialState: ReportAdminState = {
  reports: [],
  isLoading: false,
  error: null,
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
  statusFilter: "ALL",
  sortBy: "createdAt",
  sortDir: "DESC",
  searchTerm: "",
  isSearching: false,
  searchResults: null,
};

export const useReportAdminStore = create<ReportAdminStore>((set, get) => ({
  ...initialState,

  fetchReports: async (override) => {
    set({ isLoading: true, error: null });
    const state = get();
    try {
      const response = await listReportsPaginated({
        page: override?.page ?? state.page,
        size: override?.size ?? state.size,
        sortBy: override?.sortBy ?? state.sortBy,
        sortDir: override?.sortDir ?? state.sortDir,
        status:
          override?.status ??
          (state.statusFilter !== "ALL" ? [state.statusFilter] : undefined),
        categoryId: override?.categoryId,
        subcategoryId: override?.subcategoryId,
      });

      set((current) => ({
        reports: response.content,
        page: response.page,
        size: response.size,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        isLoading: false,
        error: null,
        searchResults: current.isSearching ? current.searchResults : null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Nu s-au putut încărca sesizările.",
      });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchReports({ page });
  },

  setPageSize: (size) => {
    set({ size, page: 0 });
    get().fetchReports({ size, page: 0 });
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, page: 0 });
    get().fetchReports({ page: 0 });
  },

  setSort: (sortBy, sortDir) => {
    set({ sortBy, sortDir, page: 0 });
    get().fetchReports({ sortBy, sortDir, page: 0 });
  },

  setSearchTerm: (term) => set({ searchTerm: term }),

  executeSearch: async () => {
    const { searchTerm } = get();
    const trimmed = searchTerm.trim();
    if (trimmed.length < 3) {
      set({
        isSearching: false,
        searchResults: null,
        error: "Introdu cel puțin 3 caractere pentru căutare.",
      });
      return;
    }

    set({ isLoading: true, isSearching: true, error: null });
    try {
      const results = await searchReports(trimmed);
      set({
        searchResults: results,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Nu s-a putut realiza căutarea.",
      });
    }
  },

  clearSearch: async () => {
    set({
      isSearching: false,
      searchResults: null,
      searchTerm: "",
      error: null,
    });
    await get().fetchReports({ page: 0 });
  },
}));

