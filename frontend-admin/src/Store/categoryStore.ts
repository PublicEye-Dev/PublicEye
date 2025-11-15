import { create } from "zustand";
import type { Category, CategoryCreatePayload } from "../Types/category";
import {
  createCategory,
  deleteCategory,
  listCategoriesPaginated,
  searchCategories,
  type CategoryListParams,
} from "../Services/categoryService";
import { listDepartments } from "../Services/departmentService";
import type { PagedResponse } from "../Types/pagination";

interface DepartmentOption {
  id: number;
  name: string;
}

type DepartmentFilter = number | "ALL";

interface CategoryState {
  categories: Category[];
  searchResults: Category[] | null;
  isSearching: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  searchTerm: string;
  departmentFilter: DepartmentFilter;
  departments: DepartmentOption[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

interface CategoryActions {
  fetchCategories: (override?: Partial<CategoryListParams>) => Promise<void>;
  setSearchTerm: (value: string) => void;
  setDepartmentFilter: (value: DepartmentFilter) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  executeSearch: () => Promise<void>;
  clearSearch: () => void;
  createCategory: (payload: CategoryCreatePayload) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;
}

type CategoryStore = CategoryState & CategoryActions;

const initialState: CategoryState = {
  categories: [],
  searchResults: null,
  isSearching: false,
  isLoading: false,
  isSubmitting: false,
  error: null,
  searchTerm: "",
  departmentFilter: "ALL",
  departments: [],
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
};

function enhanceCategories(
  response: PagedResponse<Category>,
  departmentMap: Map<number, string>
): Category[] {
  return response.content.map((category) => ({
    ...category,
    departmentName:
      category.departmentId !== null
        ? departmentMap.get(category.departmentId) ?? "Nealocat"
        : "Nealocat",
  }));
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  ...initialState,

  fetchCategories: async (override) => {
    set({ isLoading: true, error: null });
    const current = get();
    const filterId =
      override?.departmentId ??
      (current.departmentFilter === "ALL"
        ? undefined
        : current.departmentFilter);
    let departmentsList = current.departments;
    if (!departmentsList.length) {
      const departmentResponse = await listDepartments();
      departmentsList = departmentResponse.map((dept) => ({
        id: dept.id,
        name: dept.name,
      }));
    }

    const departmentNameParam =
      override?.departmentName ??
      (filterId !== undefined
        ? departmentsList.find((dept) => dept.id === filterId)?.name ??
          undefined
        : undefined);

    try {
      const pagedResponse = await listCategoriesPaginated({
        page: override?.page ?? current.page,
        size: override?.size ?? current.size,
        departmentId: filterId,
        departmentName: departmentNameParam,
      });

      const departmentMap = new Map<number, string>();
      departmentsList.forEach((dept) => departmentMap.set(dept.id, dept.name));
      pagedResponse.content.forEach((category) => {
        if (
          category.departmentId !== null &&
          category.departmentName &&
          !departmentMap.has(category.departmentId)
        ) {
          departmentMap.set(category.departmentId, category.departmentName);
        }
      });
      const departmentOptions = Array.from(departmentMap.entries()).map(
        ([id, name]) => ({ id, name })
      );

      set({
        categories: enhanceCategories(pagedResponse, departmentMap),
        departments: departmentOptions,
        isLoading: false,
        page: pagedResponse.page,
        size: pagedResponse.size,
        totalPages: pagedResponse.totalPages,
        totalElements: pagedResponse.totalElements,
        searchResults: null,
        isSearching: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-au putut încărca categoriile.",
        isLoading: false,
      });
    }
  },

  setSearchTerm: (value) => set({ searchTerm: value }),

  setDepartmentFilter: (value) => {
    const id = value === "ALL" ? undefined : value;
    const deptName =
      id !== undefined
        ? get().departments.find((dept) => dept.id === id)?.name
        : undefined;
    set({
      departmentFilter: value,
      page: 0,
      isSearching: false,
      searchResults: null,
    });
    void get().fetchCategories({
      page: 0,
      departmentId: id,
      departmentName: deptName,
    });
  },

  setPage: (page) => {
    set({ page });
    void get().fetchCategories({ page });
  },

  setPageSize: (size) => {
    set({ size, page: 0 });
    void get().fetchCategories({ page: 0, size });
  },

  executeSearch: async () => {
    const keyword = get().searchTerm.trim();
    if (!keyword) {
      set({ isSearching: false, searchResults: null });
      return;
    }

    set({ isSearching: true, isLoading: true, error: null });
    try {
      const [results, departmentResponse] = await Promise.all([
        searchCategories(keyword),
        get().departments.length
          ? Promise.resolve(get().departments)
          : listDepartments(),
      ]);

      const departmentMap = new Map<number, string>();
      departmentResponse.forEach((dept) =>
        departmentMap.set(dept.id, dept.name)
      );

      const enhanced = results.map((category) => ({
        ...category,
        departmentName:
          category.departmentId !== null
            ? departmentMap.get(category.departmentId) ?? "Nealocat"
            : "Nealocat",
      }));

      set({
        searchResults: enhanced,
        isLoading: false,
        departments: departmentResponse,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-a putut căuta categoria.",
        isLoading: false,
      });
    }
  },

  clearSearch: () => {
    set({ searchTerm: "", isSearching: false, searchResults: null });
    void get().fetchCategories({ page: 0 });
  },

  createCategory: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      await createCategory(payload);
      if (get().isSearching) {
        await get().executeSearch();
      } else {
        await get().fetchCategories();
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-a putut crea categoria.",
      });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  removeCategory: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await deleteCategory(id);
      if (get().isSearching) {
        await get().executeSearch();
      } else {
        await get().fetchCategories();
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-a putut șterge categoria.",
      });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
