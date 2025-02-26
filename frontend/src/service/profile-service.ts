import { apiClient } from "@/config/axiosconfig";

export const getDataProfile = async (token: string) =>
  await apiClient.get(`/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
