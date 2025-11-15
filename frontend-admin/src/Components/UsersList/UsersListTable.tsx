import "./UsersList.css";
import type { User } from "../../Types/user";
import { useState } from "react";

interface UsersListTableProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export default function UsersListTable({
  users,
  isLoading,
  error,
  onDelete,
  isDeleting,
}: UsersListTableProps) {
  const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);

  if (isLoading) {
    return (
      <div className="users-table-wrapper">
        <div className="users-empty-state">Se încarcă utilizatorii...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-table-wrapper">
        <div className="users-empty-state">{error}</div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="users-table-wrapper">
        <div className="users-empty-state">
          Nu există utilizatori pentru filtrele selectate.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>Nume complet</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Rol</th>
            <th>Departament</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const departmentLabel =
              user.role === "USER"
                ? "Cetățean"
                : user.departmentName ?? "Nerepartizat";

            return (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email ?? "-"}</td>
                <td>{user.phoneNumber ?? "-"}</td>
                <td>
                  <span className="users-role-chip">{user.role}</span>
                </td>
                <td>{departmentLabel}</td>
                <td>
                  <button
                    onClick={() => setUserPendingDelete(user)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Se șterge..." : "Șterge"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
      {userPendingDelete && (
        <div className="users-modal-overlay">
          <div className="users-delete-modal">
            <h3>Confirmă ștergerea</h3>
            <p>
              Ești sigur că vrei să ștergi utilizatorul{" "}
              <strong>{userPendingDelete.fullName}</strong>? Această acțiune nu
              poate fi anulată.
            </p>
            <div className="modal-actions">
              <button
                className="modal-button confirm-delete"
                onClick={() => {
                  onDelete(userPendingDelete.id);
                  setUserPendingDelete(null);
                }}
                disabled={isDeleting}
              >
                Da, șterge
              </button>
              <button
                className="modal-button cancel-delete"
                onClick={() => setUserPendingDelete(null)}
                disabled={isDeleting}
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
