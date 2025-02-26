import { apiClient } from "@/config/axiosconfig";
import { IRegisterForm, ILoginForm, ILoginResponse } from "@/entities/auth";

export const authRegister = async (data: IRegisterForm) => {
  return await apiClient.post("auth/register", data);
};

export const authLogin = async (
  payload: ILoginForm
): Promise<ILoginResponse> => {
  const response = await apiClient.post<ILoginResponse>("auth/login", payload);

  return response.data;
};
