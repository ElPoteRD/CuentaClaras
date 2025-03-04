import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { TransactionEntity, updateTransaction } from "@/entities/transaction";
import { transactionService } from "@/service/transaction-service";

export const useTransaction = () => {
  const [transactions, setTransactions] = useState<TransactionEntity[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const getToken = useCallback(() => {
    try {
      const storedData = localStorage.getItem("login-token");
      if (!storedData) throw new Error("No hay sesión activa");
      const parsedToken = JSON.parse(storedData).access_token;
      setToken(parsedToken);
      return parsedToken;
    } catch (error) {
      setToken(null);
      throw new Error("No hay sesión activa");
    }
  }, []);

  useEffect(() => {
    try {
      getToken();
    } catch (error) {
      setError("No hay sesión activa");
    }
  }, [getToken]);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await transactionService.getAllTransactions(token);
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener las transacciones"
      );
      toast.error("Error al cargar las transacciones");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTransactionById = async (id: number) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await transactionService.getTransactionById(id, token);
      setSelectedTransaction(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener la transacción"
      );
      toast.error("Error al cargar la transacción");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (data: TransactionEntity) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await transactionService.createTransaction(data, token);
      setTransactions((prev) => [...prev, response.data]);
      toast.success("Transacción creada exitosamente");
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la transacción"
      );
      toast.error("Error al crear la transacción");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (id: number, data: updateTransaction) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await transactionService.updateTransaction(
        id,
        data,
        token
      );
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? response.data : transaction
        )
      );
      toast.success("Transacción actualizada exitosamente");
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar la transacción"
      );
      toast.error("Error al actualizar la transacción");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: number) => {
    setIsLoading(true);
    try {
      const token = getToken();
      await transactionService.deleteTransaction(id, token);

      // Actualizar el estado local
      setTransactions((prev) => prev.filter((t) => t.id !== id));

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar la transacción";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transactions,
    selectedTransaction,
    isLoading,
    error,
    token,
    fetchTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
