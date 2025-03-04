import { apiClient } from "../config/axiosconfig";
import { CategoryEntity } from "@/entities/category";

export const categoryService = {
  async getCategories(token: string) {
    return await apiClient.get<CategoryEntity[]>("/category", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getCategoryById(id: number, token: string) {
    return await apiClient.get<CategoryEntity>(`/category/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async createCategory(data: Omit<CategoryEntity, "id">, token: string) {
    return await apiClient.post<CategoryEntity>("/category", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateCategory(
    id: number,
    data: Partial<CategoryEntity>,
    token: string
  ) {
    return await apiClient.patch<CategoryEntity>(`/category/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async deleteCategory(id: number, token: string) {
    return await apiClient.delete<void>(`/category/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
