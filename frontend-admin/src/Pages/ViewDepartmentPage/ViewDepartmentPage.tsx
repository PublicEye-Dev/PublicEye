import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import ViewDepartment from "../../Components/ViewDepartment/ViewDepartment";
import DeleteDepartmentModal from "../../Components/DeleteDepartmentModal/DeleteDepartmentModal";
import type { CategoryOption, Department } from "../../Types/department";
import type { User } from "../../Types/user";
import {
  assignCategoryToDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartmentOperator,
  listCategories,
  removeCategoryFromDepartment,
  updateDepartmentDetails,
} from "../../Services/departmentService";

const ViewDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [operator, setOperator] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryOption[]>([]);
  const [selectedAddCategoryId, setSelectedAddCategoryId] = useState<number | "">("");
  const [selectedRemoveCategoryId, setSelectedRemoveCategoryId] = useState<number | "">("");
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDepartmentDetails = useCallback(async () => {
    const deptId = id ? Number(id) : NaN;
    if (!id || isNaN(deptId) || deptId <= 0) {
      setError("ID-ul departamentului este invalid.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [departmentResponse, operatorResponse] = await Promise.all([
        getDepartmentById(deptId),
        getDepartmentOperator(deptId),
      ]);
      setDepartment(departmentResponse);
      setOperator(operatorResponse);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Nu s-au putut încărca detaliile departamentului."
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadCategories = useCallback(async () => {
    try {
      const categories = await listCategories();
      setAllCategories(Array.isArray(categories) ? categories : []);
    } catch (err) {
      setCategoryError(
        err instanceof Error
          ? err.message
          : "Nu s-au putut încărca categoriile."
      );
      setAllCategories([]);
    }
  }, []);

  useEffect(() => {
    void loadDepartmentDetails();
    void loadCategories();
  }, [loadDepartmentDetails, loadCategories]);

  useEffect(() => {
    if (department) {
      setFormName(department.name);
      setFormDescription(department.description);
    }
  }, [department]);

  const handleSaveDetails = async () => {
    if (!department) return;
    setIsSavingDetails(true);
    try {
      await updateDepartmentDetails({
        name: formName,
        description: formDescription,
        categories: department.categories.map((category) => category.name),
      });
      await loadDepartmentDetails();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Nu s-au putut salva detaliile departamentului."
      );
    } finally {
      setIsSavingDetails(false);
    }
  };

  const availableAddCategories = useMemo(() => {
    if (!department) return [];
    if (!Array.isArray(allCategories)) return [];
    const assignedIds = new Set(
      department.categories.map((category) => category.id)
    );
    return allCategories.filter((category) => !assignedIds.has(category.id));
  }, [allCategories, department]);

  const handleAddCategory = async () => {
    if (!department || !selectedAddCategoryId) return;
    if (!Array.isArray(allCategories)) return;
    const category = allCategories.find((item) => item.id === selectedAddCategoryId);
    if (!category) return;
    setCategoryError(null);
    setIsUpdatingCategory(true);
    try {
      await assignCategoryToDepartment(category.id, category.name, department.id);
      setSelectedAddCategoryId("");
      await Promise.all([loadDepartmentDetails(), loadCategories()]);
    } catch (addError) {
      setCategoryError(
        addError instanceof Error
          ? addError.message
          : "Nu s-a putut adăuga categoria."
      );
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  const handleRemoveCategory = async () => {
    if (!department || !selectedRemoveCategoryId) return;
    const category = department.categories.find(
      (item) => item.id === selectedRemoveCategoryId
    );
    if (!category) return;
    setCategoryError(null);
    setIsUpdatingCategory(true);
    try {
      await removeCategoryFromDepartment(category.id, category.name);
      setSelectedRemoveCategoryId("");
      await Promise.all([loadDepartmentDetails(), loadCategories()]);
    } catch (removeError) {
      setCategoryError(
        removeError instanceof Error
          ? removeError.message
          : "Nu s-a putut renunța la categorie."
      );
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  const handleDeleteDepartment = async () => {
    const deptId = id ? Number(id) : NaN;
    if (!id || isNaN(deptId) || deptId <= 0) return;
    setIsDeleting(true);
    try {
      await deleteDepartment(deptId);
      navigate("/gestionare-departamente");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Nu s-a putut șterge departamentul."
      );
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-navbar">
        <Navbar />
      </div>

      <div className="page-card">
        <ViewDepartment
          department={department}
          operator={operator}
          isLoading={isLoading}
          error={error}
          formName={formName}
          formDescription={formDescription}
          onNameChange={setFormName}
          onDescriptionChange={setFormDescription}
          onSaveDetails={handleSaveDetails}
          isSavingDetails={isSavingDetails}
          addCategoryOptions={availableAddCategories}
          selectedAddCategoryId={selectedAddCategoryId}
          onSelectAddCategory={setSelectedAddCategoryId}
          onAddCategory={handleAddCategory}
          removeCategoryOptions={department?.categories ?? []}
          selectedRemoveCategoryId={selectedRemoveCategoryId}
          onSelectRemoveCategory={setSelectedRemoveCategoryId}
          onRemoveCategory={handleRemoveCategory}
          isUpdatingCategory={isUpdatingCategory}
          onDeleteClick={() => setDeleteModalOpen(true)}
          isDeleting={isDeleting}
        />
        {categoryError && <p className="error-message">{categoryError}</p>}
      </div>

      <DeleteDepartmentModal
        isOpen={isDeleteModalOpen}
        department={department}
        isDeleting={isDeleting}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteDepartment}
      />
    </div>
  );
};

export default ViewDepartmentPage;