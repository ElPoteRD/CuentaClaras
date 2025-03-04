import { apiClient } from "@/config/axiosconfig";
import { AccountEntity } from "@/entities/account";

// Obtener todas las cuentas del usuario
export const getAllAccount = async (token: string) =>
  await apiClient.get("/account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Obtener una cuenta específica
export const getAccountById = async (id: number, token: string) =>
  await apiClient.get(`/account/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Crear una nueva cuenta
export const createAccount = async (account: AccountEntity, token: string) =>
  await apiClient.post("/account/createAccount", account, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Actualizar una cuenta existente
export const updateAccount = async (
  id: number,
  account: AccountEntity,
  token: string
) =>
  await apiClient.patch(`/account/${id}`, account, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Eliminar una cuenta
export const deleteAccount = async ( token: string) =>
  await apiClient.delete(`/account/deleteAccount`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


