import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";
import type { Product } from "../types";
import toast from "react-hot-toast";

export const useProducts = (type?: string, initialLimit: number = 9) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll({
        type,
        search: debouncedSearch,
        page,
        limit: initialLimit,
      });
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      setError("Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [type, debouncedSearch, page, initialLimit]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const createProduct = async (
    data: Parameters<typeof productService.create>[0],
  ) => {
    const product = await productService.create(data);
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct = async (
    id: string,
    data: Parameters<typeof productService.update>[1],
  ) => {
    const updated = await productService.update(id, data);
    setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
    return updated;
  };

  const deleteProduct = async (id: string) => {
    await productService.delete(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return {
    products,
    loading,
    error,
    refetch: fetch,
    createProduct,
    updateProduct,
    deleteProduct,
    page,
    setPage,
    totalPages,
    total,
    search,
    setSearch,
  };
};
