import { create } from "zustand";
import type { ReportListParams, Report, Status } from "../Types/report";
import { listReports, voteReport } from "../Services/reportService";

interface ReportState {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  filters: ReportListParams;
}

interface ReportActions {
  //incarca sesizarile de la backend
  fetchReports: (params?: ReportListParams) => Promise<void>;

  //actualizeaza filtrele
  setFilters: (filters: ReportListParams) => void;

  //voteaza o sesizare
  voteReportById: (id: number) => Promise<void>;

  //reseteaza store-ul la starea initiala
  reset: () => void;
}

//tip combinat pentru store
type ReportStore = ReportState & ReportActions;

const initialState: ReportState = {
  reports: [],
  isLoading: false,
  error: null,
  filters: {
    period: "30z", //default perioada este ultimele 30 de zile
  },
};

export const useReportStore = create<ReportStore>((set, get) => ({
  ...initialState,

  //incarcarea sesizarilor
  fetchReports: async (params?: ReportListParams) => {
    set({ isLoading: true, error: null });

    try {
      //foloseste parametrii din argument sau din filters
      const filtersToUse = params || get().filters;

      //apeleaza serviciul pentru a obtine sesizarile
      const reports = await listReports(filtersToUse);

      set({
        reports,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Eroare la incarcarea sesizarilor",
        isLoading: false,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  //actualizarea filtrelor
  setFilters: (filters: ReportListParams) => {
    set({ filters });

    //reincarca sesizarile cu noile filtre
    get().fetchReports(filters);
  },

  //votarea unei sesizari
  voteReportById: async (id: number) => {
    try {
      //apeleaza serviciul pentru a vota sesizarea
      const updatedReport = await voteReport(id);

      //actualizeaza sesizarea in lista din store
      set((state) => ({
        reports: state.reports.map((report) =>
          report.id === id ? updatedReport : report
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Eroare la votarea sesizarii",
      });
    }
  },

  //resetarea store-ului
  reset: () => {
    set({ ...initialState });
  },
}));
