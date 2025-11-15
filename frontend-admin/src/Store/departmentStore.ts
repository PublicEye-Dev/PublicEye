import { create } from "zustand";
import type {
  Department,
  DepartmentCreatePayload,
  DepartmentOperatorPayload,
} from "../Types/department";
import {
  createDepartment,
  createDepartmentOperator,
  deleteDepartment,
  listDepartments,
  listDepartmentsWithoutOperator,
} from "../Services/departmentService";

interface DepartmentState {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
  availableDepartments: Array<{ id: number; name: string }>;
  availableLoading: boolean;
}

interface DepartmentActions {
  fetchDepartments: () => Promise<void>;
  refreshAvailableDepartments: () => Promise<void>;
  addDepartment: (payload: DepartmentCreatePayload) => Promise<void>;
  addOperator: (payload: DepartmentOperatorPayload) => Promise<void>;
  removeDepartment: (id: number) => Promise<void>;
  resetError: () => void;
}

type DepartmentStore = DepartmentState & DepartmentActions;

export const useDepartmentStore = create<DepartmentStore>((set, get) => ({
  departments: [],
  isLoading: false,
  error: null,
  isSaving: false,
  isDeleting: false,
  availableDepartments: [],
  availableLoading: false,

  async fetchDepartments() {
    set({ isLoading: true, error: null });
    try {
      const data = await listDepartments();
      set({ departments: data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Nu s-au putut încărca departamentele.",
        isLoading: false,
      });
    }
  },

  async refreshAvailableDepartments() {
    set({ availableLoading: true });
    try {
      const options = await listDepartmentsWithoutOperator();
      set({ availableDepartments: options, availableLoading: false });
    } catch (error) {
      set({ availableLoading: false });
    }
  },

  async addDepartment(payload) {
    set({ isSaving: true, error: null });
    try {
      const created = await createDepartment(payload);
      set((state) => ({
        departments: [created, ...state.departments],
        isSaving: false,
      }));
      void get().refreshAvailableDepartments();
    } catch (error) {
      set({
        isSaving: false,
        error:
          error instanceof Error ? error.message : "Nu s-a putut crea departamentul.",
      });
      throw error;
    }
  },

  async addOperator(payload) {
    set({ isSaving: true, error: null });
    try {
      await createDepartmentOperator(payload);
      set({ isSaving: false });
      await get().refreshAvailableDepartments();
    } catch (error) {
      set({
        isSaving: false,
        error:
          error instanceof Error ? error.message : "Nu s-a putut crea operatorul.",
      });
      throw error;
    }
  },

  async removeDepartment(id) {
    set({ isDeleting: true, error: null });
    try {
      await deleteDepartment(id);
      set((state) => ({
        departments: state.departments.filter((dept) => dept.id !== id),
        isDeleting: false,
      }));
      void get().refreshAvailableDepartments();
    } catch (error) {
      set({
        isDeleting: false,
        error:
          error instanceof Error ? error.message : "Nu s-a putut șterge departamentul.",
      });
    }
  },

  resetError() {
    set({ error: null });
  },
}));

