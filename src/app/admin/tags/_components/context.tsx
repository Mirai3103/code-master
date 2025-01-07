import { type Tag } from "@/server/schema/tag.schema";
import { createContext, useContext } from "react";
export type DialogType = "add" | "edit" | "delete";
interface TagContextValue {
  selectedRow: Tag | null | undefined;
  setSelectedRow: (tag: Tag | null) => void;
  open: DialogType | null;
  setOpen: (type: DialogType | null) => void;
}

const TagContext = createContext<TagContextValue | undefined>(undefined);

interface TagProviderProps {
  children: React.ReactNode;
  value: TagContextValue;
}

export function TagProvider({ children, value }: TagProviderProps) {
  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
}

export function useTagContext() {
  const context = useContext(TagContext);
  if (context === undefined) {
    throw new Error("useTagContext must be used within a TagProvider");
  }
  return context;
}
