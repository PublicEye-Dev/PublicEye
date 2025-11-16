export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
}

export interface SubcategoryCreatePayload {
  name: string;
  categoryId: number;
}

