import { type Problem } from "@/server/schema/problem.schema";
import { createContext, useContext } from "react";
export type DialogType = "add" | "edit" | "delete";
interface ProblemContextValue {
  selectedRow: Problem | null | undefined;
  setSelectedRow: (problem: Problem | null) => void;
  open: DialogType | null;
  setOpen: (type: DialogType | null) => void;
}

const ProblemContext = createContext<ProblemContextValue | undefined>(
  undefined,
);

interface ProblemProviderProps {
  children: React.ReactNode;
  value: ProblemContextValue;
}

export function ProblemProvider({ children, value }: ProblemProviderProps) {
  return (
    <ProblemContext.Provider value={value}>{children}</ProblemContext.Provider>
  );
}

export function useProblemContext() {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error("useProblemContext must be used within a ProblemProvider");
  }
  return context;
}
