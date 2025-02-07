import { type User } from "@/server/schema/user.schema";
import { createContext, useContext } from "react";
export type DialogType = "add" | "edit" | "delete" | "permission";
interface UserContextValue {
  selectedRow: User | null | undefined;
  setSelectedRow: (user: User | null) => void;
  open: DialogType | null;
  setOpen: (type: DialogType | null) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
  value: UserContextValue;
}

export function UserProvider({ children, value }: UserProviderProps) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
