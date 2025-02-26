import { createContext, useContext, ReactNode, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UserItem {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface UsersContextType {
  data: UserItem[];
  isLoading: boolean;
  error: Error | undefined;
  addItem: (item: Omit<UserItem, "id">) => Promise<UserItem>;
  updateItem: (item: UserItem) => Promise<UserItem>;
  deleteItem: (id: number) => Promise<void>;
}

const API_URL = "https://jsonplaceholder.typicode.com/users";
const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [localData, setLocalData] = useState<UserItem[]>([]);

  const { isLoading, error = undefined } = useQuery<UserItem[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data } = await axios.get<UserItem[]>(API_URL);
        setLocalData(data.slice(0, 20));
        return data.slice(0, 20);
      } catch (err) {
        throw err as Error;
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newItem: Omit<UserItem, "id">) => {
      const { data } = await axios.post<UserItem>(API_URL, newItem);
      const newItemWithId = { ...data, id: localData.length + 1 };
      setLocalData((prev) => [...prev, newItemWithId]);
      return newItemWithId;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (item: UserItem) => {
      const { data } = await axios.put<UserItem>(`${API_URL}/${item.id}`, item);
      setLocalData((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/${id}`);
      setLocalData((prev) => prev.filter((item) => item.id !== id));
    },
  });

  const value = {
    data: localData,
    isLoading,
    error,
    addItem: addMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    deleteItem: deleteMutation.mutateAsync,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers error");
  }
  return context;
};
