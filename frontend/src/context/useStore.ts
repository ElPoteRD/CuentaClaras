import { IUserProfile } from "@/entities/auth";
import { create } from "zustand";
import { AccountEntity } from "@/entities/account";
import { TransactionEntity } from "@/entities/transaction";
interface IUserData {
  data: IUserProfile | null;
  login: (newUser: IUserProfile) => void;
  logout: () => void;
  account: AccountEntity | null;
  transaction: TransactionEntity | null;
}

const useStore = create<IUserData>()((set) => ({
  data: null,
  login: (newData: IUserProfile) => set({ data: newData }),
  logout: () => set({ data: null, account: null, transaction: null }),
  account: null,
  transaction: null,
}));

export default useStore;
