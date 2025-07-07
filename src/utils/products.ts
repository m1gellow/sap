import { Product } from "../lib/types";
import { SortConfig } from "../types";

export const filterProducts = (products: Product[], searchTerm: string, selectedCategory: string) => {
  let filtered = [...products];

  if (searchTerm) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm),
    );
  }

  if (selectedCategory !== 'all') {
    filtered = filtered.filter((product) => product.category === selectedCategory);
  }

  return filtered;
};

export const sortProducts = (products: Product[], sortBy: SortConfig) => {
  return [...products].sort((a, b) => {
    const fieldA = sortBy.field === 'price' ? a.priceValue : a[sortBy.field as keyof Product];
    const fieldB = sortBy.field === 'price' ? b.priceValue : b[sortBy.field as keyof Product];

    return sortBy.direction === 'asc' 
      ? fieldA > fieldB ? 1 : -1
      : fieldA < fieldB ? 1 : -1;
  });
};

export const getPaginationRange = (currentPage: number, totalPages: number) => {
  const totalVisiblePages = 5;
  const half = Math.floor(totalVisiblePages / 2);

  let start = Math.max(currentPage - half, 1);
  let end = Math.min(start + totalVisiblePages - 1, totalPages);

  if (end - start + 1 < totalVisiblePages) {
    start = Math.max(end - totalVisiblePages + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};