import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios, { isAxiosError } from "axios";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import "./EditCategoryCard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

const adminApi = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});
const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const payload = error.response?.data;
    if (typeof payload === "string") {
      return payload;
    }
    if (payload && typeof payload === "object" && "message" in payload) {
      const maybeMessage = (payload as Record<string, unknown>).message;
      if (typeof maybeMessage === "string") {
        return maybeMessage;
      }
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};


adminApi.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("admin-auth-storage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // ignore parsing errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("admin-auth-storage");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

interface DepartmentOption {
  id: number;
  name: string;
}

interface SubcategoryOption {
  id: number;
  name: string;
}

const EditCategoryCard: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const categoryIdParam = params.get("id");
  const categoryId = categoryIdParam ? Number(categoryIdParam) : null;

  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<SubcategoryOption[]>(
    []
  );
  const [addSubcategoryId, setAddSubcategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // allSubcategories deja conține doar subcategoriile disponibile (datorită endpoint-ului /api/subcategories/available/{categoryId})
  const filteredAddOptions = useMemo(() => allSubcategories, [allSubcategories]);

  const fetchAvailableSubcategories = async (currentCategoryId: number) => {
    const response = await adminApi.get<
      Array<{ id: number; name: string }>
    >(`/api/subcategories/available/${currentCategoryId}`);
    return response.data ?? [];
  };

  const refreshData = async () => {
    if (!categoryId) {
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const [categoryResponse, departmentsResponse, availableResponse] =
        await Promise.all([
          adminApi.get(`/api/categories/${categoryId}`),
          adminApi.get<DepartmentOption[]>("/api/departments"),
          fetchAvailableSubcategories(categoryId),
        ]);

      const category = categoryResponse.data;
      setName(category?.name ?? "");
      setDepartmentId(
        category?.departmentId !== null && category?.departmentId !== undefined
          ? String(category.departmentId)
          : ""
      );

      setDepartments(departmentsResponse.data ?? []);
      setAllSubcategories(availableResponse ?? []);
      setAddSubcategoryId("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nu s-au putut încărca datele categoriei."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!categoryId) {
      setError("ID-ul categoriei este invalid. Întoarce-te la lista de categorii.");
      setIsLoading(false);
      return;
    }
    void refreshData();
  }, [categoryId]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!categoryId) {
      return;
    }

    if (!name.trim()) {
      setError("Numele categoriei este obligatoriu.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await adminApi.put(`/api/categories/${categoryId}/details`, {
        name: name.trim(),
        departmentId: departmentId ? Number(departmentId) : null,
      });

      setSuccess("Categoria a fost actualizată cu succes.");
      await refreshData();
    } catch (err) {
      setError(getErrorMessage(err, "Nu s-au putut salva modificările. Încearcă din nou."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubcategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!categoryId || !addSubcategoryId) {
      setError("Selectează o subcategorie pentru a o adăuga.");
      return;
    }

    setIsAdding(true);
    setError(null);
    setSuccess(null);

    try {
      await adminApi.post(
        `/api/categories/${categoryId}/subcategories/${addSubcategoryId}`
      );
      setSuccess("Subcategoria a fost adăugată cu succes.");
      await refreshData();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Nu s-a putut adăuga subcategoria selectată."
        )
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryId) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      await adminApi.delete(`/api/categories/${categoryId}`);
      navigate("/gestionare-categorii");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Nu s-a putut șterge categoria. Încearcă din nou."
        )
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return <div className="categorie-card">Se încarcă detaliile categoriei...</div>;
  }

  if (!categoryId) {
    return (
      <div className="categorie-card">
        ID-ul categoriei nu a fost specificat. Întoarce-te la lista de categorii.
      </div>
    );
  }

  return (
    <div className="categorie-card">
      <h2>Categorie</h2>

      {error && <p className="categories-error">{error}</p>}
      {success && <p className="categories-success">{success}</p>}

      <div className="categorie-card-body">
        <form className="form-stanga" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="categorie-id">ID:</label>
            <input type="text" id="categorie-id" value={categoryId} readOnly />
          </div>

          <div className="form-group">
            <label htmlFor="categorie-nume">Nume:</label>
            <input
              type="text"
              id="categorie-nume"
              placeholder="ex: Probleme stradale"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categorie-departament">Departament:</label>
            <select
              id="categorie-departament"
              value={departmentId}
              onChange={(event) => setDepartmentId(event.target.value)}
              disabled={isSaving}
            >
              <option value="">Alege un departament...</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="button-salvare"
            disabled={isSaving}
          >
            {isSaving ? "Se salvează..." : "Salvare"}
          </button>
        </form>

        <form
          className="form-dreapta"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="subcategorie-add">Adaugă subcategorie:</label>
              <select
                id="subcategorie-add"
                value={addSubcategoryId}
                onChange={(event) => setAddSubcategoryId(event.target.value)}
                disabled={isAdding || isSaving}
              >
                <option value="">Alege subcategoria...</option>
                {filteredAddOptions.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="button-salvare"
              onClick={(event) => void handleAddSubcategory(event)}
              disabled={!addSubcategoryId || isAdding || isSaving}
            >
              {isAdding ? "Se adaugă..." : "Adaugă subcategorie"}
            </button>
          </div>

          <button
            type="button"
            className="button-sterge delete-category"
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
          >
            Șterge categoria
          </button>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Confirmă ștergerea"
        message="Sunteți sigur că doriți să ștergeți această categorie?"
        confirmLabel="Confirmă"
        cancelLabel="Anulează"
        isProcessing={isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default EditCategoryCard;