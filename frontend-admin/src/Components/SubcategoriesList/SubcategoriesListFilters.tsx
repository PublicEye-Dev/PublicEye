import "./SubcategoriesList.css";
import { useSubcategoryStore } from "../../Store/subcategoryStore";
import { useShallow } from "zustand/react/shallow";

interface SubcategoriesListFiltersProps {
  onAddSubcategory: () => void;
}

export default function SubcategoriesListFilters({
  onAddSubcategory,
}: SubcategoriesListFiltersProps) {
  const {
    categoryFilter,
    setCategoryFilter,
    categories,
  } = useSubcategoryStore(
    useShallow((state) => ({
      categoryFilter: state.categoryFilter,
      setCategoryFilter: state.setCategoryFilter,
      categories: state.categories,
    }))
  );

  const categoryOptions = categories ?? [];

  return (
    <div className="categories-actions">
      <div className="categories-filters">
        <select
          value={
            categoryFilter === "ALL"
              ? "ALL"
              : categoryFilter !== undefined
              ? String(categoryFilter)
              : "ALL"
          }
          onChange={(event) =>
            setCategoryFilter(
              event.target.value === "ALL"
                ? "ALL"
                : Number(event.target.value)
            )
          }
        >
          <option value="ALL">Toate categoriile</option>
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button className="add-category-button" onClick={onAddSubcategory}>
        Adaugă subcategorie
      </button>
    </div>
  );
}

