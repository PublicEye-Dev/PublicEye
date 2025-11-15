import { useEffect } from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import "./ViewAllUsersPage.css";
import UsersListFilters from "../../Components/UsersList/UsersListFilters";
import UsersListTable from "../../Components/UsersList/UsersListTable";
import UsersListPagination from "../../Components/UsersList/UsersListPagination";
import { useUserAdminStore } from "../../Store/userAdminStore";
import { useShallow } from "zustand/react/shallow";

export default function ViewAllUsersPage() {
  const {
    fetchUsers,
    users,
    isLoading,
    error,
    page,
    totalPages,
    totalElements,
    size,
    setPage,
    setPageSize,
    removeUser,
    isDeleting,
  } = useUserAdminStore(
    useShallow((state) => ({
      fetchUsers: state.fetchUsers,
      users: state.users,
      isLoading: state.isLoading,
      error: state.error,
      page: state.page,
      totalPages: state.totalPages,
      totalElements: state.totalElements,
      size: state.size,
      setPage: state.setPage,
      setPageSize: state.setPageSize,
      removeUser: state.removeUser,
      isDeleting: state.isDeleting,
    }))
  );

  useEffect(() => {
    fetchUsers().catch(() => undefined);
  }, [fetchUsers]);

  return (
    <div className="view-all-users-page">
      <header className="view-all-users-header">
        <Navbar />
      </header>

      <main className="view-all-users-content">
        <div className="users-page-header">
          <p className="users-page-kicker">Gestionare utilizatori</p>
          <h1>Toți utilizatorii platformei</h1>
          <p>Filtrează, caută și administrează conturile echipei și ale operatorilor.</p>
        </div>

        <UsersListFilters />

        <UsersListTable
          users={users}
          isLoading={isLoading}
          error={error}
          onDelete={(id) => void removeUser(id)}
          isDeleting={isDeleting}
        />

        <UsersListPagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          size={size}
          onPageChange={(nextPage) => setPage(nextPage)}
          onSizeChange={(nextSize) => setPageSize(nextSize)}
          isDisabled={isLoading || isDeleting}
        />
      </main>
    </div>
  );
}

