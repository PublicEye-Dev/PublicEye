import { create } from "zustand";
import type { Role } from "../Types/auth";
import type { User } from "../Types/user";
import type { UserListParams } from "../Services/userService";
import { deleteUser, listUsers } from "../Services/userService";
import type { PagedResponse } from "../Types/pagination";

type SortDir = "ASC" | "DESC";

interface UserAdminState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  roleFilter: Role | "ALL";
  sortDir: SortDir;
  searchTerm: string;
  activeNameFilter: string;
  isDeleting: boolean;
}

interface UserAdminActions {
  fetchUsers: (override?: Partial<UserListParams>) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setRoleFilter: (role: Role | "ALL") => void;
  setSortDir: (dir: SortDir) => void;
  setSearchTerm: (term: string) => void;
  submitSearch: () => Promise<void>;
  resetSearch: () => Promise<void>;
  removeUser: (id: number) => Promise<void>;
}

type UserAdminStore = UserAdminState & UserAdminActions;

const initialState: UserAdminState = {
  users: [],
  isLoading: false,
  error: null,
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
  roleFilter: "ALL",
  sortDir: "ASC",
  searchTerm: "",
  activeNameFilter: "",
  isDeleting: false,
};

export const useUserAdminStore = create<UserAdminStore>((set, get) => ({
  ...initialState,

  fetchUsers: async (override) => {
    set({ isLoading: true, error: null });
    const state = get();
    try {
      const response: PagedResponse<User> = await listUsers({
        page: override?.page ?? state.page,
        size: override?.size ?? state.size,
        sortDir: override?.sortDir ?? state.sortDir,
        role:
          override?.role ??
          (state.roleFilter === "ALL" ? undefined : state.roleFilter),
        name: (override?.name ?? state.activeNameFilter) || undefined,
      });

      set({
        users: response.content,
        page: response.page,
        size: response.size,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Nu s-au putut încărca utilizatorii.",
      });
    }
  },

  setPage: (page) => {
    set({ page });
    return get().fetchUsers({ page });
  },

  setPageSize: (size) => {
    set({ size, page: 0 });
    return get().fetchUsers({ size, page: 0 });
  },

  setRoleFilter: (role) => {
    set({ roleFilter: role, page: 0, activeNameFilter: "", searchTerm: "" });
    return get().fetchUsers({
      page: 0,
      role: role === "ALL" ? undefined : role,
      name: undefined,
    });
  },

  setSortDir: (dir) => {
    set({ sortDir: dir, page: 0 });
    return get().fetchUsers({ sortDir: dir, page: 0 });
  },

  setSearchTerm: (term) => set({ searchTerm: term }),

  submitSearch: async () => {
    set({ page: 0, activeNameFilter: get().searchTerm.trim() });
    await get().fetchUsers({ page: 0, name: get().searchTerm.trim() });
  },

  resetSearch: async () => {
    set({ searchTerm: "", activeNameFilter: "", page: 0 });
    await get().fetchUsers({ page: 0, name: undefined });
  },

  removeUser: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      await deleteUser(id);
      await get().fetchUsers();
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Nu s-a putut șterge utilizatorul.",
      });
    } finally {
      set({ isDeleting: false });
    }
  },
}));
