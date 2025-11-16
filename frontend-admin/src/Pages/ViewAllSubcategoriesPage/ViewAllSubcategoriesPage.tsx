import { useEffect, useState } from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import "./ViewAllSubcategoriesPage.css";
import { useSubcategoryStore } from "../../Store/subcategoryStore";
import { useShallow } from "zustand/react/shallow";
import SubcategoriesListFilters from "../../Components/SubcategoriesList/SubcategoriesListFilters";
import SubcategoriesListTable from "../../Components/SubcategoriesList/SubcategoriesListTable";
import CreateSubcategoryCard from "../../Components/CreateSubcategoryCard/CreateSubcategoryCard";
import ReportsListPagination from "../../Components/ReportsList/ReportsListPagination";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";
import type { Subcategory } from "../../Types/subcategory";

export default function ViewAllSubcategoriesPage() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [deletingSubcategory, setDeletingSubcategory] = useState<Subcategory | null>(null);

  const {
    subcategories,
    isLoading,
    error,
    categories,
    createSubcategory,
    updateSubcategory,
    removeSubcategory,
    isSubmitting,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    setPageSize,
  } = useSubcategoryStore(
    useShallow((state) => ({
      subcategories: state.subcategories,
      isLoading: state.isLoading,
      error: state.error,
      categories: state.categories,
      createSubcategory: state.createSubcategory,
      updateSubcategory: state.updateSubcategory,
      removeSubcategory: state.removeSubcategory,
      isSubmitting: state.isSubmitting,
      page: state.page,
      size: state.size,
      totalPages: state.totalPages,
      totalElements: state.totalElements,
      setPage: state.setPage,
      setPageSize: state.setPageSize,
    }))
  );

  useEffect(() => {
    void useSubcategoryStore.getState().fetchSubcategories();
  }, []);

  const handleCreateSubcategory = async (payload: {
    name: string;
    categoryId: number;
  }) => {
    await createSubcategory(payload);
    setCreateModalOpen(false);
  };

  const handleUpdateSubcategory = async (payload: {
    name: string;
    categoryId: number;
  }) => {
    if (editingSubcategory) {
      await updateSubcategory(editingSubcategory.id, payload);
      setEditingSubcategory(null);
    }
  };

  const handleDeleteSubcategory = async () => {
    if (deletingSubcategory) {
      await removeSubcategory(deletingSubcategory.id);
      setDeletingSubcategory(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-navbar">
        <Navbar />
      </div>

      <div className="categories-page-content">
        <h1 className="categories-page-title">Gestionare subcategorii</h1>
        <SubcategoriesListFilters onAddSubcategory={() => setCreateModalOpen(true)} />
        <SubcategoriesListTable
          subcategories={subcategories}
          isLoading={isLoading}
          error={error}
          onEdit={(subcategory) => setEditingSubcategory(subcategory)}
          onDelete={(subcategory) => setDeletingSubcategory(subcategory)}
          isSubmitting={isSubmitting}
        />
        <ReportsListPagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          size={size}
          onPageChange={setPage}
          onSizeChange={setPageSize}
          isDisabled={isLoading}
          entityLabel="subcategorii"
        />
      </div>

      {/* Create Modal */}
      <CreateSubcategoryCard
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateSubcategory}
        categories={categories}
        isSubmitting={isSubmitting}
        error={error}
      />

      {/* Edit Modal */}
      <CreateSubcategoryCard
        isOpen={editingSubcategory !== null}
        onClose={() => setEditingSubcategory(null)}
        onSave={handleUpdateSubcategory}
        categories={categories}
        isSubmitting={isSubmitting}
        error={error}
        initialData={
          editingSubcategory
            ? {
                name: editingSubcategory.name,
                categoryId: editingSubcategory.categoryId,
              }
            : undefined
        }
        mode="edit"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deletingSubcategory !== null}
        title="Șterge subcategorie"
        message={`Sigur doriți să ștergeți subcategoria "${deletingSubcategory?.name}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Șterge"
        cancelLabel="Anulează"
        isProcessing={isSubmitting}
        onConfirm={handleDeleteSubcategory}
        onCancel={() => setDeletingSubcategory(null)}
      />
    </div>
  );
}

