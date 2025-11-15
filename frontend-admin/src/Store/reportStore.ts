import { create } from "zustand";
import type { Report, ReportListParams } from "../Types/report";
import {
  getReportById,
  listReports,
  voteReport,
} from "../Services/reportService";

interface ReportState {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  filters: ReportListParams;
  selectedReport: Report | null;
  isLoadingDetails: boolean;
  detailsError: string | null;
}

interface ReportActions {
  fetchReports: (params?: ReportListParams) => Promise<void>;
  setFilters: (filters: ReportListParams) => void;
  voteReportById: (id: number) => Promise<void>;
  loadReportDetails: (id: number) => Promise<void>;
  selectReport: (report: Report | null) => void;
  reset: () => void;
}

type ReportStore = ReportState & ReportActions;

const initialState: ReportState = {
  reports: [],
  isLoading: false,
  error: null,
  filters: {
    period: "30z",
  },
  selectedReport: null,
  isLoadingDetails: false,
  detailsError: null,
};

export const useReportStore = create<ReportStore>((set, get) => ({
  ...initialState,
  fetchReports: async (params?: ReportListParams) => {
    set({ isLoading: true, error: null });
    try {
      const filtersToUse = params || get().filters;
      const reports = await listReports(filtersToUse);
      set({ reports, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-au putut încărca sesizările",
        isLoading: false,
      });
    }
  },
  setFilters: (filters: ReportListParams) => {
    set({ filters });
    get().fetchReports(filters);
  },
  voteReportById: async (id: number) => {
    try {
      const updated = await voteReport(id);
      set((state) => ({
        reports: state.reports.map((report) =>
          report.id === id ? updated : report
        ),
        selectedReport:
          state.selectedReport && state.selectedReport.id === id
            ? updated
            : state.selectedReport,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-a putut înregistra votul",
      });
    }
  },
  loadReportDetails: async (id: number) => {
    set({
      isLoadingDetails: true,
      detailsError: null,
      selectedReport: null,
    });
    try {
      const report = await getReportById(id);
      set({
        selectedReport: report,
        isLoadingDetails: false,
      });
    } catch (error) {
      set({
        detailsError:
          error instanceof Error
            ? error.message
            : "Nu s-au putut încărca detaliile sesizării",
        isLoadingDetails: false,
      });
    }
  },
  selectReport: (report) =>
    set({
      selectedReport: report,
      detailsError: null,
      isLoadingDetails: false,
    }),
  reset: () => set({ ...initialState }),
}));

