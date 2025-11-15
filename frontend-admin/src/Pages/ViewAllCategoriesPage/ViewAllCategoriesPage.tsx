import { useEffect, useMemo, useState } from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import "./ViewAllCategoriesPage.css";
import { useCategoryStore } from "../../Store/categoryStore";
import { useShallow } from "zustand/react/shallow";
import CategoriesListFilters from "../../Components/CategoriesList/CategoriesListFilters";
import CategoriesListTable from "../../Components/CategoriesList/CategoriesListTable";
import CreateCategoryCard from "../../Components/CreateCategoryCard/CreateCategoryCard";
import ReportsListPagination from "../../Components/ReportsList/ReportsListPagination";

export default function ViewAllCategoriesPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    categories,
    isLoading,
    error,
    departments,
    createCategory,
    isSubmitting,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    setPageSize,
    isSearching,
    searchResults,
  } = useCategoryStore(
    useShallow((state) => ({
      categories: state.categories,
      isLoading: state.isLoading,
      error: state.error,
      departments: state.departments,
      createCategory: state.createCategory,
      isSubmitting: state.isSubmitting,
      page: state.page,
      size: state.size,
      totalPages: state.totalPages,
      totalElements: state.totalElements,
      setPage: state.setPage,
      setPageSize: state.setPageSize,
      isSearching: state.isSearching,
      searchResults: state.searchResults,
    }))
  );

  useEffect(() => {
    void useCategoryStore.getState().fetchCategories();
  }, []);

  const displayedCategories = useMemo(
    () => (isSearching ? searchResults ?? [] : categories),
    [isSearching, searchResults, categories]
  );

  const handleCreateCategory = (payload: {
    name: string;
    departmentId: number | null;
  }) => createCategory(payload);

  return (
    <div className="page-container">
      <div className="page-navbar">
        <Navbar />
      </div>

      <div className="categories-page-content">
        <h1 className="categories-page-title">Gestionare categorii</h1>
        <CategoriesListFilters onAddCategory={() => setModalOpen(true)} />
        <CategoriesListTable
          categories={displayedCategories}
          isLoading={isLoading}
          error={error}
        />
        {!isSearching && (
          <ReportsListPagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={size}
            onPageChange={setPage}
            onSizeChange={setPageSize}
            isDisabled={isLoading}
            entityLabel="categorii"
          />
        )}
      </div>

      <CreateCategoryCard
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateCategory}
        departments={departments}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}

