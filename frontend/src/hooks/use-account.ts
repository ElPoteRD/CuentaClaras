import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import {
  getAllAccount,
  createAccount,
  updateAccount,
  deleteAccount,
} from "@/service/account-service";
import { AccountEntity } from "@/entities/account";
import { toast } from "sonner";
import useStore from "@/context/useStore";
import { useLogin } from "./use-login";
import * as accountService from "@/service/account-service";
import { useNavigate } from "react-router-dom";
import { useProfile } from "./use-profile";

export const useAccount = () => {
  const [accounts, setAccounts] = useState<AccountEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useStore();
  const { logoutSession } = useLogin();
  const { refreshProfile } = useProfile();

  useEffect(() => {
    handleGetAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetAccounts = async () => {
    setIsLoading(true);
    try {
      const existToken = JSON.parse(localStorage.getItem("login-token") ?? "");
      const response = await getAllAccount(existToken.access_token);
      setAccounts(response.data);
      setError(false);
      setErrorMessage(null);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          logoutSession();
          logout();
          refreshProfile();
          toast.error("Su sesión ha expirado");
          navigate("/");
        } else {
          setError(true);
          setErrorMessage(err.message);
          toast.error("Error al obtener las cuentas", {
            description: err.message,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (
    accountData: Omit<AccountEntity, "id" | "creationDate">
  ) => {
    setIsLoading(true);
    try {
      const existToken = JSON.parse(localStorage.getItem("login-token") ?? "");
      const newAccountData: AccountEntity = {
        ...accountData,
        id: 0,
        creationDate: new Date(),
      };
      const response = await createAccount(
        newAccountData,
        existToken.access_token
      );
      await handleGetAccounts();
      toast.success("Cuenta creada exitosamente");
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          logoutSession();
          logout();
          toast.error("Su sesión ha expirado");
          navigate("/");
        } else {
          setError(true);
          setErrorMessage(err.message);
          toast.error("Error al crear la cuenta", {
            description: err.message,
          });
        }
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAccount = async (
    id: number,
    accountData: Omit<AccountEntity, "id" | "creationDate">
  ) => {
    setIsLoading(true);
    try {
      const existToken = JSON.parse(localStorage.getItem("login-token") ?? "");
      const accountToUpdate: AccountEntity = {
        ...accountData,
        id,
        creationDate: new Date(),
      };
      await updateAccount(id, accountToUpdate, existToken.access_token);
      await handleGetAccounts();
      toast.success("Cuenta actualizada exitosamente");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          logoutSession();
          logout();
          toast.error("Su sesión ha expirado");
          navigate("/");
        } else {
          setError(true);
          setErrorMessage(err.message);
          toast.error("Error al actualizar la cuenta", {
            description: err.message,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    setIsLoading(true);
    try {
      const existToken = JSON.parse(localStorage.getItem("login-token") ?? "");
      await deleteAccount(id, existToken.access_token);
      setAccounts((prev) => prev.filter((acc) => acc.id !== id));
      toast.success("Cuenta eliminada correctamente");
      return true;
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.message || err.message;
        toast.error("Error al eliminar la cuenta", { description: message });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refetchAccounts = async () => {
    // Lógica para recargar las cuentas y sus balances
    try {
      const existToken = JSON.parse(localStorage.getItem("login-token") ?? "");
      const response = await accountService.getAllAccount(
        existToken.access_token
      );
      setAccounts(response.data);
    } catch (error) {
      toast.error("Error al actualizar los balances");
    }
  };

  return {
    accounts,
    isLoading,
    error,
    errorMessage,
    createAccount: handleCreateAccount,
    updateAccount: handleUpdateAccount,
    deleteAccount: handleDeleteAccount,
    refreshAccounts: handleGetAccounts,
    refetchAccounts,
  };
};
