import { create } from "zustand";
import type { Subcategory, SubcategoryCreatePayload } from "../Types/subcategory";
import {
  createSubcategory,
  deleteSubcategory,
  listSubcategoriesPaginated,
  updateSubcategory,
  type SubcategoryListParams,
} from "../Services/subcategoryService";
import { listCategories } from "../Services/categoryService";
import type { PagedResponse } from "../Types/pagination";

interface CategoryOption {
  id: number;
  name: string;
}

type CategoryFilter = number | "ALL";

interface SubcategoryState {
  subcategories: Subcategory[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  categoryFilter: CategoryFilter;
  categories: CategoryOption[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

interface SubcategoryActions {
  fetchSubcategories: (override?: Partial<SubcategoryListParams>) => Promise<void>;
  setCategoryFilter: (value: CategoryFilter) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  createSubcategory: (payload: SubcategoryCreatePayload) => Promise<void>;
  updateSubcategory: (id: number, payload: SubcategoryCreatePayload) => Promise<void>;
  removeSubcategory: (id: number) => Promise<void>;
}

type SubcategoryStore = SubcategoryState & SubcategoryActions;

const initialState: SubcategoryState = {
  subcategories: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  categoryFilter: "ALL",
  categories: [],
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
};

export const useSubcategoryStore = create<SubcategoryStore>((set, get) => ({
  ...initialState,

  fetchSubcategories: async (override) => {
    set({ isLoading: true, error: null });
    const current = get();
    const filterId =
      override?.categoryId ??
      (current.categoryFilter === "ALL"
        ? undefined
        : current.categoryFilter);
    
    let categoriesList = current.categories;
    if (!categoriesList.length) {
      try {
        const categoryResponse = await listCategories();
        categoriesList = categoryResponse.map((cat) => ({
          id: cat.id,
          name: cat.name,
        }));
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Nu s-au putut încărca categoriile.",
          isLoading: false,
        });
        return;
      }
    }

    const categoryNameParam =
      override?.categoryName ??
      (filterId !== undefined
        ? categoriesList.find((cat) => cat.id === filterId)?.name ??
          undefined
        : undefined);

    try {
      const pagedResponse = await listSubcategoriesPaginated({
        page: override?.page ?? current.page,
        size: override?.size ?? current.size,
        categoryId: filterId,
        categoryName: categoryNameParam,
      });

      set({
        subcategories: pagedResponse.content,
        categories: categoriesList,
        isLoading: false,
        page: pagedResponse.page,
        size: pagedResponse.size,
        totalPages: pagedResponse.totalPages,
        totalElements: pagedResponse.totalElements,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-au putut încărca subcategoriile.",
        isLoading: false,
      });
    }
  },

  setCategoryFilter: (value) => {
    const id = value === "ALL" ? undefined : value;
    const catName =
      id !== undefined
        ? get().categories.find((cat) => cat.id === id)?.name
        : undefined;
    set({
      categoryFilter: value,
      page: 0,
    });
    void get().fetchSubcategories({
      page: 0,
      categoryId: id,
      categoryName: catName,
    });
  },

  setPage: (page) => {
    set({ page });
    void get().fetchSubcategories({ page });
  },

  setPageSize: (size) => {
    set({ size, page: 0 });
    void get().fetchSubcategories({ page: 0, size });
  },

  createSubcategory: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      await createSubcategory(payload);
      await get().fetchSubcategories();
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-a putut crea subcategoria.",
      });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateSubcategory: async (id, payload) => {
    set({ isSubmitting: true, error: null });
    try {
      await updateSubcategory(id, payload);
      await get().fetchSubcategories();
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-a putut actualiza subcategoria.",
      });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  removeSubcategory: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await deleteSubcategory(id);
      await get().fetchSubcategories();
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-a putut șterge subcategoria.",
      });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));

