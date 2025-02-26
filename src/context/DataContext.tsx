import { createContext, useContext, ReactNode, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

interface DataItem {
  id: number;
  title: string;
  body: string;
}

interface DataContextType {
  data: DataItem[];
  isLoading: boolean;
  error: Error | undefined;
  addItem: (item: Omit<DataItem, "id">) => Promise<DataItem>;
  updateItem: (item: DataItem) => Promise<DataItem>;
  deleteItem: (id: number) => Promise<void>;
}

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [localData, setLocalData] = useState<DataItem[]>([]);

  const { isLoading, error } = useQuery<DataItem[], Error>({
    queryKey: ["data"],
    queryFn: async () => {
      try {
        const { data } = await axios.get<DataItem[]>(API_URL);
        setLocalData(data.slice(0, 20));
        return data.slice(0, 20);
      } catch (err) {
        throw err as Error;
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newItem: Omit<DataItem, "id">) => {
      const { data } = await axios.post<DataItem>(API_URL, newItem);
      const newItemWithId = { ...data, id: localData.length + 1 };
      setLocalData((prev) => [...prev, newItemWithId]);
      return newItemWithId;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (item: DataItem) => {
      const { data } = await axios.put<DataItem>(`${API_URL}/${item.id}`, item);
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

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData error");
  }
  return context;
};
