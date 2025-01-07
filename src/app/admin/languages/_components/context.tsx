import { type Language } from "@/server/schema/language.schema";
import { createContext, useContext } from "react";
export type DialogType = "add" | "edit" | "delete";
interface LanguageContextValue {
  selectedRow: Language | null | undefined;
  setSelectedRow: (language: Language | null) => void;
  open: DialogType | null;
  setOpen: (type: DialogType | null) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: React.ReactNode;
  value: LanguageContextValue;
}

export function LanguageProvider({ children, value }: LanguageProviderProps) {
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider",
    );
  }
  return context;
}
