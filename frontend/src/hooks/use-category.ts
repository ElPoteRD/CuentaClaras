import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { categoryService } from "@/service/category-service";
import { CategoryEntity } from "@/entities/category";
export const useCategory = () => {
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    const storedData = localStorage.getItem("login-token");
    if (!storedData) throw new Error("No hay sesión activa");
    return JSON.parse(storedData).access_token;
  };

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await categoryService.getCategory(token);
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener las categorías"
      );
      toast.error("Error al cargar las categorías");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCategoryById = async (id: number) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await categoryService.getCategoryById(id, token);
      setSelectedCategory(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener la categoría"
      );
      toast.error("Error al cargar la categoría");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (data: Omit<CategoryEntity, "id">) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await categoryService.createCategory(data, token);
      await fetchCategories();
      toast.success("Categoría creada exitosamente");
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la categoría"
      );
      toast.error("Error al crear la categoría");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: number, data: Partial<CategoryEntity>) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await categoryService.updateCategory(id, data, token);
      setCategories((prev) =>
        prev.map((category) => (category.id === id ? response.data : category))
      );
      toast.success("Categoría actualizada exitosamente");
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la categoría"
      );
      toast.error("Error al actualizar la categoría");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    setIsLoading(true);
    try {
      const token = getToken();
      await categoryService.deleteCategory(id, token);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      toast.success("Categoría eliminada exitosamente");
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar la categoría"
      );
      toast.error("Error al eliminar la categoría");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    selectedCategory,
    isLoading,
    error,
    fetchCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
