import { apiClient } from "../config/axiosconfig";
import { IUserProfile } from "@/entities/auth";

export const getDataProfile = async (token: string) =>
  await apiClient.get(`/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateProfile = async (
  data: Partial<IUserProfile>,
  token: string,
  Id: number
) => {
  console.log("Enviando datos:", {
    data,
    Id,
    token: token,
  });

  return await apiClient.patch(`/users/${Id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadService = {
  async uploadAvatar(file: File, token: string) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  }
};

export const updatePassword = async (
  id: number,
  password: string,
  token: string
) =>
  await apiClient.patch(`users/${id}`, password, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
