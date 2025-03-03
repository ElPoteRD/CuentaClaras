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
import { useNavigate } from "react-router-dom";

export const useAccount = () => {
  const [accounts, setAccounts] = useState<AccountEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useStore();
  const { logoutSession } = useLogin();

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

  const handleCreateAccount = async (accountData: Omit<AccountEntity, "id" | "creationDate">) => {
    setIsLoading(true);
    try {
      const existToken = JSON.parse(localStorage.getItem("login-token") ?? "");
      const newAccountData: AccountEntity = { ...accountData, id: 0, creationDate: new Date() };
      const response = await createAccount(newAccountData, existToken.access_token);
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

  const handleUpdateAccount = async (id: number, accountData: Omit<AccountEntity, "id" | "creationDate">) => {
    setIsLoading(true);
    try {
      const existToken = JSON.parse(localStorage.getItem("login-token") ?? "");
      const accountToUpdate: AccountEntity = { ...accountData, id, creationDate: new Date() };
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
      await deleteAccount(id.toString());
      await handleGetAccounts();
      toast.success("Cuenta eliminada exitosamente");
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
          toast.error("Error al eliminar la cuenta", {
            description: err.message,
          });
        }
      }
    } finally {
      setIsLoading(false);
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
  };
};
