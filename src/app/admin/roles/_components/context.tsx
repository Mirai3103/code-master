import { type Role } from "@/server/schema/role";
import { createContext, useContext } from "react";
export type DialogType = "add" | "edit" | "delete" | "permission";
interface RoleContextValue {
  selectedRow: Role | null | undefined;
  setSelectedRow: (role: Role | null) => void;
  open: DialogType | null;
  setOpen: (type: DialogType | null) => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

interface RoleProviderProps {
  children: React.ReactNode;
  value: RoleContextValue;
}

export function RoleProvider({ children, value }: RoleProviderProps) {
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}
