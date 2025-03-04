import { apiClient } from "../config/axiosconfig";
import { TransactionEntity, updateTransaction } from "@/entities/transaction";

export const transactionService = {
  async createTransaction(data: TransactionEntity, token: string) {
    return await apiClient.post<TransactionEntity>(
      "/transaction/createTransaction",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async getAllTransactions(token: string) {
    return await apiClient.get<TransactionEntity[]>("/transaction", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getTransactionById(id: number, token: string) {
    return await apiClient.get<TransactionEntity>(`/transaction/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateTransaction(id: number, data: updateTransaction, token: string) {
    return await apiClient.patch<TransactionEntity>(
      `/transaction/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async deleteTransaction(id: number, token: string) {
    return await apiClient.delete<TransactionEntity>(`/transaction/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
